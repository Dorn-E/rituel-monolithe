import { firebaseConfig } from "./firebase-config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import {
  getAuth,
  signInAnonymously
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  serverTimestamp,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const WRITE_DELAY_MS=180;
const PRESENCE_HEARTBEAT_MS=30000;

let database=null;
let currentUser=null;
let roomReference=null;
let participantReference=null;
let unsubscribeRoom=null;
let unsubscribeParticipants=null;
let unsubscribeSnapshots=null;
let writeTimer=null;
let heartbeatTimer=null;
let connected=false;
let applyingInitialState=false;
let localWriteInFlight=false;
let lastSuccessfulWriteAt=0;

function normalizeRoomId(value){
  return value
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g,"")
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g,"-")
    .replace(/-+/g,"-")
    .replace(/^-|-$/g,"")
    .slice(0,40);
}

function setStatus(text,statusClass=""){
  window.ProjectMonolith?.setSyncStatus(text,statusClass);
}

function scheduleStateWrite(){
  if(!connected || !roomReference || applyingInitialState)return;

  clearTimeout(writeTimer);
  setStatus("Synchronisation…","saving");

  writeTimer=setTimeout(async()=>{
    writeTimer=null;
    localWriteInFlight=true;
    try{
      await setDoc(roomReference,{
        state:window.ProjectMonolith.getSharedState(),
        updatedAt:serverTimestamp(),
        updatedBy:currentUser.uid,
        updatedByName:window.ProjectMonolith.getParticipantName()
      },{merge:true});
      lastSuccessfulWriteAt=Date.now();
      setStatus("Rituel partagé","online");
    }catch(error){
      console.error("Unable to synchronize ritual state:",error);
      setStatus("Erreur de liaison","error");
    }finally{
      localWriteInFlight=false;
    }
  },WRITE_DELAY_MS);
}

async function writePresence(){
  if(!participantReference)return;
  await setDoc(participantReference,{
    name:window.ProjectMonolith.getParticipantName(),
    updatedAt:serverTimestamp()
  },{merge:true});
}

async function leavePresence(){
  if(!participantReference)return;
  try{
    await deleteDoc(participantReference);
  }catch{
    // The browser may close before the request completes.
  }
}


function snapshotsCollection(){
  if(!roomReference)throw new Error("Room not connected");
  return collection(roomReference,"snapshots");
}
async function saveSnapshot(name){
  if(!connected)return;
  window.ProjectMonolith.setSnapshotStatus("Création…");
  try{
    await addDoc(snapshotsCollection(),{name,state:window.ProjectMonolith.getSharedState(),createdAt:serverTimestamp(),createdByName:window.ProjectMonolith.getParticipantName()});
    window.ProjectMonolith.setSnapshotStatus(`Sauvegarde « ${name} » créée.`);
  }catch(error){console.error(error);window.ProjectMonolith.setSnapshotStatus("Échec de la sauvegarde.");}
}
async function loadSnapshot(id){
  try{
    const snap=await getDoc(doc(snapshotsCollection(),id));
    if(!snap.exists())return;
    window.ProjectMonolith.applySharedState(snap.data().state);
    await setDoc(roomReference,{state:window.ProjectMonolith.getSharedState(),updatedAt:serverTimestamp(),updatedBy:currentUser.uid,updatedByName:window.ProjectMonolith.getParticipantName()},{merge:true});
    window.ProjectMonolith.setSnapshotStatus(`Sauvegarde « ${snap.data().name||'sans nom'} » chargée.`);
  }catch(error){console.error(error);window.ProjectMonolith.setSnapshotStatus("Échec du chargement.");}
}
async function deleteSnapshotById(id){
  try{await deleteDoc(doc(snapshotsCollection(),id));window.ProjectMonolith.setSnapshotStatus("Sauvegarde supprimée.");}
  catch(error){console.error(error);window.ProjectMonolith.setSnapshotStatus("Échec de la suppression.");}
}
window.ProjectMonolithSync={saveSnapshot,loadSnapshot,deleteSnapshot:deleteSnapshotById};

async function connectToRitual({participantName,ritualKey}){
  if(connected)return;
  const roomId=normalizeRoomId(ritualKey);
  if(!roomId)return;

  setStatus("Connexion…","connecting");

  try{
    const app=initializeApp(firebaseConfig);
    const auth=getAuth(app);
    database=getFirestore(app);

    const credential=await signInAnonymously(auth);
    currentUser=credential.user;
    roomReference=doc(database,"ritualRooms",roomId);
    participantReference=doc(
      collection(database,"ritualRooms",roomId,"participants"),
      currentUser.uid
    );

    await writePresence();

    const existingRoom=await getDoc(roomReference);
    if(existingRoom.exists() && existingRoom.data()?.state){
      applyingInitialState=true;
      window.ProjectMonolith.applySharedState(existingRoom.data().state);
      applyingInitialState=false;
    }else{
      await setDoc(roomReference,{
        state:window.ProjectMonolith.getSharedState(),
        createdAt:serverTimestamp(),
        updatedAt:serverTimestamp(),
        updatedBy:currentUser.uid,
        updatedByName:participantName
      });
    }

    unsubscribeRoom=onSnapshot(roomReference,snapshot=>{
      const data=snapshot.data();
      if(!data?.state || data.updatedBy===currentUser.uid)return;

      const localEditAt=window.ProjectMonolith.getLastLocalMutationAt?.()||0;
      const recentlyEdited=Date.now()-localEditAt<900;
      const recentlyWritten=Date.now()-lastSuccessfulWriteAt<650;

      if(localWriteInFlight || writeTimer || recentlyEdited || recentlyWritten){
        return;
      }

      window.ProjectMonolith.applySharedState(data.state);
      setStatus("Rituel partagé","online");
    },error=>{
      console.error("Room listener failed:",error);
      setStatus("Erreur de liaison","error");
    });

    const participantsCollection=collection(
      database,"ritualRooms",roomId,"participants"
    );
    unsubscribeParticipants=onSnapshot(
      participantsCollection,
      snapshot=>{
        const names=snapshot.docs
          .map(participant=>participant.data()?.name)
          .filter(Boolean);
        window.ProjectMonolith.setPresence(names);
      },
      error=>console.error("Presence listener failed:",error)
    );

    unsubscribeSnapshots=onSnapshot(
      snapshotsCollection(),
      snapshot=>{
        const items=snapshot.docs.map(d=>{
          const data=d.data();
          const date=data.createdAt?.toDate?.();
          return {id:d.id,label:`${data.name||'Sauvegarde'} — ${date?date.toLocaleString('fr-FR'):'enregistrement récent'}`};
        }).sort((a,b)=>b.label.localeCompare(a.label));
        window.ProjectMonolith.setSnapshotOptions(items);
      },
      error=>{console.error(error);window.ProjectMonolith.setSnapshotStatus("Impossible de lire les sauvegardes.");}
    );

    window.ProjectMonolith.onStateChange(scheduleStateWrite);
    connected=true;
    setStatus("Rituel partagé","online");

    heartbeatTimer=setInterval(()=>{
      writePresence().catch(error=>{
        console.error("Presence heartbeat failed:",error);
      });
    },PRESENCE_HEARTBEAT_MS);
  }catch(error){
    console.error("Firebase connection failed:",error);
    setStatus("Connexion impossible","error");
  }
}

window.addEventListener("project-monolith:entered",event=>{
  connectToRitual(event.detail);
});

window.addEventListener("pagehide",()=>{
  clearInterval(heartbeatTimer);
  unsubscribeRoom?.();
  unsubscribeParticipants?.();
  unsubscribeSnapshots?.();
  leavePresence();
});
