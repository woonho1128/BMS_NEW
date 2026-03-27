$ErrorActionPreference = "Stop"

$ts = Get-Date -Format "yyyyMMdd_HHmmss"
$root = Join-Path "backups\text_pages" $ts
New-Item -ItemType Directory -Path $root -Force | Out-Null

$patterns = @(
  "src/modules/**/pages/*.js",
  "src/modules/**/pages/*.jsx",
  "src/modules/**/pages/*.ts",
  "src/modules/**/pages/*.tsx",
  "src/shared/components/PlaceholderPage/PlaceholderPage.jsx",
  "src/shared/components/PageShell/PageShell.jsx",
  "src/shared/constants/ia.js",
  "src/router/routePaths.js",
  "src/router/index.jsx"
)

$files = @()
foreach ($p in $patterns) {
  $files += Get-ChildItem -Path $p -File -ErrorAction SilentlyContinue
}
$files = $files | Sort-Object FullName -Unique

foreach ($f in $files) {
  $rel = Resolve-Path -Relative $f.FullName
  $rel = $rel -replace '^\.\\', ''
  $dest = Join-Path $root $rel
  $destDir = Split-Path $dest -Parent
  New-Item -ItemType Directory -Path $destDir -Force | Out-Null
  Copy-Item -Path $f.FullName -Destination $dest -Force
}

$manifest = Join-Path $root "manifest_sha256.txt"
$files | ForEach-Object {
  $rel = (Resolve-Path -Relative $_.FullName) -replace '^\.\\', ''
  $h = (Get-FileHash -Algorithm SHA256 -Path $_.FullName).Hash
  "$h  $rel"
} | Set-Content -Path $manifest -Encoding UTF8

Write-Output "BACKUP_ROOT=$root"
Write-Output ("FILE_COUNT=" + $files.Count)
Write-Output "MANIFEST=$manifest"
