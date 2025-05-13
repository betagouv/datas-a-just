# API A-JUST

# Migrations des données en très grandes masses

1. Modifier le fichier .env
./upload-datas/.env 
SERVER_URL=http://localhost:8081/api

OLD_SERVER_URL=127.0.0.1
OLD_SERVER_PORT=10000
OLD_SERVER_USER=***
OLD_SERVER_PASSWORD=***
OLD_SERVER_DB=****

NEW_SERVER_URL=127.0.0.1
NEW_SERVER_PORT=5456
NEW_SERVER_USER=ajust-api-user
NEW_SERVER_PASSWORD=ajust-api-pass
NEW_SERVER_DB=ajust-api

2. Démarrer le serveur en local /api/
3. Démarrer l'uploader /upload-datas


# Erreurs 

*Si pg_dump n'existe pas alors*
```
echo 'export PATH="/Library/PostgreSQL/16/bin/:$PATH"' >> ~/.zshrc
source ~/.zshrc
```