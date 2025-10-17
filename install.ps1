# Script de Instalación Rápida para SecondBite
# Windows PowerShell

Write-Host "╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                                                           ║" -ForegroundColor Green
Write-Host "║       🍽️  SecondBite - Instalación Rápida  🍽️           ║" -ForegroundColor Green
Write-Host "║                                                           ║" -ForegroundColor Green
Write-Host "╚═══════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

# Verificar Node.js
Write-Host "📦 Verificando Node.js..." -ForegroundColor Cyan
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js instalado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js no encontrado. Por favor instala Node.js desde https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Verificar MySQL
Write-Host "`n🗄️  Verificando MySQL..." -ForegroundColor Cyan
try {
    $mysqlVersion = mysql --version
    Write-Host "✅ MySQL instalado: $mysqlVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ MySQL no encontrado. Por favor instala MySQL desde https://dev.mysql.com/downloads/installer/" -ForegroundColor Red
    exit 1
}

Write-Host "`n════════════════════════════════════════════════════════════" -ForegroundColor Yellow
Write-Host "PASO 1: Configuración de Base de Datos" -ForegroundColor Yellow
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Yellow

Write-Host "`n⚠️  IMPORTANTE: Necesitas configurar MySQL manualmente" -ForegroundColor Red
Write-Host "Por favor sigue estos pasos:" -ForegroundColor White
Write-Host ""
Write-Host "1. Abre una terminal de MySQL:" -ForegroundColor White
Write-Host "   mysql -u root -p" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Ejecuta el script de inicialización:" -ForegroundColor White
Write-Host "   source $PSScriptRoot\backend\database\init.sql" -ForegroundColor Gray
Write-Host ""
Write-Host "O desde PowerShell:" -ForegroundColor White
Write-Host "   mysql -u root -p < backend\database\init.sql" -ForegroundColor Gray
Write-Host ""

$continue = Read-Host "¿Ya configuraste la base de datos? (s/n)"
if ($continue -ne "s") {
    Write-Host "`n📖 Lee el archivo CONFIGURACION_MYSQL.md para más detalles" -ForegroundColor Cyan
    exit 0
}

Write-Host "`n════════════════════════════════════════════════════════════" -ForegroundColor Yellow
Write-Host "PASO 2: Configuración del Backend" -ForegroundColor Yellow
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Yellow

# Instalar dependencias del backend
Write-Host "`n📦 Instalando dependencias del backend..." -ForegroundColor Cyan
Set-Location backend

if (-not (Test-Path ".env")) {
    Write-Host "`n⚙️  Creando archivo .env..." -ForegroundColor Cyan
    Copy-Item ".env.example" ".env"
    Write-Host "✅ Archivo .env creado. ¡CONFIGÚRALO con tus credenciales de MySQL!" -ForegroundColor Yellow
    
    $editNow = Read-Host "¿Quieres editarlo ahora? (s/n)"
    if ($editNow -eq "s") {
        notepad .env
        Write-Host "Por favor guarda y cierra el archivo .env cuando termines" -ForegroundColor Cyan
        Read-Host "Presiona Enter para continuar..."
    }
}

Write-Host "`n📥 Instalando paquetes npm del backend..." -ForegroundColor Cyan
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Dependencias del backend instaladas" -ForegroundColor Green
} else {
    Write-Host "❌ Error al instalar dependencias del backend" -ForegroundColor Red
    exit 1
}

Set-Location ..

Write-Host "`n════════════════════════════════════════════════════════════" -ForegroundColor Yellow
Write-Host "PASO 3: Configuración del Frontend" -ForegroundColor Yellow
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Yellow

# Instalar dependencias del frontend
Write-Host "`n📦 Instalando dependencias del frontend..." -ForegroundColor Cyan
Set-Location frontend

Write-Host "`n📥 Instalando paquetes npm del frontend..." -ForegroundColor Cyan
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Dependencias del frontend instaladas" -ForegroundColor Green
} else {
    Write-Host "❌ Error al instalar dependencias del frontend" -ForegroundColor Red
    exit 1
}

Set-Location ..

Write-Host "`n════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "✅ INSTALACIÓN COMPLETADA" -ForegroundColor Green
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Green

Write-Host "`n📝 PRÓXIMOS PASOS:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Verifica tu archivo backend\.env con las credenciales correctas" -ForegroundColor White
Write-Host ""
Write-Host "2. Inicia el backend:" -ForegroundColor White
Write-Host "   cd backend" -ForegroundColor Gray
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "3. En otra terminal, inicia el frontend:" -ForegroundColor White
Write-Host "   cd frontend" -ForegroundColor Gray
Write-Host "   npm start" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Escanea el código QR con Expo Go en tu móvil" -ForegroundColor White
Write-Host ""
Write-Host "📖 Lee README.md para más información" -ForegroundColor Cyan
Write-Host "📖 Lee CONFIGURACION_MYSQL.md para ayuda con MySQL" -ForegroundColor Cyan
Write-Host ""
Write-Host "🍽️  ¡Disfruta usando SecondBite! ♻️" -ForegroundColor Green
Write-Host ""
