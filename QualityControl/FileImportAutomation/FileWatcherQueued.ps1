# https://codingbee.net/powershell/powershell-running-tasks-in-the-background
# powershell.exe -windowstyle hidden -file C:\Git\LBIntranet\QualityControl\FileImportAutomation\FileWatcherQueued.ps1
# powershell.exe -windowstyle hidden -file C:\Git\LBIntranet\QualityControl\FileImportAutomation\WatchOut.ps1

# make sure you adjust this to point to the folder you want to monitor
$PathToMonitor = 'C:\Git\LBIntranet\QualityControl\FileImportAutomation'
function _createClaimControlItem(){
param
    (
        [Parameter(Mandatory=$true)] [System.Object] $itemToCreate,
        [Parameter(Mandatory=$true)] [string] $listID
        
    )
    
    
    if($itemToCreate.PriviligedUserEmail -eq 'BOT'){
        $PriviligedUserEmail = $null
        $EmployeeInFocus=$null;

    }
    else{
        $PriviligedUserEmail = $itemToCreate.PriviligedUserEmail
        $EmployeeInFocus=$itemToCreate.EmployeeEmail;
    }
    
    

    $evaluationItem = @{"Title" = $itemToCreate.BatchID;
    "BatchID" = $itemToCreate.BatchID;
    "PriviligedUser"=$PriviligedUserEmail;
    "EmployeeInFocus"=$EmployeeInFocus;
    "EmployeeInFocusDisplayName"=$itemToCreate.Employee;
    "ClaimID"=$itemToCreate.ClaimID;
    "Department"=$itemToCreate.Afdeling.ToUpper();  
    "DataExtractionID"=$itemToCreate.ExtractionID;
    "DataExtractionDate"=$itemToCreate.BatchDate;
    "QuarterStartDate"=$itemToCreate.FromDate;
    "QuarterEndDate"=$itemToCreate.ToDate;
    "ControlSubmitted"=$false;
    <#
    "Question1"=$questions[0]["ControlQuestion"];
    "Question2"=$questions[1]["ControlQuestion"];
    "Question3"=$questions[2]["ControlQuestion"];
    "Question4"=$questions[3]["ControlQuestion"];
    "Question5"=$questions[4]["ControlQuestion"];
    "Question6"=$questions[5]["ControlQuestion"];
    #>
};
    

    
    try{
        Add-PnPListItem -List $listID -Values $evaluationItem
    }
    catch{
        Write-Output $_.Exception >> "C:\Git\LBIntranet\QualityControl\FileImportAutomation\log.txt"
    }
    
}
function _convertStringToDate{
    Param(
    [Parameter(Mandatory=$true, Position=0)]
        [double] $dateValueToConvert
    )



    $cultureInfoSpec = [Globalization.CultureInfo]::CreateSpecificCulture('en-US')
    $cultureInfoEnUS = New-Object system.globalization.cultureinfo(“en-US”)
    $cultureInfoDaDK = New-Object system.globalization.cultureinfo(“da-DK”)
    
    #$date= [System.DateTime]::ParseExact($dateValueToConvert,'dd-MMMM-yyyy',[System.Globalization.CultureInfo]::GetCultureInfo('en-US'))
    $OADate=[DateTime]::FromOADate($dateValueToConvert)

    
    $monthString=''

    $date = Get-Date -Date $OADate -Format 'dd-MMM-yyyy' 

    for($i=0;$i -le 11;$i++){
        if( $date.Contains($cultureInfoDaDK.DateTimeFormat.AbbreviatedMonthGenitiveNames[$i]))
        {
            $res = $date.Replace($cultureInfoDaDK.DateTimeFormat.AbbreviatedMonthGenitiveNames[$i],$cultureInfoEnUS.DateTimeFormat.AbbreviatedMonthGenitiveNames[$i])
            Write-Host $date
            Write-Host $res
        }
    }
    return $res
    

}
function _removeAllListItems(){
param(
[Parameter(Mandatory=$true)] [string] $listID
)
    
    
    $items =Get-PnPListItem -List $listID -PageSize 1000

    foreach ($item in $items)
     {
        try
        {
        Remove-PnPListItem -List $listID -Identity $item.Id -Force
        }
        catch
        {
        Write-Host “error”
        }

    } #for each end

}



function _readExcelFile{
    param
    (
        [Parameter(Mandatory=$true)] [System.Object] $importFilePath
    )

    


    $xlCellTypeLastCell=14
    $startRow=2
    $excel = New-Object -Com Excel.Application
    #$wb = $excel.Workbooks.Open('C:\Git\LBIntranet\QualityControl\FileImportAutomation\17JUN19_Skadetrans.xlsx')
    $wb = $excel.Workbooks.Open($importFilePath)
    

    $sh = $wb.Sheets.Item(1)
    $endRow = $sh.UsedRange.Rows.Count


    $itemsFromFile = @();
    for ($i = 2; $i -le $endRow; $i++){
        $hash = @{
                Team = $sh.Cells.Item($i, 1).Value2; 
                Afdeling = $sh.Cells.Item($i, 2).Value2; 
                BatchDate=_convertStringToDate -dateValueToConvert $sh.Cells.Item($i, 3).Value2; 
                FromDate=_convertStringToDate -dateValueToConvert $sh.Cells.Item($i, 4).Value2; 
                ToDate= _convertStringToDate -dateValueToConvert $sh.Cells.Item($i, 5).Value2; 
                ExtractionID=$sh.Cells.Item($i, 6).Value2; 
                BatchID=$sh.Cells.Item($i, 7).Value2; 
                ClaimID=$sh.Cells.Item($i, 8).Value2; 
                PriviligedUser=$sh.Cells.Item($i, 9).Value2; 
                PriviligedUserEmail=$sh.Cells.Item($i, 10).Value2; 
                Employee=$sh.Cells.Item($i, 13).Value2; 
                EmployeeEmail=$sh.Cells.Item($i, 14).Value2;
                }
                $newRow = New-Object -Property $hash -TypeName psobject
                $itemsFromFile += $newRow
    }
    $excel.Workbooks.Close()

    return $itemsFromFile

}

function StartImport{
    param
    (
        [Parameter(Mandatory=$true)] [string] $newFilePath
        
    )
    <# Connect to SharePoint Online #>
    $SiteURL = 'https://lbforsikring.sharepoint.com/sites/Skade/'
    
    <# Use generic authentication '-NICD-' #>
    Connect-PnPOnline -Url $SiteURL -Credentials -NICD-
    <# ID of the SharePoint list to create items in #>
    $QualityControlClaimsHandlerAnswersListID = '433d918b-2e51-4ebb-ab2a-3fc9e2b5c540'
    $DEV_LIST_ID = 'fc98c6c2-1d45-4502-aedd-970f39c474eb'

    <# For Testing purpose we could delete all existing items #>
    #_removeAllListItems -listID $DEV_LIST_ID 

    
    Write-Output "This is the path to the new file child script: $newFilePath" >> "C:\Git\LBIntranet\QualityControl\FileImportAutomation\log.txt"

    _readExcelFile -importFilePath $newFilePath | ForEach-Object{
        try{
            Write-Output "Creating ITEM $_" >> "C:\Git\LBIntranet\QualityControl\FileImportAutomation\log.txt"
            $i++
            _createClaimControlItem -listID $DEV_LIST_ID -itemToCreate $_
        }
        catch{
            Write-Output $_.Exception >> "C:\Git\LBIntranet\QualityControl\FileImportAutomation\log.txt"
        }
    }
}



############################################################################
######################### Program start ####################################
############################################################################
Start-Transcript -Path C:\Git\LBIntranet\QualityControl\FileImportAutomation\Transcript.log
Write-Verbose "blabla"

############################################################################
##################### File System Watcher ##################################
############################################################################
$FileSystemWatcher = New-Object System.IO.FileSystemWatcher 
$FileSystemWatcher.Path  = $PathToMonitor
$FileSystemWatcher.IncludeSubdirectories = $false

# make sure the watcher emits events
$FileSystemWatcher.EnableRaisingEvents = $true
explorer $PathToMonitor
# define the code that should execute when a file change is detected
$Action = {
    $details = $event.SourceEventArgs
    $Name = $details.Name
    $FullPath = $details.FullPath
    $OldFullPath = $details.OldFullPath
    $OldName = $details.OldName
    $ChangeType = $details.ChangeType
    $Timestamp = $event.TimeGenerated
    $SourceIdentifier = 'ListenToMe'
    $text = "{0} was {1} at {2}" -f $FullPath, $ChangeType, $Timestamp
    
    Write-Host ""
    Write-Host $text -ForegroundColor Green
    Write-Output "Here I GO" >> "$PathToMonitor\log.txt"
    # you can also execute code based on change type here
    switch ($ChangeType)
    {
        'Changed' { "CHANGE" 
            <#
            Write-Output "This is the path to the new file: $FullPath" >> $PathToMonitor\log.txt
            Write-Host 'Changed'
            #>
        }
        'Created' { "CREATED"
            Write-Host 'Created'
            #Write-Output "This is the path to the new file: $FullPath" >> $PathToMonitor\log.txt
            #$command = "C:\Git\LBIntranet\QualityControl\FileImportAutomation\ImportQualityControlCases.ps1 -newFilePath $FullPath" 

            #StartImport -newFilePath $FullPath

            #$scriptPath="C:\Git\LBIntranet\QualityControl\FileImportAutomation\Test.ps1" 
            #Invoke-Expression "$scriptPath $FullPath"
        }
        'Deleted' { "DELETED"
            # uncomment the below to mimick a time intensive handler
            <#
            Write-Host "Deletion Handler Start" -ForegroundColor Gray
            Start-Sleep -Seconds 4    
            Write-Host "Deletion Handler End" -ForegroundColor Gray
            #>
            
        }
        'Renamed' { 
            # this executes only when a file was renamed
            <#
            $text = "File {0} was renamed to {1}" -f $OldName, $Name
            Write-Host $text -ForegroundColor Yellow
            #>
        }
        default { Write-Host $_ -ForegroundColor Red -BackgroundColor White }
    }
}

# add event handlers
$handlers = . {
    #Register-ObjectEvent -InputObject $FileSystemWatcher -EventName Changed -Action $Action -SourceIdentifier FSChange
    Register-ObjectEvent -InputObject $FileSystemWatcher -EventName Created -Action $Action -SourceIdentifier FSCreate 
    #Register-ObjectEvent -InputObject $FileSystemWatcher -EventName Deleted -Action $Action -SourceIdentifier FSDelete
    #Register-ObjectEvent -InputObject $FileSystemWatcher -EventName Renamed -Action $Action -SourceIdentifier FSRename
}

Write-Host "Watching for changes to $PathToMonitor"

try
{
    do
    {
        Wait-Event -Timeout 1
        Write-Host "." -NoNewline
        
    } while ($true)
}
finally
{

    # this gets executed when user presses CTRL+C
    # remove the event handlers
    Unregister-Event -SourceIdentifier FSChange
    Unregister-Event -SourceIdentifier FSCreate
    Unregister-Event -SourceIdentifier FSDelete
    Unregister-Event -SourceIdentifier FSRename
    # remove background jobs
    $handlers | Remove-Job
    # remove filesystemwatcher
    $FileSystemWatcher.EnableRaisingEvents = $false
    $FileSystemWatcher.Dispose()
    "Event Handler disabled."

    Stop-Transcript
    
}

