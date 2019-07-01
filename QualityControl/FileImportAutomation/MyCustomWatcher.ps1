function _readBIFile{}
function _createSharePointListItems{}


function DoAction{
Param(
    [Parameter]
        [string] $a
    )
    Write-Output $a >> "C:\Git\LBIntranet\QualityControl\FileImportAutomation\log.txt"
    _readBIFile;
    _createSharePointListItems;
}

[System.IO.FileSystemWatcher]$fsw = New-Object System.IO.FileSystemWatcher "C:\Git\LBIntranet\QualityControl\FileImportAutomation", $Filter -Property @{IncludeSubdirectories = $false;NotifyFilter = [IO.NotifyFilters]'FileName, LastWrite, DirectoryName'}



Register-ObjectEvent $fsw Created -SourceIdentifier "FileCreated_HUSK_MIG"

# Start monitoring
$fsw.EnableRaisingEvents = $true

[bool]$exitRequested = $false

do {
    # Wait for an event
    [System.Management.Automation.PSEventArgs]$e = Wait-Event

    if ($e -eq $null) {
        # No evet? Then this is a timeout. Check for ESC
        while ($host.UI.RawUI.KeyAvailable) {
            $k = $host.UI.RawUI.ReadKey("NoEcho,IncludeKeyUp,IncludeKeyDown")
            if (($k.Character -eq 27) -and !$exitRequested) {
                Write-Host "ESC pressed. Exiting..."
                $exitRequested = $true
            }
        }
    } else {
        # A real event! Handle it:
        # Get the name of the file
        [string]$name = $e.SourceEventArgs.Name
        # The type of change
        [System.IO.WatcherChangeTypes]$changeType = $e.SourceEventArgs.ChangeType
        # The time and date of the event
        [string]$timeStamp = $e.TimeGenerated.ToString("yyyy-MM-dd HH:mm:ss")

        Write-Verbose "--- START [$($e.EventIdentifier)] $changeType $name $timeStamp"

        switch ($changeType) {
            Created { 
                #DoAction $CreatedAction $name $e $($e.SourceEventArgs) 
                DoAction -a $changeType
                }
        }

        # Remove the event because we handled it
        Remove-Event -EventIdentifier $($e.EventIdentifier)

        Write-Verbose "--- END [$($e.EventIdentifier)] $changeType $name $timeStamp"
    }
} while (!$exitRequested)


#Unregister-Event -Subscriptio