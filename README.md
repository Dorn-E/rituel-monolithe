# Project Monolith — v4.3.0 — Synchronisation stable

Cette version refond la synchronisation du rituel.

## Principe

- `render()` et `update()` ne synchronisent plus rien ;
- une modification locale réelle produit une révision unique ;
- les modifications rapprochées sont regroupées en une seule écriture ;
- Firebase ne peut plus réappliquer un état dont la révision est ancienne ou identique.

## Effets attendus

- une Étincelle dépensée ne revient plus ;
- le compteur passe bien de 12 à 11 ;
- un déplacement récent ne peut plus être écrasé par un ancien état distant ;
- le rituel ne doit plus sembler se réinitialiser spontanément.

## Nettoyage des anciennes valeurs

Toutes les références restantes à 15 Étincelles sont remplacées :

- état initial : 12 ;
- réinitialisation : 12 ;
- bande d’Étincelles : 12 ;
- progression du portail : calculée sur 12.

## Compatibilité

- anciens états de schéma 1 lisibles à la première connexion ;
- nouveaux états enregistrés en schéma 2 avec `stateRevision`.

Commit conseillé :

`Project Monolith v4.3.0 — Synchronisation stable`

Aucune modification des règles Firebase.
