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
    $outarray | Export-Csv -Path $TargetCSVFile -Encoding UTF8 -Delimiter ';' -NoTypeInformation
}

cls

# Angiv den folder på den lokale PC hvor de forskellige filer ligger 
$workingDirectory = "C:\Git\LBIntranet\Powershell\Medvind";

# Angiv filnavnet på den fil der downloades fra Microsoft Bookings
$sourceTSVFile = "$workingDirectory\Defectliste 8 okt.xlsx"
# Angiv filnavnet på den nye fil der bliver UTF encoded
$targetTSVFile = "$workingDirectory\BookingsReportingData_UTF.tsv"
# Angiv filnavnet på den endelige file med resultatet af importen
$resultCSVFile = "$workingDirectory\BookingsReportingDataResult.csv"

 $xl = New-Object -Com Excel.Application
 $doc=$xl.workbooks.open($sourceTSVFile)
 $rows = $doc.Sheets.item(1).rows 
 $defectID=''
 foreach($row in $rows){
    $defectID = $rows[2].Columns[4].Text;
 }
 %{Write-Host $_.value2 }
 #%{$_.value3 }
   #% { ($_.value3 | Select-Object -first 3 | Select-Object -last 2) -join "," }




#SaveFileAsUTF -SourceFilePath $sourceTSVFile -TargetFilePath $targetTSVFile

#CreateCSVFile -SourceTSVFile $targetTSVFile -TargetCSVFile $resultCSVFile -Month $input
