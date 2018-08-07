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
            Write-Host 'Sleeping.'
            $ticker = '';
            while( $IE.Busy){
                    $ticker=$ticker+'.'
                    Write-Host  '.'
                    Start-Sleep -Milliseconds 100
                    }
            
            $IE = ConnectIExplorer -HWND $HWND -ShowPage $false
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
            #$IE2 = ConnectIExplorer -HWND $HWND -ShowPage $false
            $exitFlag =$false
                do {
                    if ( $IE2.ReadyState -eq 4 ) {
    
                        $targetDocument=$IE2.Document;
                        $btnEdit=$targetDocument.IHTMLDocument3_getElementsByTagName('button')| Where-Object {$_.name -eq 'Rediger'}
                        if($btnEdit -eq $null)
                        {
                        
                        }
                        else
                        {
                        
                        }
                        #$btnEdit=$targetDocument.IHTMLDocument3_getElementById('id__15')
                        $btnEdit.click()
                        Start-Sleep -Seconds 2
                        
                        $targetDiv=$targetDocument.IHTMLDocument3_getElementsByTagName('div')| Where-Object {$_.title -eq 'Tekstredigeringsprogram'} 
                        $targetDiv.click();
                    
                        
            
                        $p=Get-Process | Where-Object{$_.MainWindowHandle  -eq $IE2.HWND}
                        Show-Process -Process (Get-Process -Id $p.Id) -Maximize
                        Start-Sleep -Seconds 5
                        $targetDiv.focus();
                        Start-Sleep -Seconds 2
                        [System.Windows.Forms.SendKeys]::SendWait("^{a}")
                        #[System.Windows.Forms.SendKeys]::SendWait("{DEL}")
                        [System.Windows.Forms.SendKeys]::SendWait("^{v}") 
                        
            
                        sleep -milliseconds 5000
                        $btnPublish=$targetDocument.IHTMLDocument3_getElementsByTagName('button')| Where-Object {$_.name -eq 'Udgiv'}
                        $btnPublish.click();
                        sleep -milliseconds 5000
                        $exitFlag=$true
            
                    }
                } until ( $exitFlag )
        }
        catch {
            
        }
        finally {
            $IE2 = ConnectIExplorer -HWND $HWND -ShowPage $false
            $IE2.Quit()
        }    

            
    
}

function ProcesFile($fileName, $branchSiteUrl)
{
        try{
            
            
            if($fileName.IndexOf('.aspx') -ge 0)
            {
                $url = [uri]::EscapeDataString($fileName)
                #$url = [uri]::EscapeDataString("A conto-betaling.aspx")
                
                #$sourceUrl= "http://intranet.lb.dk/Skade/hb/Baad/SitePages/" + $url ;
                $sourceUrl= $branchSiteUrl + $url ;
                $targetUrl= "https://lbforsikring.sharepoint.com/sites/Skade/SitePages/" + $url ;
            
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

function Run($startIndex)
{
    if($startIndex -eq 0){
        Write-Host "Vælg branch"
        Write-Host "----- Byg -----"
        Write-Host "Byg [1] WARNING REFACTORING NEEDED"
        Write-Host "Byg repair[2] WARNING REFACTORING NEEDED"
        Write-Host "----- Ansvar -----"
        Write-Host "Ansvar [3] WARNING REFACTORING NEEDED"
        Write-Host "Ansvar repair[4]"
        Write-Host "----- Ejerskifte -----"
        Write-Host "Ejerskifte [5]"
        Write-Host "Ejerskifte repair[6]"
        Write-Host "----- Erhverv -----"
        Write-Host "Erhverv [7]"
        Write-Host "Erhverv repair[8]"
        Write-Host "----- Hund -----"
        Write-Host "Hund [9]"
        Write-Host "Hund repair[10]"
        Write-Host "----- Lønsikring individuel -----"
        Write-Host "Lønsikring individuel [11]"
        Write-Host "Lønsikring individuel repair[12]"
        Write-Host "----- Lønsikring kollektiv -----"
        Write-Host "Lønsikring individuel [13]"
        Write-Host "Lønsikring individuel repair[14]"
        Write-Host "----- Retshjælp -----"
        Write-Host "Retshjælp [15]"
        Write-Host "Retshjælp repair[16]"
        Write-Host "----- ScalePoint -----"
        Write-Host "ScalePoint [17]"
        Write-Host "ScalePoint repair[18]"
        Write-Host "----- Regress -----"
        Write-Host "Regress [19]"
        Write-Host "Regress repair[20]"
        Write-Host "----- Personskade -----"
        Write-Host "Personskade [21]"
        Write-Host "Personskade repair[22]"
        $branch = Read-Host 
    }

    
    $files=0;
    $i=0;
    $currentFileName='';
    $branchSiteUrl='';
    $importFileName=''
    
    try{
    
    if($branch -eq 1)
    {
        $branchSiteUrl="http://intranet.lb.dk/Skade/hb/Byg/SitePages/";
        $files = Import-Csv -Path C:\Git\LBIntranet\Powershell\MigratePages\ImportFiles\BygCSV.csv -Encoding UTF8
    }
    elseif($branch -eq 2)
    {
        $branchSiteUrl="http://intranet.lb.dk/Skade/hb/Byg/SitePages/";
        $files = Import-Csv -Path C:\Git\LBIntranet\Powershell\MigratePages\ImportFiles\BygCSVRepair.csv -Encoding UTF8
    }
    if($branch -eq 3)
    {
        $branchSiteUrl="http://intranet.lb.dk/Skade/hb/ansvarny/SitePages/";
        $files = Import-Csv -Path C:\Git\LBIntranet\Powershell\MigratePages\ImportFiles\AnsvarCSV.csv -Encoding UTF8
    }
    elseif($branch -eq 4)
    {
        $branchSiteUrl="http://intranet.lb.dk/Skade/hb/ansvarny/SitePages/";
        $importFileName = 'C:\Git\LBIntranet\Powershell\MigratePages\ImportFiles\AnsvarCSVRepair.csv'
    }
    elseif($branch -eq 5)
    {
        $branchSiteUrl="http://intranet.lb.dk/Skade/hb/ejerskifte/SitePages/";
        $importFileName = 'C:\Git\LBIntranet\Powershell\MigratePages\ImportFiles\EjerskifteCSV.csv'
    }
    elseif($branch -eq 6)
    {
        $branchSiteUrl="http://intranet.lb.dk/Skade/hb/ejerskifte/SitePages/";
        $importFileName = 'C:\Git\LBIntranet\Powershell\MigratePages\ImportFiles\EjerskifteCSVRepair.csv'
    }
    elseif($branch -eq 7)
    {
        $branchSiteUrl="http://intranet.lb.dk/Skade/hb/erhv/SitePages/";
        $importFileName = 'C:\Git\LBIntranet\Powershell\MigratePages\ImportFiles\ErhvervCSV.csv'
    }
    elseif($branch -eq 8)
    {
        $branchSiteUrl="http://intranet.lb.dk/Skade/hb/erhv/SitePages/";
        $importFileName = 'C:\Git\LBIntranet\Powershell\MigratePages\ImportFiles\ErhvervCSVRepair.csv'
    }
    elseif($branch -eq 9)
    {
        $branchSiteUrl="http://intranet.lb.dk/Skade/hb/hund/SitePages/";
        $importFileName = 'C:\Git\LBIntranet\Powershell\MigratePages\ImportFiles\HundCSV.csv'
    }
    elseif($branch -eq 10)
    {
        $branchSiteUrl="http://intranet.lb.dk/Skade/hb/hund/SitePages/";
        $importFileName = 'C:\Git\LBIntranet\Powershell\MigratePages\ImportFiles\HundCSVRepair.csv'
    }
    elseif($branch -eq 11)
    {
        $branchSiteUrl="http://intranet.lb.dk/Skade/hb/lønsikring/SitePages/";
        $importFileName = 'C:\Git\LBIntranet\Powershell\MigratePages\ImportFiles\LønsikringIndividuelCSV.csv'
    }
    elseif($branch -eq 12)
    {
        $branchSiteUrl="http://intranet.lb.dk/Skade/hb/lønsikring/SitePages/";
        $importFileName = 'C:\Git\LBIntranet\Powershell\MigratePages\ImportFiles\LønsikringIndividuelCSVRepair.csv'
    }
    elseif($branch -eq 13)
    {
        $branchSiteUrl="http://intranet.lb.dk/Skade/hb/lønsikringkollektiv/SitePages/"
        $importFileName = 'C:\Git\LBIntranet\Powershell\MigratePages\ImportFiles\LønsikringKollektivCSV.csv'
    }
    elseif($branch -eq 14)
    {
        $branchSiteUrl="http://intranet.lb.dk/Skade/hb/lønsikringkollektiv/SitePages/"
        $importFileName = 'C:\Git\LBIntranet\Powershell\MigratePages\ImportFiles\LønsikringKollektivCSVRepair.csv'
    }
    elseif($branch -eq 15)
    {
        $branchSiteUrl="http://intranet.lb.dk/Skade/hb/retshj/SitePages/"
        $importFileName = 'C:\Git\LBIntranet\Powershell\MigratePages\ImportFiles\RetshjælpCSV.csv'
    }
    elseif($branch -eq 16)
    {
        $branchSiteUrl="http://intranet.lb.dk/Skade/hb/retshj/SitePages/"
        $importFileName = 'C:\Git\LBIntranet\Powershell\MigratePages\ImportFiles\RetshjælpCSVRepair.csv'
    }
    elseif($branch -eq 17)
    {
        $branchSiteUrl="http://intranet.lb.dk/Skade/hb/sp/SitePages/"
        $importFileName = 'C:\Git\LBIntranet\Powershell\MigratePages\ImportFiles\ScalePointCSV.csv'
    }
    elseif($branch -eq 18)
    {
        $branchSiteUrl="http://intranet.lb.dk/Skade/sp/sp/SitePages/"
        $importFileName = 'C:\Git\LBIntranet\Powershell\MigratePages\ImportFiles\ScalePointCSVRepair.csv'
    }
    elseif($branch -eq 19)
    {
        $branchSiteUrl="http://intranet.lb.dk/Skade/hb/reg/SitePages/"
        $importFileName = 'C:\Git\LBIntranet\Powershell\MigratePages\ImportFiles\RegressCSV.csv'
    }
    elseif($branch -eq 20)
    {
        $branchSiteUrl="http://intranet.lb.dk/Skade/hb/reg/SitePages/"
        $importFileName = 'C:\Git\LBIntranet\Powershell\MigratePages\ImportFiles\RegressCSVRepair.csv'
    }
    elseif($branch -eq 21)
    {
        $branchSiteUrl="http://intranet.lb.dk/Skade/hb/Person/SitePages/"
        $importFileName = 'C:\Git\LBIntranet\Powershell\MigratePages\ImportFiles\PersonskaderCSV.csv'
    }
    elseif($branch -eq 22)
    {
        $branchSiteUrl="http://intranet.lb.dk/Skade/hb/Person/SitePages/"
        $importFileName = 'C:\Git\LBIntranet\Powershell\MigratePages\ImportFiles\PersonskaderCSVRepair.csv'
    }   
    $files = Import-Csv -Path $importFileName -Encoding UTF8 -Delimiter ';' 
    #$files = Import-Csv -Path C:\Git\LBIntranet\Powershell\MigratePages\ImportFiles\BaadCSVPrerun.csv -Encoding UTF8
    #$files = Import-Csv -Path C:\Git\LBIntranet\Powershell\MigratePages\ImportFiles\BaadCSV.csv -Encoding UTF8
    #$files = Import-Csv -Path C:\Git\LBIntranet\Powershell\MigratePages\ImportFiles\BeredskabCSVPrerun.csv -Encoding UTF8

        #$files = Import-Csv -Path C:\Git\LBIntranet\Powershell\MigratePages\ImportFiles\BeredskabCSV.csv -Encoding UTF8
        #$files = Import-Csv -Path C:\Git\LBIntranet\Powershell\MigratePages\ImportFiles\BaadCSVRepair.csv -Encoding UTF8 -Delimiter ';'
        #$files = Import-Csv -Path C:\Git\LBIntranet\Powershell\MigratePages\ImportFiles\BygCSV.csv -Encoding UTF8
        #$files = Import-Csv -Path C:\Git\LBIntranet\Powershell\MigratePages\ImportFiles\BygCSVRepair.csv -Encoding UTF8

        #$files = Import-Csv -Path C:\Git\LBIntranet\Powershell\MigratePages\ImportFiles\HundCSV.csv -Encoding UTF8

        #$files = Import-Csv -Path C:\Git\LBIntranet\Powershell\MigratePages\ImportFiles\HundCSVPrerun.csv -Encoding UTF8
        #$files = Import-Csv -Path C:\Git\LBIntranet\Powershell\MigratePages\ImportFiles\EjerskifteCSV.csv -Encoding UTF8
        #$files = Import-Csv -Path C:\Git\LBIntranet\Powershell\MigratePages\ImportFiles\GerningsmandCSVPrerun.csv -Encoding UTF8
        #$files = Import-Csv -Path C:\Git\LBIntranet\Powershell\MigratePages\ImportFiles\AnsvarToSkadeCSV.csv -Encoding UTF8



        
        $sw = [Diagnostics.Stopwatch]::StartNew()
    
        $files |foreach-object {
        
        $i=$i+1;
        #$currentFileName=$_.Navn;
        $currentFileName=$_.SourcePath;
        #$currentFileName=$_.Title;
        

        Write-Host "Processing " $i " of " $files.count "- elapsed time: " $sw.Elapsed -ForegroundColor Yellow
        Write-Host “Url :”  $currentFileName -ForegroundColor Yellow
        Write-Host ""

            if($i -ge $startIndex){
                ProcesFile -branchSiteUrl $branchSiteUrl -fileName $currentFileName
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
#$files = Import-Csv -Path C:\Test\Indbohandbog.csv
#$IE= new-object -ComObject "InternetExplorer.Application"
#$IE2= new-object -ComObject "InternetExplorer.Application"
$sw = [Diagnostics.Stopwatch]::StartNew()
$i=0;


Run -startIndex $i


<#

$files |foreach-object {
    
        ProcesFile -fileName $_.Navn
    
}


$files |foreach-object {

        try{
            $i=$i+1;
            Write-Host "Processing " $i "of" $files.count "- elapsed time: " $sw.Elapsed -ForegroundColor Yellow
            Write-Host “Url :”  $_.Navn -ForegroundColor Yellow
            Write-Host ""

            $currentPage =$_.Navn;
            if($currentPage.IndexOf('.aspx') -ge 0)
            {
                $url = [uri]::EscapeDataString($_.Navn)
                #$url = [uri]::EscapeDataString("A conto-betaling.aspx")
                
                $sourceUrl= "http://intranet.lb.dk/Skade/hb/indbo/SitePages/" + $url ;
                $targetUrl= "https://lbforsikring.sharepoint.com/sites/Skade/SitePages/" + $url ;
            
                #GetSourceFile -url $sourceUrl -IE $IE
                #GetTargetFile -url $targetUrl -IE $IE2

                GetSourceFile -url $sourceUrl 
                GetTargetFile -url $targetUrl 
            }
            else
            {
                "WARNING - Bad filename"  +  $currentPage | Out-File C:\Test\Errors.txt -Append
            }
        }
        catch{
                Write-Host  $currentPage " - "$($PSItem.ToString()) -ForegroundColor Red
                "ERROR - Page"  +  $currentPage  | Out-File C:\Test\Errors.txt -Append
                "ERROR - Cause"  +  $($PSItem.ToString()) | Out-File C:\Test\Errors.txt -Append
                "ERROR - #############################"| Out-File C:\Test\Errors.txt -Append
        }
        finally{
            $_.Navn | Out-File C:\Test\FilesWithErrors.txt -Append
            sleep -milliseconds 5000
        }
}


#>


