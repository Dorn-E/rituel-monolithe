# Project Monolith — v4.8.0A-r1 — Correctif bouton de test audio

## Correction

Le bouton **Tester les sons** est maintenant injecté de manière explicite
dans la modale audio, juste au-dessus du bouton **Fermer**.

Cette révision garantit :

- présence du bouton dans le HTML final ;
- présence de la zone de statut ;
- largeur complète dans la modale ;
- impossibilité pour le CSS de masquer ou réduire la section ;
- conservation du listener `runTestSequence()`.

## Comportement attendu sans fichiers `.ogg`

- le bouton est visible ;
- la séquence indique les fichiers manquants ;
- les erreurs 404 audio restent normales tant que le pack sonore n’est pas ajouté ;
- aucune erreur JavaScript ne doit apparaître.

Commit conseillé :

`Project Monolith v4.8.0A-r1 — Bouton test audio`
