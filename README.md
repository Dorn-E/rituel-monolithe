# Project Monolith — v4.6.1b — Pose de glyphe corrigée

## Correctif principal

Les glyphes sont des images carrées sur fond noir.  
La v4.6.1 affichait à nouveau ce carré complet, qui débordait largement des cavités.

Cette version :

- masque chaque glyphe dans un cercle ;
- recentre précisément l’image ;
- conserve le redimensionnement spécifique du bouclier ;
- empêche tout fond noir carré de dépasser du logement.

## Animation de pose retravaillée

L’animation est désormais centrée sur la cavité :

- onde dorée plus visible ;
- bref éclair dans la pierre ;
- cavité qui semble absorber le glyphe ;
- léger rebond d’emboîtement ;
- durée totale d’environ une seconde.

## Inchangé

- drag & drop ;
- Firebase ;
- synchronisation ;
- corruption ;
- purification ;
- liaisons ;
- logique du rituel.

Commit conseillé :

`Project Monolith v4.6.1b — Pose glyphe corrigée`
