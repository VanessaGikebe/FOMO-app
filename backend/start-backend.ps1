# Start Backend Server with Firebase Credentials
$env:GOOGLE_APPLICATION_CREDENTIALS="$PSScriptRoot\src\serviceAccountKey.json"
Write-Host "Starting backend with Firebase credentials..."
Write-Host "Backend will run on http://localhost:3002"
Write-Host "Press Ctrl+C to stop the server"
npm run start:dev
