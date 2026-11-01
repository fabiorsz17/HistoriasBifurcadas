# Renderiza uma composição em MP4 usando a placa de vídeo (configurada em remotion.config.js).
# Uso:
#   .\Renderizar.ps1 -Composicao TesteCamera                      # revisão em 1080p
#   .\Renderizar.ps1 -Composicao TesteCamera -Quadros 100-200     # só um trecho
#   .\Renderizar.ps1 -Composicao TesteCamera -Final               # upload 2560x1440 (composição '<nome>-1440p') + cópia sem metadados
param(
  [Parameter(Mandatory = $true)][string]$Composicao,
  [string]$Quadros = '',
  [string]$Saida = '',
  [switch]$Final
)

$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

# O Node não está no PATH desta máquina; usa o primeiro disponível.
# @(...) garante uma lista: com um único candidato, [0] pegaria só o 1º caractere do caminho ("C").
$candidatos = @(@(
  (Get-Command node -ErrorAction SilentlyContinue).Source,
  "$env:USERPROFILE\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
) | Where-Object { $_ -and (Test-Path $_) })
if (-not $candidatos) { throw 'Node.js não encontrado. Instale o Node 20+ ou ajuste o caminho neste script.' }
$node = $candidatos[0]

$sufixo = if ($Final) { '-1440p' } else { '' }
if (-not $Saida) { $Saida = "out/$Composicao$sufixo-$(Get-Date -Format 'yyyyMMdd-HHmm').mp4" }
$argumentos = @('node_modules/@remotion/cli/remotion-cli.js', 'render', 'src/index.jsx', $Composicao, $Saida, '--codec=h264', '--crf=18')
if ($Final) { $argumentos[3] = "$Composicao-1440p" }
if ($Quadros) { $argumentos += "--frames=$Quadros" }

& $node @argumentos
if ($LASTEXITCODE -ne 0) { throw "Render falhou (código $LASTEXITCODE). Nada foi gerado." }

if ($Final) {
  # Versão de upload sem metadados de ferramenta (comment "Made with Remotion", encoder), por cópia direta (sem recomprimir).
  $ffmpeg = Get-ChildItem node_modules -Recurse -Filter ffmpeg.exe -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty FullName
  $limpo = $Saida -replace '\.mp4$', '-upload.mp4'
  & $ffmpeg -v error -y -i $Saida -map 0 -c copy -map_metadata -1 -fflags +bitexact -flags:v +bitexact -flags:a +bitexact $limpo
  Write-Host "Upload (sem metadados): $limpo"
}
Write-Host "Pronto: $Saida"
