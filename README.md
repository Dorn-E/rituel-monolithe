# Project Monolith — v4.9.0 — Code Cleanup

## Purification unifiée

L’ancien système de purification a été supprimé intégralement :

- `purifyOverlay` ;
- `pendingPurification` ;
- `purificationBoosted` ;
- `beginPurification()` ;
- `choosePurification()` ;
- anciens boutons et anciens champs de synchronisation.

Un seul flux subsiste :

1. activation du mode de purification ;
2. sélection d’un glyphe corrompu ;
3. choix de l’assistance de Vathkül ;
4. réussite ou échec ;
5. fermeture immédiate de la fenêtre ;
6. mise à jour du glyphe ;
7. lecture du son ;
8. synchronisation.

## Initialisation robuste

Les scripts sont maintenant chargés après tous les overlays. Les six contrôles de purification sont vérifiés et câblés par `initializePurificationControls()`.

## Audio

- réussite : `purification.ogg` ;
- échec : `configuration-failure.ogg`.

## Compatibilité

Les anciens champs de purification reçus depuis Firebase sont simplement ignorés. Les états principaux du rituel restent compatibles.

Commit conseillé :

`Project Monolith v4.9.0 — Code Cleanup`
