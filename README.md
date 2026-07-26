# Project Monolith — v4.8.3 — Correctif purification audio

## Correctif

Le son de purification est maintenant déclenché :

1. après la fermeture de l’overlay ;
2. après le rendu de l’interface ;
3. avec un délai de 120 ms ;
4. avec priorité maximale ;
5. sans cooldown ;
6. avec une seconde tentative automatique si la première lecture est refusée.

## Sons utilisés

- réussite : `purification.ogg`
- échec : `configuration-failure.ogg`

## Diagnostic

La console affiche désormais :

`[Monolithe][Audio] Purification`

avec :

- le résultat de la purification ;
- le son demandé ;
- la confirmation que la lecture a réellement démarré.

## Inchangé

- logique de purification ;
- coût en Étincelles ;
- animations ;
- Firebase ;
- synchronisation ;
- fichiers audio.

Commit conseillé :

`Project Monolith v4.8.3 — Correctif purification audio`
