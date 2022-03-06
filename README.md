# Versioning


Nous avons décidé de travailler avec le workflow "Gitflow", se basant sur deux branches, "master" et "develop", pour l'ajout/modifications de fichiers nous créons donc une ou plusieurs branches à partir de "develop".

Chaque pull-request à distination de la branche "develop" devra être validé par toute l'équipe travaillant sur le projet.

Une fois la branche "develop" à jour, nous pouvons enfin faire un merge sur la branche "master" qui représente la version final et à jour de notre projet.



# Fonctionnalités de l’application

Pour ce projet, nous avons developpé une API REST proposant à un lecteur d’enregistrer les livres qu’il a
lus au cours de sa vie, dans sa bibliothèque virtuelle.

Le lecteur peut :

- Les livres qu'il a lu
- Afficher les détails d'un livre
- Ajouter un livre dans sa blibliotheque
- Modifier un livre dans sa blibliotheque
- Supprimer un livre de sa blibliotheque

Nous avons utilisé une base de donnée mongoDB, comme langage de programmation nous avons utilisé Nodejs, pour ce qui est de l'IDE nous sommes passés par Visual Code.
Au niveau de la communcation de l'équipe nous sommes passés par Discord via des appels vocaux.

BONUS : On y a rajouté un système d'inscription/connexion.


# Contribuer

Pour l'exécution de l'application via l’environnement de développement sous docker-compose il suffit de se placer dans le dossier du projet et lancer 
la commande suivante, permettant de télécharger les modules nécessaire à l'API :
```
npm install
```

Puis de saisir la commande suivante: permettant de créer les images nécessaires et de lancer le conteneur contenant l'API et la base de données MongoDB : 
```
docker compose up
```

# Deploiement

L’exécution de l'application en production avec Docker se fait de manière continue, lorsque les fichiers en local sont mis à jours, ceux du conteneur de l'API le sont aussi et le serveur est automatiquement relancer grâce au module Nodejs : nodemon

