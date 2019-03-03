$res = Get-Content -Path "C:\Git\LBIntranet\Powershell\HR\TreatmentRecords_2019_0101_3101.json"  | ConvertFrom-Json
$res = Get-Content -Path "C:\Git\LBIntranet\Powershell\HR\TreatmentRecords_2019_0102_2802.json"  | ConvertFrom-Json





$groups = $res.value | Group-Object -Property customerEmailAddress
$outputFilePath = "C:\Git\LBIntranet\Powershell\HR\Employees.csv"


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
