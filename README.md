# Project Monolith — v4.1.10 — Correctif d’entrée

Ce correctif répare le blocage de l’écran d’accès apparu dans la v4.1.9.

Cause :
- le JavaScript cherchait un bouton inexistant portant l’identifiant `purify` ;
- cette erreur interrompait le script avant l’initialisation du formulaire d’entrée.

Corrections :
- le Sprint 8 est désormais relié au vrai bouton `beginPurify` ;
- les événements de la fenêtre de purification ne sont enregistrés qu’une seule fois ;
- aucune règle Firebase n’est modifiée.

Commit conseillé :

`Project Monolith v4.1.10 — Correctif entrée Sprint 8`
