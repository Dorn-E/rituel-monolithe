# Project Monolith — v4.5.4 — Corruption corrigée

## Audit

Le bouton était bien présent et `gmCorrupt()` existait toujours.  
Le problème venait de sorties anticipées silencieuses et d’un déclenchement
trop fragile pour diagnostiquer l’état réel du rituel.

## Corrections fonctionnelles

- bouton déclaré explicitement avec `type="button"` ;
- liaison `click` explicite et protégée ;
- message de Vathkül si le rituel se synchronise encore ;
- message de Vathkül si aucun glyphe n’est posé ;
- message si tous les glyphes posés sont déjà corrompus ;
- état corrompu appliqué avant le rendu ;
- modification marquée puis synchronisée une seule fois ;
- bouton brièvement désactivé contre les doubles clics.

## Corrections visuelles

- anneau rouge permanent ;
- halo cramoisi ;
- pulsation ;
- animation d’impact à l’arrivée de la corruption ;
- glyphe toujours lisible.

Commit conseillé :

`Project Monolith v4.5.4 — Corruption corrigée`
