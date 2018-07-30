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
            
            $IE = ConnectIExplorer -HWND $HWND -ShowPage $false
            Write-Host 'Sleeping.'
            $ticker = '';
            while( $IE.Busy){
                    $ticker=$ticker+'.'
                    Write-Host  '.'
                    Start-Sleep -Milliseconds 100
                    }
            
            $IE = ConnectIExplorer -HWND $HWND -ShowPage $false
            
            while( $IE.ReadyState -ne 4){
                Write-Host 'State : ' $IE.ReadyState
                Start-Sleep 1
            }
            $exitFlag =$false
            
            do {
                if ( $IE.ReadyState -eq 4 ) {

                    $sourceDocument=$IE.Document;
                    $sourceDiv=$sourceDocument.IHTMLDocument3_getElementById('layoutsTable');
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
            while( $IE2.ReadyState -ne 4){
                Write-Host 'State : '  $IE2.ReadyState
                Start-Sleep 1
                }
        
            $IE2 = ConnectIExplorer -HWND $HWND -ShowPage $true
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
                        $targetDiv.focus();
                        [System.Windows.Forms.SendKeys]::SendWait("^{a}")
                        [System.Windows.Forms.SendKeys]::SendWait("^{v}")
            
    
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

function ProcesFile($fileName)
{
        try{
            
            
            if($fileName.IndexOf('.aspx') -ge 0)
            {
                $url = [uri]::EscapeDataString($fileName)
                #$url = [uri]::EscapeDataString("A conto-betaling.aspx")
                
                $sourceUrl= "http://intranet.lb.dk/Skade/hb/Byg/SitePages/" + $url ;
                #$sourceUrl= "http://intranet.lb.dk/Skade/hb/BeSk/SitePages/" + $url ;
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
    $files=0;
    $i=0;
    $currentFileName='';
    try{
    
        
    #$files = Import-Csv -Path C:\Git\LBIntranet\Powershell\MigratePages\ImportFiles\BaadCSVPrerun.csv -Encoding UTF8
    #$files = Import-Csv -Path C:\Git\LBIntranet\Powershell\MigratePages\ImportFiles\BaadCSV.csv -Encoding UTF8
    #$files = Import-Csv -Path C:\Git\LBIntranet\Powershell\MigratePages\ImportFiles\BeredskabCSVPrerun.csv -Encoding UTF8

        #$files = Import-Csv -Path C:\Git\LBIntranet\Powershell\MigratePages\ImportFiles\BeredskabCSV.csv -Encoding UTF8
        #$files = Import-Csv -Path C:\Git\LBIntranet\Powershell\MigratePages\ImportFiles\BaadCSVRepair.csv -Encoding UTF8
        #$files = Import-Csv -Path C:\Git\LBIntranet\Powershell\MigratePages\ImportFiles\BygCSV.csv -Encoding UTF8
        $files = Import-Csv -Path C:\Git\LBIntranet\Powershell\MigratePages\ImportFiles\BygCSVRepair.csv -Encoding UTF8


        
        $sw = [Diagnostics.Stopwatch]::StartNew()
    
        $files |foreach-object {
        $i=$i+1;
        #$currentFileName=$_.Navn;
        $currentFileName=$_.SourcePath;
        

        Write-Host "Processing " $i " of " $files.count "- elapsed time: " $sw.Elapsed -ForegroundColor Yellow
        Write-Host “Url :”  $currentFileName -ForegroundColor Yellow
        Write-Host ""

            if($i -ge $startIndex){
                ProcesFile ($currentFileName)
            }
        }
    }
    catch{
        $currentFileName | Out-File C:\Git\LBIntranet\Powershell\MigratePages\LogFiles\FilesWithErrors.txt -Append            
        "Restart at index  - $i" | Out-File C:\Git\LBIntranet\Powershell\MigratePages\LogFiles\FilesWithErrors.txt -Append     
        Start-Sleep -Seconds 2
               
    }
    finally{
        if ($files.count -ge $i) {
            Run -startIndex $i    
        }
        
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


