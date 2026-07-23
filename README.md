# Project Monolith — v4.1.24 — Correctifs playtest

## Colonne de droite

- la hauteur de l’interface est désormais fixe sur grand écran ;
- le texte de Vathkül défile à l’intérieur de sa propre boîte ;
- le journal défile à l’intérieur de son panneau ;
- la zone du Monolithe ne s’agrandit plus quand du texte est ajouté ;
- le drag & drop reste stable.

## Liaisons entre glyphes

Une liaison dorée apparaît entre deux positions voisines lorsque :

- les deux glyphes sont correctement placés ;
- les deux glyphes sont adjacents sur l’anneau ;
- aucun des deux glyphes n’est corrompu.

Les liaisons sont recalculées après chaque rendu et lors d’un redimensionnement de la fenêtre.

Commit conseillé :

`Project Monolith v4.1.24 — Correctifs playtest`

Aucun changement Firebase.
