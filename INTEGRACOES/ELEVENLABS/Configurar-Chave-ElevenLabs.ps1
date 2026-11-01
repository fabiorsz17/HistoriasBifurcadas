# Execute interativamente como o mesmo usuario Windows que fara a consulta.
# A chave colada no campo de senha nao entra no historico nem em texto simples no disco.
[CmdletBinding()]
param([switch]$Replace, [ValidateSet('ReadOnly','TTS')][string]$Purpose = 'ReadOnly')

$ErrorActionPreference = 'Stop'
if ([Environment]::OSVersion.Platform -ne [PlatformID]::Win32NT) { throw 'Este procedimento requer Windows e DPAPI.' }

$secretDir = Join-Path $PSScriptRoot '.secrets'
$secretName = if ($Purpose -eq 'TTS') { 'elevenlabs-tts-key.dpapi' } else { 'elevenlabs-api-key.dpapi' }
$secretFile = Join-Path $secretDir $secretName
if ((Test-Path -LiteralPath $secretFile) -and -not $Replace) {
  throw 'Ja existe uma chave local. Use -Replace somente se desejar substitui-la.'
}

Add-Type -AssemblyName PresentationFramework
$window = New-Object System.Windows.Window
$window.Title = "Cadastrar chave ElevenLabs ($Purpose)"
$window.Width = 560
$window.Height = 230
$window.WindowStartupLocation = 'CenterScreen'
$window.ResizeMode = 'NoResize'
$window.Topmost = $true

$panel = New-Object System.Windows.Controls.StackPanel
$panel.Margin = [System.Windows.Thickness]::new(22)
$instruction = New-Object System.Windows.Controls.TextBlock
$instruction.Text = 'Cole a chave API completa no campo abaixo. O texto ficara oculto.'
$instruction.TextWrapping = 'Wrap'
$instruction.FontSize = 15
$passwordBox = New-Object System.Windows.Controls.PasswordBox
$passwordBox.Margin = [System.Windows.Thickness]::new(0,18,0,18)
$passwordBox.Height = 32
$passwordBox.FontSize = 15
$saveButton = New-Object System.Windows.Controls.Button
$saveButton.Content = 'Salvar chave localmente'
$saveButton.Width = 180
$saveButton.Height = 34
$saveButton.HorizontalAlignment = 'Right'
$saveButton.Add_Click({ $window.DialogResult = $true })
$null = $panel.Children.Add($instruction)
$null = $panel.Children.Add($passwordBox)
$null = $panel.Children.Add($saveButton)
$window.Content = $panel
$window.Add_ContentRendered({ $passwordBox.Focus() | Out-Null })

$accepted = $window.ShowDialog()
if ($accepted -ne $true) {
  Write-Output 'Cadastro cancelado; nada foi salvo.'
  exit 0
}

$secureKey = $passwordBox.SecurePassword
$receivedLength = $secureKey.Length
if ($receivedLength -lt 16) {
  $secureKey.Dispose()
  throw "Foram recebidos apenas $receivedLength caracteres. A chave completa nao foi colada; nada foi salvo."
}

$protected = ConvertFrom-SecureString -SecureString $secureKey
New-Item -ItemType Directory -Path $secretDir -Force | Out-Null
[System.IO.File]::WriteAllText($secretFile, $protected, [System.Text.UTF8Encoding]::new($false))
$secureKey.Dispose()
$protected = $null
Write-Output "Chave de $receivedLength caracteres armazenada localmente com DPAPI para este usuario Windows. Nenhum acesso a API foi feito."
