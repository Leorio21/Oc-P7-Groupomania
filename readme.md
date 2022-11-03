Projet 7 - Parcours Dev Web OpenClassroom - Groupomania

Dévellopper avec React (vitejs) - typescript - axios - slq - node - express - prisma

Après avoir cloner le projet, effectuer les actions suivantes :

ce projet nécéssite d'avoir nodeJS installé sur son ordinateur


/********** BACKEND **********/

dans le dossier backend :

1/ installer les dependances :

npm i

2/ compiler les fichier typescript :

npx tsc

3/ modifier le fichier .env.sample pour inserer vos données puis le renommer en .env

4/ Si vous possédez le dump SQL de la BDD importez le dans votre BDD et passer à l'étape 5 demarrer le serveur back

Sinon dans votre base de données sql créer une bdd : groupomania

pour créer les tables dans la bdd : npx prisma migrate dev (des données de test sont automatiquement générées)

En cas d'erreur lors de la génération des données (tables créer mais pas de données) lancer la commande suivante : npx prisma migrate reset

5/ démarrer le serveur back:

cd dist

npx nodemon server


/********** FRONTEND **********/

dans le dossier frontend :

1/ installer les dependances : npm i

2/ modifier le fichier .env.sample pour inserer vos données puis le renommer en .env

3/ demarrer le serveur front :

npm run dev