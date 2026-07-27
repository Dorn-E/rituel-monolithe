# Project Monolith — v4.8.5 — Correctif du flux de purification

## Cause exacte

L’interface actuelle de purification utilise :

- `purificationTargetIndex`
- `purificationFlowOverlay`
- `closePurificationFlow()`

Mais `resolvePurification()` utilisait encore l’ancien système :

- `pendingPurification`
- `purifyOverlay`

La fonction quittait donc immédiatement avec `return`, ce qui empêchait :

- la fermeture de la fenêtre ;
- le changement d’état ;
- la lecture du son.

## Correction

La fonction prend désormais en charge les deux flux :

### Flux moderne

- cible : `purificationTargetIndex`
- fermeture : `closePurificationFlow()`
- réussite : suppression de la corruption
- échec : aucun second coût en Étincelles
- son de réussite ou d’échec

### Ancien flux

- cible : `pendingPurification`
- fermeture de `purifyOverlay`
- comportement historique conservé

## Diagnostic

La console affiche :

`[Monolithe][Audio] Purification v4.8.5`

avec le flux utilisé, la cible et l’état de lecture du son.

Commit conseillé :

`Project Monolith v4.8.5 — Correctif flux purification`
