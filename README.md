# Project Monolith — v4.2.0 — Liaisons refaites

Le système de liaisons a été entièrement remplacé.

## Fonctionnement

- aucune liaison avant une épreuve ;
- après **Éprouver la configuration**, une liaison apparaît entre chaque paire de glyphes adjacents correctement placés et non corrompus ;
- dès qu’un glyphe est déplacé, corrompu, purifié, échangé ou que le rituel est réinitialisé, toutes les liaisons disparaissent ;
- une nouvelle épreuve est nécessaire pour les révéler à nouveau.

## Technique

- suppression de l’ancienne couche SVG ;
- utilisation d’une couche HTML unique ;
- coordonnées fixes des huit emplacements ;
- aucun calcul dépendant de la taille du navigateur.

## Visuel

- filament doré ;
- halo lumineux ;
- apparition progressive ;
- pulsation douce ;
- Étincelle circulant le long de chaque liaison.

Commit conseillé :

`Project Monolith v4.2.0 — Liaisons refaites`
