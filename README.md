# Project Monolith — v4.4.2 — Huit anneaux

## Correction

Les huit anneaux de drag & drop sont désormais :

- tous visibles ;
- correctement répartis autour du Monolithe ;
- recentrés sur leurs coordonnées d’origine ;
- agrandis pour améliorer la lisibilité et le confort de manipulation.

## Cause du décalage

Une règle CSS ajoutée lors de l’intégration du mur imposait `position: relative` aux `.slot`.
Cela neutralisait leur positionnement absolu autour du cercle et provoquait leur décalage.

## Modifications

- rétablissement de `position: absolute` ;
- rétablissement de `transform: translate(-50%, -50%)` ;
- augmentation de la taille des anneaux ;
- ajustement des glyphes à 82 % de l’anneau.

Aucun changement JavaScript, Firebase ou logique de jeu.

Commit conseillé :

`Project Monolith v4.4.2 — Huit anneaux`
