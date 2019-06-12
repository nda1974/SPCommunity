
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

function CreateCSVFile{
    Param(
        [Parameter(Mandatory=$true, Position=0)]
        [string] $SourceTSVFile,
        [Parameter(Mandatory=$true, Position=1)]
        [string] $TargetCSVFile
    )
    
    $csv = import-csv $SourceTSVFile -delimiter "`t" -Encoding UTF8 


    $groups = $csv | Group-Object -Property 'Customer Email'
    $headers = "Medarbejderens navn","Mail","*","Lønart","_","Antal behandlinger"
    $psObject = New-Object psobject
    
    
    foreach($header in $headers)
    {
        Add-Member -InputObject $psObject -MemberType NoteProperty -Name $header -Value $header 
    }


    $psObject | Export-Csv $TargetCSVFile -NoTypeInformation -Encoding UTF8 -Delimiter ';'

    foreach ($record in $groups ) {
    
    $hash = @{
                "Medarbejderens navn" =  $record.Group[0].'Customer Name' 
                "Mail" = $record.Group[0].'Customer Email'.Split('@')[0]
                "*"=""
                "Lønart" = "75211"
                "_"=""
                "Antal behandlinger" = $record.Count
                }

    $newRow = New-Object PsObject -Property $hash 
    Export-Csv -Path $TargetCSVFile -inputobject $newrow -append -Force -Encoding UTF8 -Delimiter ';'
    
    }

}

$sourceTSVFile = "C:\Git\LBIntranet\Powershell\HR\RawTSV.tsv"
$targetTSVFile = "C:\Git\LBIntranet\Powershell\HR\RawTSV_UTF.tsv"
$resultCSVFile = "C:\Git\LBIntranet\Powershell\HR\RawTSVResult.csv"

SaveFileAsUTF -SourceFilePath $sourceTSVFile -TargetFilePath $targetTSVFile
CreateCSVFile -SourceTSVFile $targetTSVFile -TargetCSVFile $resultCSVFile
return

$groups = $res.value | Group-Object -Property customerEmailAddress
$outputFilePath = "C:\Git\LBIntranet\Powershell\HR\Employees.csv"
$outputFilePath = "C:\Git\LBIntranet\Powershell\HR\testresult.csv"


 #this bit creates the CSV if it does not already exist
$headers = "Medarbejderens navn","Mail","*","Lønart","_","Antal behandlinger"
$psObject = New-Object psobject

foreach($header in $headers)
{
 Add-Member -InputObject $psobject -MemberType noteproperty -Name $header -Value $header 
}

$psObject | Export-Csv $outputFilePath -NoTypeInformation -Encoding UTF8 -Delimiter ';'

foreach ($record in $groups ) {
    
$hash = @{
            "Medarbejderens navn" =  $record.Group[0].customerName
            "Mail" = $record.Name.Split('@')[0]
            "*"=""
            "Lønart" = "75211"
            "_"=""
            "Antal behandlinger" = $record.Count
            }

$newRow = New-Object PsObject -Property $hash
Export-Csv -Path $outputFilePath -inputobject $newrow -append -Force -Encoding UTF8 -Delimiter ';'
}

#this bit appends a new row to the CSV file
