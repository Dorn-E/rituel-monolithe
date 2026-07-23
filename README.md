# Project Monolith — v4.1.9 — Sprint 8 Purification

## Fonctionnement

1. Cliquer sur **Purifier un glyphe**.
2. Cliquer directement sur un glyphe du Monolithe.
3. Vathkül demande :  
   « Désires-tu solliciter mon assistance ? »
4. Choisir :
   - Oui : DD 15
   - Non : DD 20
5. Effectuer un jet d’Intelligence (Arcanes) ou de Sagesse (Religion).
6. Cliquer sur **Réussite** ou **Échec**.

## Résolution

Dans tous les cas :

- une Étincelle est consommée ;
- le journal est mis à jour ;
- l’état est synchronisé via Firebase.

En cas de réussite :

- la corruption du glyphe est retirée ;
- Vathkül dit : « Le glyphe retrouve sa pureté. »

En cas d’échec :

- la corruption demeure ;
- Vathkül dit : « La souillure demeure. »

Les souvenirs ne sont pas modifiés.

## GitHub

Téléverser tout le contenu à la racine du dépôt, puis commit direct sur `main`.

Commit conseillé :

`Project Monolith v4.1.9 — Sprint 8 Purification`

Aucun changement Firebase.
