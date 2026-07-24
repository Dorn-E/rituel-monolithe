# Project Monolith — v4.5.5 — Boutons déverrouillés

## Cause exacte

Pendant l’initialisation, les boutons étaient désactivés avec :

`element.disabled = initializationLocked || element.disabled`

Quand l’initialisation se terminait, `element.disabled` était déjà `true`.
Le bouton restait donc désactivé définitivement.

Cela empêchait totalement :

- le clic sur « Corrompre une gravure » ;
- l’appel à `gmCorrupt()` ;
- le message de Vathkül ;
- l’animation et le halo rouge.

## Correction

- mémorisation de l’état initial de chaque bouton avant verrouillage ;
- restauration exacte de cet état au déverrouillage ;
- sécurité supplémentaire pour réactiver les contrôles MJ après synchronisation ;
- aucun changement à la logique de corruption elle-même.

Commit conseillé :

`Project Monolith v4.5.5 — Boutons déverrouillés`
