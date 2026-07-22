# Project Monolith — v2.2.0 collaborative

Cette version relie tous les navigateurs utilisant la clé **Vathkül**
au même état Firestore.

## Fonctionnalités synchronisées

- placements des huit glyphes ;
- ordre de la réserve ;
- Étincelles de Torm ;
- souvenirs révélés ;
- épreuves et résonances ;
- voile et corruption ;
- purification ;
- paroles de Vathkül ;
- dissolution finale.

La fresque reste volontairement locale : chaque joueur peut l’ouvrir
et la fermer sans gêner les autres.

## Étape Firebase obligatoire

Avant de publier les fichiers, ouvrez :

`Firebase > Firestore > Règles`

Remplacez les règles existantes par le contenu de `firestore.rules`,
puis cliquez sur **Publier**.

## Publication GitHub

Remplacez dans le dépôt les éléments suivants :

- `index.html`
- `css/style.css`
- `js/app.js`
- ajoutez `js/firebase-config.js`
- ajoutez `js/sync.js`
- ajoutez `firestore.rules`
- remplacez `README.md`

Faites un commit direct sur `main` :

`Project Monolith v2.2.0 — collaboration Firebase`

## Test conseillé

1. Ouvrez le site dans un navigateur normal.
2. Ouvrez-le aussi dans une fenêtre privée.
3. Entrez deux noms de personnages différents avec la clé `Vathkül`.
4. Déplacez un glyphe dans une fenêtre.
5. Il doit apparaître dans l’autre en moins d’une seconde.

## Modèle de concurrence

Cette première version utilise « dernière modification gagnante ».
Elle convient à un groupe discipliné. Deux actions strictement
simultanées peuvent encore se remplacer ; ce point sera renforcé
dans une version ultérieure.
