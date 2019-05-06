 $inputFile = Import-Csv -Delimiter "`t" -Path .\BookingsReportingData2019_0104_3004.tsv
 Write-Host $res
 $newRow;
 $arrRowItems=@();

foreach($row in $inputFile)
{
    [datetime]$rowDate = Get-Date $row.'Date Time'    
    [datetime]$starDate = Get-Date -Year 2019 -Month 04 -Day 01
    [datetime]$endDate = Get-Date -Year 2019 -Month 04 -Day 30
    
    if($rowDate -gt $starDate -and $rowDate -lt $endDate){
        $rowItem=@{
            'Customer Email' = $row.'Customer Email'
            'Customer Name' = $row.'Customer Name'
            'Date Time' = $row.'Date Time'
        }

        $n = New-Object PsObject -Property $rowItem
        $arrRowItems +=$n
        
    }
}

 $groups = $arrRowItems | Group-Object -Property 'Customer Email'
 $outputFilePath = "C:\Git\LBIntranet\Powershell\HR\Employees2019_0104_3004.csv"
 Write-Host $groups




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
                    "Medarbejderens navn" =  $record.Group[0].'Customer Name'
                    "Mail" = $record.Group[0].'Customer Email'
                    "*"=""
                    "Lønart" = "75211"
                    "_"=""
                    "Antal behandlinger" = $record.Count
                    }

        $newRow = New-Object PsObject -Property $hash

Export-Csv -Path $outputFilePath -inputobject $newrow -append -Force -Encoding UTF8 -Delimiter ';'
}