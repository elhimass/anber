@echo off
echo Installation des dépendances du backend...
cd backend
npm install

echo.
echo Configuration terminée !
echo.
echo Pour démarrer le serveur :
echo   cd backend
echo   npm start
echo.
echo N'oubliez pas de configurer vos clés API dans backend/.env
pause