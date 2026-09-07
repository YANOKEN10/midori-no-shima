$ErrorActionPreference = 'Stop'
$projectRoot = 'I:\2026\Claude code\gaon-world'
$nodeExe = 'C:\Users\voraz\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
$localUrl = 'http://127.0.0.1:5179/'
if (-not (Test-Path -LiteralPath $nodeExe)) { throw 'Node.js executable not found.' }
try {
  $response = Invoke-WebRequest -Uri $localUrl -TimeoutSec 3
  if ($response.Content -notmatch '20260907-chapter1') { throw 'Port 5179 is used by another version. Stop that server first.' }
  Write-Output "Game is already running: $localUrl"
  exit
} catch [System.Net.Http.HttpRequestException] {
} catch [System.Threading.Tasks.TaskCanceledException] {
}
New-Item -ItemType Directory -Force -Path "$projectRoot\work\tmp" | Out-Null
$env:TEMP = "$projectRoot\work\tmp"
$env:TMP = $env:TEMP
Start-Process -FilePath $nodeExe -ArgumentList 'serve.js' -WorkingDirectory $projectRoot -WindowStyle Hidden -RedirectStandardOutput "$projectRoot\work\server.log" -RedirectStandardError "$projectRoot\work\server-error.log" | Out-Null
Write-Output "Game: $localUrl"
