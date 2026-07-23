# Project Monolith — v4.2.1 — Liaisons et stabilité

## Liaisons

La cause de leur absence était un ancien moteur SVG encore présent dans `update()` :

- il effaçait immédiatement les nouveaux filaments HTML ;
- il tentait ensuite de dessiner des chemins SVG dans une couche HTML.

Ce moteur est supprimé. Un seul système de liaisons subsiste désormais.

Les liaisons :

- apparaissent après **Éprouver la configuration** ;
- relient les glyphes adjacents correctement placés et non corrompus ;
- disparaissent après toute modification du plateau.

## Stabilité Firebase

Les rendus purement visuels ne déclenchent plus systématiquement une synchronisation.

De plus, un état distant est temporairement ignoré :

- pendant une écriture locale ;
- juste après une modification locale ;
- juste après la confirmation d’une écriture.

Cela empêche un ancien état Firebase de revenir écraser un déplacement récent ou de donner l’impression que le rituel se réinitialise.

## Autre correctif

Le générateur d’Étincelles vérifie désormais correctement la présence de **12** éléments et non plus 15.

Commit conseillé :

`Project Monolith v4.2.1 — Liaisons et stabilité`
