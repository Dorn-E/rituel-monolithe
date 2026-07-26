# Project Monolith — v4.8.4 — Correctif définitif purification

## Cause exacte

`app.js` contenait plusieurs définitions de `resolvePurification(success)`.
En JavaScript, la dernière définition remplaçait les précédentes et annulait
les appels audio ajoutés dans les versions antérieures.

## Correction

- toutes les anciennes définitions ont été supprimées ;
- une seule fonction `resolvePurification()` demeure ;
- réussite : lecture de `purification.ogg` ;
- échec : lecture de `configuration-failure.ogg` ;
- lecture déclenchée directement après `render()` et `update()` ;
- aucun cooldown ;
- priorité maximale ;
- diagnostic console conservé.

## Audit des autres fonctions

Autres noms de fonctions dupliqués détectés automatiquement :

Aucun autre doublon de déclaration nommé détecté.

Aucun autre doublon n’a été modifié automatiquement afin d’éviter une régression.

## Inchangé

- logique de purification ;
- coût en Étincelles ;
- animations ;
- Firebase ;
- synchronisation ;
- fichiers audio.

Commit conseillé :

`Project Monolith v4.8.4 — Correctif définitif purification`
