# Project Monolith — v4.7.0 — Architecture audio

## Cette version ne contient pas encore les sons définitifs

Elle installe toute l’architecture nécessaire :

- gestionnaire central `js/audio.js` ;
- bouton activer/couper le son ;
- réglage du volume général ;
- mémorisation des préférences avec `localStorage` ;
- préchargement des sons disponibles ;
- absence de crash ou d’erreur visible si les fichiers audio manquent.

## Événements déjà câblés

- pose d’un glyphe ;
- retrait d’un glyphe ;
- corruption ;
- purification ;
- début de l’épreuve ;
- révélation de chaque liaison ;
- verdict positif ou négatif ;
- apparition d’un message de Vathkül ;
- charge finale ;
- pulsation finale ;
- flash ;
- fissuration ;
- destruction.

## Ajouter les sons

Déposer les fichiers `.ogg` dans `assets/audio/` en suivant les noms indiqués dans :

`assets/audio/README.md`

Aucune modification du JavaScript métier ne sera nécessaire lors du remplacement des sons.

Commit conseillé :

`Project Monolith v4.7.0 — Architecture audio`
