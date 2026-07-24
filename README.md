# Project Monolith — v4.7.1 — Panneau audio intégré

## Cause du panneau absent

La v4.7.0 cherchait la chaîne exacte `<body>` pour injecter les contrôles.
La page utilise une balise `body` avec des attributs : le bloc HTML n’a donc
jamais été créé, même si `audio.js` et le CSS existaient bien.

## Correction

Un panneau natif **Ambiance du Monolithe** est maintenant intégré dans la
colonne de droite, sous **Actions du rituel**.

Il contient :

- bouton Son activé / Son coupé ;
- curseur de volume général ;
- valeur numérique du volume ;
- confirmation visible de la mémorisation locale.

## Persistance

Les valeurs suivantes sont conservées dans `localStorage` :

- `projectMonolith.audio.enabled`
- `projectMonolith.audio.volume`

Elles sont restaurées automatiquement au rechargement de la page.

## Test sans sons définitifs

Lors de l’activation, un bref son de confirmation généré par WebAudio permet
de vérifier que l’audio et le volume fonctionnent, même avant l’ajout des
fichiers `.ogg` définitifs.

Commit conseillé :

`Project Monolith v4.7.1 — Panneau audio intégré`
