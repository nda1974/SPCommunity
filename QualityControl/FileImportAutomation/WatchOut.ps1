Function Start-FileSystemWatcher  {

  [cmdletbinding()]

  Param (

  [parameter()]

  [string]$Path,

  [parameter()]

  [ValidateSet('Changed','Created','Deleted','Renamed')]

  [string[]]$EventName,

  [parameter()]

  [string]$Filter,

  [parameter()]

  [System.IO.NotifyFilters]$NotifyFilter,

  [parameter()]

  [switch]$Recurse,

  [parameter()]

  [scriptblock]$Action

  )

  #region Build  FileSystemWatcher

    $FileSystemWatcher  = New-Object  System.IO.FileSystemWatcher
    $Path  = 'C:\Git\LBIntranet\QualityControl\FileImportAutomation'
    $FileSystemWatcher.Path = $Path
    $FileSystemWatcher.IncludeSubdirectories =  $false
    $EventName  = 'Created'
      <#### Action #####>
      If (-NOT $PSBoundParameters.ContainsKey('Action')){

      $Action  = {

            Switch  ($Event.SourceEventArgs.ChangeType) {
                    'Created'  {
                                Write-Output $Object >> C:\Git\LBIntranet\QualityControl\FileImportAutomation\log.txt
                                $Object  = "{3} - {0} was  {1} at {2}" -f $Event.SourceEventArgs.FullPath,
                                $Event.SourceEventArgs.ChangeType,
                                $Event.TimeGenerated,
                                $Event.TimeGenerated
                                    do
                                    {
                                        Wait-Event -Timeout 1
                                        Write-Host "." -NoNewline
        
                                    } while ($true)
                                }

            }

            $WriteHostParams  = @{
            ForegroundColor = 'Green'
            BackgroundColor = 'Black'
            Object =  $Object
            }
                Write-Host  @WriteHostParams
            }

      }

#endregion  Build FileSystemWatcher
    #region  Initiate Jobs for FileSystemWatcher

  $ObjectEventParams  = @{

  InputObject =  $FileSystemWatcher

  Action =  $Action

  }

  ForEach  ($Item in  $EventName) {

  $ObjectEventParams.EventName = $Item

  $ObjectEventParams.SourceIdentifier =  "File.$($Item)"

  Write-Verbose  "Starting watcher for Event: $($Item)"

  $Null  = Register-ObjectEvent  @ObjectEventParams

  }

  #endregion  Initiate Jobs for FileSystemWatcher

}
Start-Transcript -Path C:\Git\LBIntranet\QualityControl\FileImportAutomation\Transcript.log
$PathToMonitor = 'C:\Git\LBIntranet\QualityControl\FileImportAutomation'
    Write-Output "Det her kommer fra Watchout.ps1 $a" >> "C:\Git\LBIntranet\QualityControl\FileImportAutomation\log.txt"
Start-FileSystemWatcher 
Stop-Transcript