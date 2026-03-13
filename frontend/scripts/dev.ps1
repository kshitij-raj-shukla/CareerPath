param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$NextArgs = @()
)

$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$normalizedProjectRoot = [System.IO.Path]::GetFullPath($projectRoot)
$lockFile = Join-Path $normalizedProjectRoot ".next\dev\lock"

function Stop-FrontendNextProcess {
    param(
        [int]$ProcessId,
        [string]$CommandLine
    )

    if (-not $CommandLine) {
        return
    }

    $normalizedCommand = $CommandLine.ToLowerInvariant()
    $normalizedRoot = $normalizedProjectRoot.ToLowerInvariant()

    if ($normalizedCommand -notlike "*$normalizedRoot*") {
        return
    }

    if ($normalizedCommand -notlike "*next*") {
        return
    }

    try {
        Stop-Process -Id $ProcessId -Force -ErrorAction Stop
        Write-Host "Stopped stale Frontend Next.js process $ProcessId"
    } catch {
        Write-Warning "Failed to stop process ${ProcessId}: $($_.Exception.Message)"
    }
}

$nodeProcesses = Get-CimInstance Win32_Process -Filter "name = 'node.exe'"
foreach ($process in $nodeProcesses) {
    Stop-FrontendNextProcess -ProcessId $process.ProcessId -CommandLine $process.CommandLine
}

if (Test-Path $lockFile) {
    Remove-Item $lockFile -Force -ErrorAction SilentlyContinue
}

if ($NextArgs -notcontains "--webpack" -and $NextArgs -notcontains "--turbopack") {
    $NextArgs = @("--webpack") + $NextArgs
}

Set-Location $normalizedProjectRoot
& (Join-Path $normalizedProjectRoot "node_modules\.bin\next.cmd") dev @NextArgs