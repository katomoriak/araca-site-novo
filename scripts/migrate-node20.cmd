@echo off
REM Roda payload migrate com Node 20 no mesmo processo (evita voltar para Node 24).
REM Uso: scripts\migrate-node20.cmd   ou   .\scripts\migrate-node20.cmd

call nvm use 20
if errorlevel 1 (
  echo.
  echo Erro: nao foi possivel ativar Node 20. Instale com: nvm install 20
  exit /b 1
)

echo Usando Node:
node -v
echo.

npx payload migrate
exit /b %errorlevel%
