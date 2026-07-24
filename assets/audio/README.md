# Pack audio du Monolithe — v4.8.0A

Cette version installe l’infrastructure complète, mais ne contient pas encore
les fichiers audio définitifs.

## Fichiers attendus

- glyph-place.ogg
- glyph-remove.ogg
- corruption.ogg
- purification.ogg
- configuration-start.ogg
- link-reveal.ogg
- configuration-success.ogg
- configuration-failure.ogg
- vathkul-message.ogg
- final-charge.ogg
- final-pulse.ogg
- final-flash.ogg
- final-crack.ogg
- final-destruction.ogg

Le fichier `audio-manifest.json` décrit les gains de référence utilisés par
le gestionnaire audio.

## Comportement si un fichier manque

- aucune erreur visible dans l’interface ;
- l’événement est simplement ignoré ;
- la modale audio indique le nombre de fichiers manquants ;
- le bouton « Tester les sons » identifie les événements absents.
