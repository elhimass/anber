@echo off
echo Vérification de la configuration des API...
echo.

cd backend

if not exist .env (
    echo ❌ Fichier .env manquant
    echo Création du fichier .env...
    copy .env.example .env 2>nul
    if not exist .env (
        echo Création manuelle requise
    )
)

echo Vérification des clés API dans .env...
findstr /C:"STRIPE_SECRET_KEY=sk_test_" .env >nul
if %errorlevel% neq 0 (
    echo ❌ Clé Stripe non configurée
) else (
    echo ✅ Clé Stripe détectée
)

findstr /C:"PAYPAL_CLIENT_ID=" .env | findstr /V "your_paypal" >nul
if %errorlevel% neq 0 (
    echo ❌ Client ID PayPal non configuré
) else (
    echo ✅ Client ID PayPal détecté
)

echo.
echo 📖 Consultez API_SETUP.md pour obtenir vos clés API
echo.
echo Pour démarrer le serveur :
echo   cd backend
echo   npm start
echo.
pause