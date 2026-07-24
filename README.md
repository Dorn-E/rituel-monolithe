# Project Monolith — v4.4.1 — Correctif mur runique

## Cause du problème

Une ancienne règle CSS imposait :

`display:none !important`

sur `.board-wrap::before`, la couche choisie dans la v4.4.0.  
L’image du mur ne pouvait donc pas apparaître.

## Correction

- utilisation de la vraie couche `.rune-wall-layer`, déjà présente dans le HTML ;
- image de pierre appliquée directement à cette couche ;
- suppression des anciennes grandes runes CSS ;
- Monolithe, liaisons, emplacements et Vathkül maintenus au-dessus ;
- légère transparence du disque afin de donner l’impression que le mécanisme est encastré dans la pierre.

Aucun changement JavaScript ou Firebase.

Commit conseillé :

`Project Monolith v4.4.1 — Correctif mur runique`
