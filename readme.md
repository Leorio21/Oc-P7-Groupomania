Projet 7 - Parcours Dev Web OpenClassroom - Groupomania

Dévellopper avec React (vitejs) - typescript - axios - slq - node - express - prisma

Après avoir cloner le projet, effectuer les actions suivantes :
ce projet nécéssite d'avoir nodeJS installé sur son ordinateur

/********** BACKEND **********/
dans votre base de données sql créer une bdd : groupomania
dans le dossier backend :
installer les dependances : npm i
compiler les fichier typescript : npx tsc
modifier le fichier .env.sample pour inserer vos données puis le renommer en .env
créer les tables dans la bdd : npx prisma migrate dev (des données de test sont automatiquement générées)
démarrer le serveur back: cd dist
                      npx nodemon server


/********** FRONTEND **********/
dans le dossier frontend :
installer les dependances : npm i
modifier le fichier .env.sample pour inserer vos données puis le renommer en .env
demarrer le serveur front : npm run dev