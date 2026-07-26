# Project Monolith — v4.8.2 — Correctif audio QA

## Corrections

### Pose d’un glyphe

Le gain événementiel passe de `0.90` à `1.35`, soit environ 50 % de plus.

### Révélation d’une liaison

- gain relevé de `0.45` à `0.95` ;
- délai de 80 ms après le début de l’apparition visuelle ;
- suppression du cooldown pendant la séquence ;
- jusqu’à trois voix de liaison simultanées autorisées.

### Purification

Le gestionnaire n’était jamais appelé dans `resolvePurification()`.

Désormais :

- réussite : lecture de `purification.ogg` ;
- échec : lecture de `configuration-failure.ogg` ;
- arrêt propre du groupe sonore précédent ;
- aucun cooldown susceptible de supprimer le retour sonore.

## Inchangé

- fichiers audio ;
- graphismes ;
- gameplay ;
- Firebase ;
- synchronisation ;
- coût de la purification ;
- logique de réussite et d’échec.

Commit conseillé :

`Project Monolith v4.8.2 — Correctif audio QA`
