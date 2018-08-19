#https://stackoverflow.com/questions/30862689/corrupt-ie-object-ie-automation-with-powershell
Add-Type -AssemblyName System.Web

function ConnectIExplorer() {
    param($HWND, $ShowPage)

    $objShellApp = New-Object -ComObject Shell.Application 
    try {
      $EA = $ErrorActionPreference; $ErrorActionPreference = 'Stop'
      $objNewIE = $objShellApp.Windows() | ?{$_.HWND -eq $HWND}
      $objNewIE.Visible = $ShowPage
    } catch {
      #it may happen, that the Shell.Application does not find the window in a timely-manner, therefore quick-sleep and try again
      Write-Host "Waiting for page to be loaded ..." 
      Start-Sleep -Milliseconds 500
      try {
        $objNewIE = $objShellApp.Windows() | ?{$_.HWND -eq $HWND}
        $objNewIE.Visible = $ShowPage
      } catch {
        Write-Host "Could not retreive the -com Object InternetExplorer. Aborting." -ForegroundColor Red
        $objNewIE = $null
      }     
    } finally { 
      $ErrorActionPreference = $EA
      $objShellApp = $null
    }
    return $objNewIE
  } 


function Show-Process($Process, [Switch]$Maximize)
{
  $sig = '
    [DllImport("user32.dll")] public static extern bool ShowWindowAsync(IntPtr hWnd, int nCmdShow);
    [DllImport("user32.dll")] public static extern int SetForegroundWindow(IntPtr hwnd);
  '
  
  if ($Maximize) { $Mode = 3 } else { $Mode = 4 }
  $type = Add-Type -MemberDefinition $sig -Name WindowAPI -PassThru
  $hwnd = $process.MainWindowHandle
  $null = $type::ShowWindowAsync($hwnd, $Mode)
  $null = $type::SetForegroundWindow($hwnd) 
}


function GetSourceFile($url)
{
    $IE= new-object -ComObject "InternetExplorer.Application"
    $HWND = $IE.HWND

    try {
            $IE.Visible=$true
            $IE.fullscreen = $true;
            $IE.navigate2($url)
            
            $IE = ConnectIExplorer -HWND $HWND -ShowPage $true 
            $IE.Visible=$true
            $IE.fullscreen = $true;
            Write-Host 'Sleeping.'
            $ticker = 0;
            while( $IE.Busy){
                    $ticker=$ticker+1000
                    Write-Host  $ticker 'Millisec'
                    Start-Sleep -Milliseconds 1000
                    }
            
            $IE = ConnectIExplorer -HWND $HWND -ShowPage $true
            #nyt
            #$p=Get-Process | Where-Object{$_.MainWindowHandle  -eq $IE.HWND}
            #Show-Process -Process (Get-Process -Id $p.Id) -Maximize
            
            while( $IE.ReadyState -ne 4){
                Write-Host 'State : ' $IE.ReadyState
                Start-Sleep 1
            }
            $exitFlag =$false
            
            do {
                if ( $IE.ReadyState -eq 4 ) {

                    $sourceDocument=$IE.Document;
                    $sourceDiv=$sourceDocument.IHTMLDocument3_getElementById('layoutsTable');
                    $s = $sourceDiv.innerHTML 
                    
                    Set-Clipboard -Value $sourceDiv.innerHTML -AsHtml 

                    #Set-Clipboard -Value $sourceDiv.innerHTML -replace '<*IMG.*pdf16.gif.*?>' -AsHtml 
                    $exitFlag=$true
                }

            } until ( $exitFlag )
            
    }
    catch {
        
    }
    finally{
        $IE = ConnectIExplorer -HWND $HWND -ShowPage $false
        $IE.Quit();
        #Exit-PSSession 
    }
}
#function GetTargetFile($url,$IE2)
function GetTargetFile($url)
{

        $IE2= new-object -ComObject "InternetExplorer.Application"
        $HWND = $IE2.HWND

        try {
            $IE2.navigate2($url)
            while( $IE2.Busy){
                    Write-Host 'Sleeping.'
                    Start-Sleep 1
                    }
            
            $IE2 = ConnectIExplorer -HWND $HWND -ShowPage $true 
             
#            $IE2 = ConnectIExplorer -HWND $HWND -ShowPage $false
            while( $IE2.ReadyState -ne 4){
                Write-Host 'State : '  $IE2.ReadyState
                Start-Sleep 1
                }
        
            $IE2 = ConnectIExplorer -HWND $HWND -ShowPage $true
            $IE2.Visible=$true
            $IE2.fullscreen = $true;
            #$IE2 = ConnectIExplorer -HWND $HWND -ShowPage $false
            $exitFlag =$false
                do {
                    if ( $IE2.ReadyState -eq 4 ) {
    
                        $targetDocument=$IE2.Document;
                        $btnEdit=$targetDocument.IHTMLDocument3_getElementsByTagName('button')| Where-Object {$_.name -eq 'Rediger'}
                        
                        $btnEdit.click()
                        Start-Sleep -Seconds 2
                        
                        $targetDiv=$targetDocument.IHTMLDocument3_getElementsByTagName('div')| Where-Object {$_.title -eq 'Tekstredigeringsprogram'} 
                        $targetDiv.click();
                    
                        
            
                        $p=Get-Process | Where-Object{$_.MainWindowHandle  -eq $IE2.HWND}
                        Show-Process -Process (Get-Process -Id $p.Id) -Maximize
                        Start-Sleep -Seconds 2
                        $targetDiv.focus();
                        
                        
                        [System.Windows.Forms.SendKeys]::SendWait("^{a}")
                        [System.Windows.Forms.SendKeys]::SendWait("^{DEL}") 
                        [System.Windows.Forms.SendKeys]::SendWait("^{v}") 
                        
            
                        
                        $btnPublish=$targetDocument.IHTMLDocument3_getElementsByTagName('button')| Where-Object {$_.name -eq 'Udgiv'}
                        $btnPublish.click();
                        sleep -milliseconds 5000
                        $exitFlag=$true
            
                    }
                } until ( $exitFlag )
        }
        catch {
            Write-Output $PSItem.Exception.Message
            Write-Output $PSItem.Exception.InnerException
            
        }
        finally {
            $IE2 = ConnectIExplorer -HWND $HWND -ShowPage $false
            $IE2.Quit()
        }    

            
    
}

function ProcesFile($fileName, $branchSiteUrl, $coincidenceFileNamePrefix)
{
        try{
            
            
            if($fileName.IndexOf('.aspx') -ge 0)
            {
                $url = [uri]::EscapeDataString($fileName)
                #$url = [uri]::EscapeDataString("A conto-betaling.aspx")
                
                #$sourceUrl= "http://intranet.lb.dk/Skade/hb/Baad/SitePages/" + $url ;
                $sourceUrl= $branchSiteUrl + $url ;
                $targetUrl= "https://lbforsikring.sharepoint.com/sites/Skade/SitePages/" + $coincidenceFileNamePrefix + $url ;
            
                GetSourceFile -url $sourceUrl 
                GetTargetFile -url $targetUrl 
                
            }
            else
            {
                "WARNING - Bad filename"  +  $fileName | Out-File C:\Git\LBIntranet\Powershell\MigratePages\LogFiles\BadFileNames.txt -Append 
            }
        }
        catch{
                Write-Host  $fileName " - "$($PSItem.ToString()) -ForegroundColor Magenta
                "ERROR - Page"  +  $fileName  | Out-File C:\Git\LBIntranet\Powershell\MigratePages\LogFiles\Errors.txt -Append
                "ERROR - Cause"  +  $($PSItem.ToString()) | Out-File C:\Git\LBIntranet\Powershell\MigratePages\LogFiles\Errors.txt -Append
                "ERROR - #############################"| Out-File C:\Git\LBIntranet\Powershell\MigratePages\LogFiles\Errors.txt -Append
                throw $_.Exception
        }
        
        
        
}
function BuildCoincidenceList(){
    $csvFiles = Get-ChildItem "C:\Git\LBIntranet\SPOApp\SPOApp\SPOApp\importfiles\SharePoint2Excel\*.csv" 
    $stuff = @();
    foreach ($csvFile in $csvFiles)
    {
        $pages = Import-Csv -Path $csvFile.FullName -Encoding UTF8 -Delimiter ';'
        foreach ($page in $pages)
        {
            $obj = new-object PSObject
            $obj | add-member -membertype NoteProperty -name 'Filnavn' -value $page.Filnavn
            $obj | add-member -membertype NoteProperty -name 'Branche' -value $page.Branche
            $stuff += $obj
            
        }
    }
    #$stuff=$stuff | select -Unique;
    #$stuff | Select-Object @{Label = "Index"; Expression = {"$($_.'Filnavn')"} } -Unique
    $stuff | export-csv 'C:\Git\LBIntranet\SPOApp\SPOApp\SPOApp\importfiles\CoincidenceFile\coincidence.csv' -notypeinformation -Encoding UTF8 -Delimiter ';'
    return $stuff
}
function GetFilePrefix{
    Param
    (
        [parameter(Mandatory=$true)]
        [System.Object]
        $CurrentFile,
        [parameter(Mandatory=$true)]
        [System.Array]
        $CoincidenceInFilesList
    )
    $returnString = '';
    
    foreach ($item in $CoincidenceInFilesList)
    {
        if($item.Filnavn -eq $CurrentFile.Filnavn){
            return $item.Branche
        }
    }
    return ''
}
function Run($startIndex)
{
    ################### Kør denne funktion når der skal genereres en ny coincidence fil ###############
    $coincidenceList=BuildCoincidenceList
    ###################################################################################################
    
    $coincidenceInFilespages = Import-Csv -Path 'C:\Git\LBIntranet\SPOApp\SPOApp\SPOApp\importfiles\CoincidenceFile\coincidence.csv' -Encoding UTF8 -Delimiter ';'
    $files=0;
    $i=0;
    $currentFileName='';
    $branchSiteUrl='';
    $importFileName='';
    $coincidenceFilenamePrefix='';
    
    do
    {
        if($startIndex -eq 0){
        Write-Host "Indtast branche eks. 'Indbo'"
        Write-Host "----- Byg -----"
        Write-Host "----- Ansvar -----"
        Write-Host "----- Ejerskifte -----"
        Write-Host "----- Erhverv -----"
        Write-Host "----- Hund -----"
        Write-Host "----- Retshjælp -----"
        Write-Host "----- ScalePoint -----"
        Write-Host "----- Regres -----"
        Write-Host "----- Personskade -----"
        Write-Host "----- Skybrudsmanual -----"
        Write-Host "----- Storskade -----"
        Write-Host "----- Indbo -----"
        Write-Host "----- Rejse -----"
        Write-Host "----- Bil -----"
        
        
        $branch = Read-Host 


        if($branch -eq 'Bygning')
        {
            $branchSiteUrl="http://intranet.lb.dk/Skade/hb/Byg/SitePages/";
        }
        elseif($branch -eq 'Ansvar')
        {
            $branchSiteUrl="http://intranet.lb.dk/Skade/hb/ansvarny/SitePages/";
        }
        elseif($branch -eq 'Ejerskifte')
        {
            $branchSiteUrl="http://intranet.lb.dk/Skade/hb/ejerskifte/SitePages/";
        }
        elseif($branch -eq 'Erhverv')
        {
            $branchSiteUrl="http://intranet.lb.dk/Skade/hb/erhv/SitePages/";
        }
        elseif($branch -eq 'Hund')
        {
            $branchSiteUrl="http://intranet.lb.dk/Skade/hb/hund/SitePages/";
        }
        elseif($branch -eq 'TODO')
        {
            $branchSiteUrl="http://intranet.lb.dk/Skade/hb/lønsikring/SitePages/";
            $importFileName = 'C:\Git\LBIntranet\Powershell\MigratePages\ImportFiles\LønsikringIndividuelCSV.csv'
        }
    
        elseif($branch -eq 'TODO')
        {
            $branchSiteUrl="http://intranet.lb.dk/Skade/hb/lønsikringkollektiv/SitePages/"
            $importFileName = 'C:\Git\LBIntranet\Powershell\MigratePages\ImportFiles\LønsikringKollektivCSV.csv'
        }
        elseif($branch -eq 'Retshjhælp')
        {
            $branchSiteUrl="http://intranet.lb.dk/Skade/hb/retshj/SitePages/"
        }
        elseif($branch -eq 'ScalePoint')
        {
            $branchSiteUrl="http://intranet.lb.dk/Skade/hb/sp/SitePages/"
        }
        elseif($branch -eq 'Regres')
        {
            $branchSiteUrl="http://intranet.lb.dk/Skade/hb/reg/SitePages/"
        }
        elseif($branch -eq 'Personskade')
        {
            $branchSiteUrl="http://intranet.lb.dk/Skade/hb/Person/SitePages/"
        }
        elseif($branch -eq 'Skybrudmanual')
        {
            $importFileName = 'C:\Git\LBIntranet\Powershell\MigratePages\ImportFiles\SkybrudsmanualCSV.csv'
        }
        elseif($branch -eq 'Storskade')
        {
            $branchSiteUrl="http://intranet.lb.dk/Skade/hb/StorSkade/SitePages/"
        }
        elseif($branch -eq 'Indbo')
        {
            $branchSiteUrl="http://intranet.lb.dk/Skade/hb/indbo/SitePages/"
        }   
        elseif($branch -eq 'Rejse')
        {
            $branchSiteUrl="http://intranet.lb.dk/Skade/hb/rejseny/SitePages/"
        }   
        elseif($branch -eq 'Bil')
        {
            $branchSiteUrl="http://intranet.lb.dk/Skade/hb/bil/SitePages/"
        }   
        else{
            $branchSiteUrl=$null

            Write-Host "Forkert branche : " $branch
        }
    }    
    }
    while (!$branchSiteUrl )

    try{
    #Læser csv filen på baggrund af input fra konsollen
    $importFileName = [string]::Format("C:\Git\LBIntranet\SPOApp\SPOApp\SPOApp\importfiles\SharePoint2Excel\{0}{1}", $branch, ".csv") 
    $files = Import-Csv -Path $importFileName -Encoding UTF8 -Delimiter ';' 
    
    $sw = [Diagnostics.Stopwatch]::StartNew()
    
    $files |foreach-object {
        
        $i=$i+1;
        $currentFileName=$_.Filnavn;

        Write-Host "Processing " $i " of " $files.count "- elapsed time: " $sw.Elapsed -ForegroundColor Yellow
        Write-Host “Url :”  $currentFileName -ForegroundColor Yellow
        Write-Host ""

            if($i -ge $startIndex){
                #ProcesFile -branchSiteUrl $branchSiteUrl -fileName $currentFileName -coincidenceFileNamePrefix $coincidenceFilenamePrefix
                try{
                        $url = [uri]::EscapeDataString($currentFileName)
                        
                        $sourceUrl= $branchSiteUrl + $url;
                        
                        #Henter coincidence prefix
                        $coincidenceFileNamePrefix = GetFilePrefix -CurrentFile $_ -CoincidenceInFilesList $coincidenceInFilespages
                        Write-Host 'Coincidence' $coincidenceFileNamePrefix
                        $targetUrl= "https://lbforsikring.sharepoint.com/sites/Skade/SitePages/" + $coincidenceFileNamePrefix + $url ;
            
                        GetSourceFile -url $sourceUrl 
                        GetTargetFile -url $targetUrl 
                    
                }
                catch{
                        Write-Host  $fileName " - "$($PSItem.ToString()) -ForegroundColor Magenta
                        "ERROR - Page"  +  $fileName  | Out-File C:\Git\LBIntranet\Powershell\MigratePages\LogFiles\Errors.txt -Append
                        "ERROR - Cause"  +  $($PSItem.ToString()) | Out-File C:\Git\LBIntranet\Powershell\MigratePages\LogFiles\Errors.txt -Append
                        "ERROR - #############################"| Out-File C:\Git\LBIntranet\Powershell\MigratePages\LogFiles\Errors.txt -Append
                        throw $_.Exception
                }
            }
        }
    }
    catch{
        $currentFileName | Out-File C:\Git\LBIntranet\Powershell\MigratePages\LogFiles\FilesWithErrors.txt -Append            
        "Restart at index  - $i" | Out-File C:\Git\LBIntranet\Powershell\MigratePages\LogFiles\FilesWithErrors.txt -Append     
        Start-Sleep -Seconds 2
        if ($files.count -ge $i) {
            Run -startIndex $i    
        }       
    }
    finally{
        #if ($files.count -ge $i) {
         #   Run -startIndex $i    
        #}
        
    }
}

#----------------- Start -----------------#
$sw = [Diagnostics.Stopwatch]::StartNew()
$i=0;


Run -startIndex $i





