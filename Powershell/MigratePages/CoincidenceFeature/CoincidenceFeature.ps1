$coincidenceFilePath = "C:\Git\LBIntranet\Powershell\MigratePages\CoincidenceFeature\CoincidenceOfFilenames.csv"
$coincidenceFilePath = "C:\Git\LBIntranet\Powershell\MigratePages\CoincidenceFeature\CoincidenceOfFilenamesFiltered.csv"
$libraryFilePath = "C:\Git\LBIntranet\Powershell\MigratePages\CoincidenceFeature\PageLibraries.csv"
$libraryFilePath = "C:\Git\LBIntranet\Powershell\MigratePages\CoincidenceFeature\PageLibraries.csv"
$site="https://lbforsikring.sharepoint.com/sites/skade"

function SearchForFilenameCoincidence{
    Param
    (
        [parameter(Mandatory=$true)]
        [string]
        $FileName,
        [parameter(Mandatory=$true)]
        [string]
        $CurrenctPageLibrary,
        [parameter(Mandatory=$true)]
        [System.Array]
        $Libraries
    )
    
    foreach($library in $Libraries){  
        
        if($CurrenctPageLibrary -ne $library.PageLibrary){
            #$query= [string]::Format("<View><Query><Where><Eq><FieldRef Name='FileLeafRef'/><Value Type='Text'>{0}</Value></Eq></Where></Query></View>", $FileName) 
            #$listItems=Get-PnPListItem -List $library.PageLibrary -Query $query
            $listItems=Get-PnPListItem -List $library.PageLibrary 

            foreach($listItem in $listItems){  
                if($listItem["FileLeafRef"] -eq $FileName)
                {
                    Write-Host "Coincidence: " $FileName " in " $library.PageLibrary
                    $s= [string]::Format( "{0};{1}", $FileName, $library.PageLibrary) 
                    Add-Content -LiteralPath $filePath -Value $s -Encoding UTF8
                }
            }
        }
        
    }
    

}
function GetAllFileNames{
Param
    (
        [parameter(Mandatory=$true)]
        [System.Array]
        $PageLibraries
    )
    $stuff = @();
    $stopWatch=[system.diagnostics.stopwatch]::StartNew()
    #$PageLibraries = Import-Csv -Path C:\Git\LBIntranet\Powershell\MigratePages\LogFiles\PageLibraries.csv -Encoding UTF8 
    $s=""
        foreach($pageLibrary in $PageLibraries){
            $listItems = Get-PnPListItem -List $pageLibrary.PageLibrary    
            foreach($listItem in $listItems){  
                $obj = new-object PSObject
                $obj | add-member -membertype NoteProperty -name 'PageLibrary' -value $pageLibrary.PageLibrary
                $obj | add-member -membertype NoteProperty -name 'FileName' -value $listItem["FileLeafRef"].ToString()
                $stuff += $obj
                $s= [string]::Format( "{0};{1}", $pageLibrary.PageLibrary, $listItem["FileLeafRef"]) 
                
                Write-Host $s
            }  
        
               
        Write-Host 'Elapsed time ' $stopWatch.Elapsed
    }
    $stuff | export-csv $coincidenceFilePath -notypeinformation -Encoding UTF8 -Delimiter ';'
    return $s
}

function Test{
    $files = Import-Csv -Path $coincidenceFilePath -Encoding UTF8 -Delimiter ';'
    $counter = 0
    foreach($file in $files){  
        
        if ($file.PageLibrary -eq 'IndboWebsider')
        {
            Write-Host $file.FileName ' ' $file.PageLibrary
            $counter++
        }
        
    }
    Write-Host 'Count ' $counter
}

Connect-PnPOnline -Url $site -Credentials 'sadmnicd@lbforsikring.onmicrosoft.com'
Test

$PageLibraries = Import-Csv -Path $libraryFilePath -Encoding UTF8 
$res=GetAllFileNames -PageLibraries $PageLibraries
Add-Content -LiteralPath $filePath -Value $res -Encoding UTF8





<#
 # 


$libraryCounter=1
$totaltLibraries=$PageLibraries.Count
$stopWatch=[system.diagnostics.stopwatch]::StartNew()






foreach($pageLibrary in $PageLibraries){  
    $listItems = Get-PnPListItem -List $pageLibrary.PageLibrary    
    $totalItems=$listItems.Count
    $itemsCounter=1
    foreach($listItem in $listItems){  
        Write-Host 'Processing ' $itemsCounter ' of ' $totalItems ' files in ' $libraryCounter ' of ' $totaltLibraries 'libraries'
        SearchForFilenameCoincidence -FileName $listItem["FileLeafRef"] -CurrenctPageLibrary $pageLibrary.PageLibrary -Libraries $PageLibraries
        $itemsCounter++
    }
    $libraryCounter++
    Write-Host 'Elapsed time ' $stopWatch.Elapsed
}


Write-Host 'Total time ' $stopWatch.Elapsed
$stopWatch.Stop()


#>

  

#Write-Host 'Read file press [R]'
#$r = Read-Host -Prompt 'Read file press [R]'
#if($r.ToUpper() -eq 'R'){
#    $files = Import-Csv -Path $filePath -Encoding UTF8 -Delimiter ';'
#     $files |foreach-object {
#        Write-Host '---------------------------------------'
#        Write-Host 'Filename: ' $_.FileName
#        Write-Host 'PageLibrary: ' $_.PageLibrary
#        Write-Host '---------------------------------------'
#     }
#}

