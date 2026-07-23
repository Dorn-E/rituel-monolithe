# Project Monolith — v4.3.1 — Verrouillage d’initialisation

Cette version corrige les instabilités possibles pendant les premières secondes de connexion.

## Fonctionnement

Après l’entrée dans le rituel :

1. l’interface affiche « Synchronisation du rituel… » ;
2. le Monolithe reste temporairement en lecture seule ;
3. Firebase charge ou crée l’état partagé ;
4. l’interface se déverrouille automatiquement.

Un délai de sécurité de 5 secondes empêche l’interface de rester bloquée si la connexion est lente ou indisponible.

## Objectif

Empêcher toute modification locale pendant que l’état initial partagé est encore en cours de chargement, afin d’éviter :

- un premier déplacement écrasé par Firebase ;
- un retour visuel à un ancien état ;
- une instabilité au démarrage.

Les règles du rituel, les liaisons et les Étincelles ne sont pas modifiées.

Commit conseillé :

`Project Monolith v4.3.1 — Verrouillage initialisation`

Aucune modification des règles Firebase.
