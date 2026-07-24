# Project Monolith — v4.8.0A — Infrastructure audio

## Nouvelle architecture

Cette version prépare l’intégration professionnelle du pack sonore définitif.

### Gestionnaire audio

- gains individuels par événement ;
- groupes audio ;
- priorités ;
- délais anti-répétition ;
- nombre maximal de voix simultanées ;
- arrêt et fondu d’un groupe sonore ;
- préchargement ;
- détection des fichiers manquants ;
- aucune erreur utilisateur si un fichier est absent.

### Modale audio

Un bouton **Tester les sons** joue une séquence de démonstration :

1. pose d’un glyphe ;
2. corruption ;
3. purification ;
4. liaison ;
5. configuration parfaite ;
6. pulsation finale.

La modale signale les fichiers manquants.

### Paramètres techniques

Les gains de référence et noms des fichiers sont documentés dans :

`assets/audio/audio-manifest.json`

## Inchangé

- gameplay ;
- Firebase ;
- synchronisation ;
- graphismes ;
- règles du rituel.

Commit conseillé :

`Project Monolith v4.8.0A — Infrastructure audio`
