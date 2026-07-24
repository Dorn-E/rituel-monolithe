# Project Monolith — v4.5.1 — Correction scaling et Vathkül

## Corrections

### Cavités circulaires

La texture source est au format 3:2.  
La v4.5.0 l'étirait en carré avec `background-size: 100% 100%`, ce qui
transformait les cavités rondes en ellipses.

La texture conserve désormais ses proportions :

`background-size: auto 100%`

Elle remplit toute la hauteur du disque et ses côtés excédentaires sont
simplement rognés.

### Portrait central

Une règle de la v4.5.0 remplaçait le portrait de Vathkül par un fond noir.
Le portrait original `assets/ui/vathkul-face.png` est restauré au centre,
avec ses dimensions et son cercle d'origine.

## Inchangé

- image de texture ;
- positions des 8 logements ;
- glyphes ;
- liaisons ;
- drag & drop ;
- JavaScript ;
- Firebase ;
- gameplay ;
- partie inférieure.

Commit conseillé :

`Project Monolith v4.5.1 — Correction scaling et Vathkül`
