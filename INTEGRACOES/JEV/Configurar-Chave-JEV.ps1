# Cadastra a chave da API do JEV (TypeSafe AI) protegida com DPAPI do seu usuário Windows.
# Não faz nenhuma chamada à API e não lê a área de transferência.
# Uso: clique com o botão direito > "Executar com o PowerShell"  (ou: powershell -File .\Configurar-Chave-JEV.ps1)
$ErrorActionPreference = 'Stop'
Import-Module (Join-Path $PSHOME 'Modules\Microsoft.PowerShell.Security\Microsoft.PowerShell.Security.psd1')

$pasta = Join-Path $PSScriptRoot '.secrets'
$arquivo = Join-Path $pasta 'jev-api-key.dpapi'
if (Test-Path -LiteralPath $arquivo) {
    throw 'Já existe uma chave do JEV cadastrada. Apague .secrets\jev-api-key.dpapi se quiser trocar.'
}

Add-Type -AssemblyName PresentationFramework
$janela = New-Object System.Windows.Window
$janela.Title = 'Histórias Bifurcadas - chave do JEV'
$janela.Width = 560; $janela.Height = 250
$janela.WindowStartupLocation = 'CenterScreen'; $janela.ResizeMode = 'NoResize'; $janela.Topmost = $true
$painel = New-Object System.Windows.Controls.StackPanel
$painel.Margin = [System.Windows.Thickness]::new(22)
$texto = New-Object System.Windows.Controls.TextBlock
$texto.Text = 'Cole a chave da API do JEV (console.typesafe.ai). Ela fica protegida neste computador, só para o seu usuário Windows. Nenhuma chamada será feita agora.'
$texto.TextWrapping = 'Wrap'; $texto.FontSize = 15
$campo = New-Object System.Windows.Controls.PasswordBox
$campo.Margin = [System.Windows.Thickness]::new(0, 18, 0, 18); $campo.Height = 32; $campo.FontSize = 15
$botao = New-Object System.Windows.Controls.Button
$botao.Content = 'Salvar chave'; $botao.Width = 160; $botao.Height = 34; $botao.HorizontalAlignment = 'Right'
$script:chave = $null
$botao.Add_Click({
    if ($campo.SecurePassword.Length -lt 16) {
        $null = [System.Windows.MessageBox]::Show('A chave parece incompleta. Copie o valor inteiro no console e cole com Ctrl+V.', 'Nada foi salvo', 'OK', 'Warning')
        return
    }
    $script:chave = $campo.SecurePassword.Copy()
    $janela.DialogResult = $true
})
$null = $painel.Children.Add($texto); $null = $painel.Children.Add($campo); $null = $painel.Children.Add($botao)
$janela.Content = $painel
$janela.Add_ContentRendered({ $null = $campo.Focus() })

if ($janela.ShowDialog() -ne $true) { Write-Output 'Cancelado; nada foi salvo.'; return }

try {
    $null = New-Item -ItemType Directory -Path $pasta -Force
    # Pasta acessível só pelo seu usuário.
    $eu = [Security.Principal.WindowsIdentity]::GetCurrent().User
    $acl = New-Object Security.AccessControl.DirectorySecurity
    $acl.SetOwner($eu); $acl.SetAccessRuleProtection($true, $false)
    $null = $acl.AddAccessRule([Security.AccessControl.FileSystemAccessRule]::new($eu, 'FullControl', 'ContainerInherit,ObjectInherit', 'None', 'Allow'))
    Set-Acl -LiteralPath $pasta -AclObject $acl
    [IO.File]::WriteAllText($arquivo, (ConvertFrom-SecureString -SecureString $script:chave), [Text.UTF8Encoding]::new($false))
    $null = [System.Windows.MessageBox]::Show('Chave salva com proteção local. Volte ao chat e diga apenas: chave do JEV cadastrada.', 'Histórias Bifurcadas', 'OK', 'Information')
    Write-Output 'Chave do JEV cadastrada. Nenhuma chamada à API foi feita.'
}
finally {
    if ($null -ne $script:chave) { $script:chave.Dispose() }
    $campo.Clear()
}
