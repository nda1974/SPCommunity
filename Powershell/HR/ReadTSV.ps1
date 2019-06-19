<#
    ########## SaveFileAsUTF ##########
    
    Gemmer en fil med UTF encoding

    ###################################
#>
function SaveFileAsUTF{
    Param(
        [Parameter(Mandatory=$true, Position=0)]
        [string] $SourceFilePath,
        [Parameter(Mandatory=$true, Position=1)]
        [string] $TargetFilePath

    )
    
    $sourceFileContent= Get-Content $SourceFilePath
    $Utf8NoBomEncoding = New-Object System.Text.UTF8Encoding $False
    [System.IO.File]::WriteAllLines($TargetFilePath, $sourceFileContent, $Utf8NoBomEncoding)
    
}

<#
    ########## CreateCSVFile ##########
    
    Opretter filen til HR

    ###################################
#>
function CreateCSVFile{
    Param(
        [Parameter(Mandatory=$true, Position=0)]
        [string] $SourceTSVFile,
        [Parameter(Mandatory=$true, Position=1)]
        [string] $TargetCSVFile,
        [Parameter(Mandatory=$true, Position=2)]
        [Int] $Month
    )
    
    $csvBrt = import-csv $SourceTSVFile -delimiter "`t" -Encoding UTF8 
    

    $csv = [System.Collections.ArrayList]@()
    foreach($item in $csvBrt){
        $temp = [datetime]::ParseExact($item.'Date Time',"dd-MM-yyyy HH:mm",$null);
        
        if($temp.Month -eq $Month){
            #Write-Host $item
            $csv.Add($item);
        }   
    }

    
    $groups = $csv | Group-Object -Property 'Customer Email'
    $outarray = @();

    foreach ($record in $groups ) {
    
    $hash = @{
                "Medarbejderens navn" =  $record.Group[0].'Customer Name' 
                "Mail" = $record.Group[0].'Customer Email'.Split('@')[0]
                "*"=""
                "Lønart" = "75211"
                "_"=""
                "Antal behandlinger" = $record.Count
                }
    
    $newRow = New-Object -Property $hash -TypeName psobject
    $outarray += $newRow
    
    }
    $outarray | Export-Csv -Path $TargetCSVFile -Encoding UTF8 -Delimiter ';'
}

# Angiv den folder på den lokale PC hvor de forskellige filer ligger 
$workingDirectory = "C:\Git\LBIntranet\Powershell\HR";

# Angiv filnavnet på den fil der downloades fra Microsoft Bookings
$sourceTSVFile = "$workingDirectory\BookingsReportingData.tsv"
# Angiv filnavnet på den nye fil der bliver UTF encoded
$targetTSVFile = "$workingDirectory\BookingsReportingData_UTF.tsv"
# Angiv filnavnet på den endelige file med resultatet af importen
$resultCSVFile = "$workingDirectory\BookingsReportingDataResult.csv"


Write-Host "Vælg måned for dataudtræk:"
Write-Host "Tast [1] for Januar"
Write-Host "Tast [2] for Februar"
Write-Host "Tast [3] for Marts"
Write-Host "Tast [4] for April"
Write-Host "Tast [5] for Maj"
Write-Host "Tast [6] for Juni"
Write-Host "Tast [7] for Juli"
Write-Host "Tast [8] for August"
Write-Host "Tast [9] for september"
Write-Host "Tast [10] for Oktober"
Write-Host "Tast [11] for November"
Write-Host "Tast [12] for December"

$input = Read-Host


SaveFileAsUTF -SourceFilePath $sourceTSVFile -TargetFilePath $targetTSVFile

CreateCSVFile -SourceTSVFile $targetTSVFile -TargetCSVFile $resultCSVFile -Month $input
