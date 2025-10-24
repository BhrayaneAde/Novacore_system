@echo off
echo === ARRET ET REDEMARRAGE DU SERVEUR NOVACORE ===

echo.
echo 1. Arret des processus Python sur le port 8000...
netstat -ano | findstr :8000 > temp_ports.txt
for /f "tokens=5" %%a in (temp_ports.txt) do (
    echo Arret du processus PID: %%a
    taskkill /PID %%a /F 2>nul
)
del temp_ports.txt 2>nul

echo.
echo 2. Attente de liberation du port...
timeout /t 3 /nobreak >nul

echo.
echo 3. Demarrage du nouveau serveur...
echo ATTENTION: Le serveur va se lancer. Appuyez sur Ctrl+C pour l'arreter.
echo.
python run.py

pause