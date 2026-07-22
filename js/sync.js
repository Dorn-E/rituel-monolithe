import { firebaseConfig } from "./firebase-config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import {
  getAuth,
  signInAnonymously
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import {
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
let writeTimer=null;
let heartbeatTimer=null;
let connected=false;
let applyingInitialState=false;

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
    try{
      await setDoc(roomReference,{
        state:window.ProjectMonolith.getSharedState(),
        updatedAt:serverTimestamp(),
        updatedBy:currentUser.uid,
        updatedByName:window.ProjectMonolith.getParticipantName()
      },{merge:true});
      setStatus("Rituel partagé","online");
    }catch(error){
      console.error("Unable to synchronize ritual state:",error);
      setStatus("Erreur de liaison","error");
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
  leavePresence();
});
