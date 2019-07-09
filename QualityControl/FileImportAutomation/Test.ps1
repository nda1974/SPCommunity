$SiteURL = 'https://lbforsikring.sharepoint.com/sites/Skade/'
#$SiteURL = 'https://lbforsikring.sharepoint.com/sites/nicd'

Import-Module Sharegate	




$mypassword = ConvertTo-SecureString "MandM7777" -AsPlainText -Force
$myusername="nicd@lb.dk"
$mysite = Connect-Site -Url $SiteURL -Username $myusername -Password $mypassword



Copy-List -SourceSite $mysite -Name "Quality Control - Claims Handler Answers" -DestinationSite $mysite -ListTitleUrlSegment "QCBU" -ListTitle "ShareGate - Quality Control"

return



Connect-PnPOnline -Url $SiteURL -Credentials -NICD-
$ctx=Get-PnPContext 
Write-Output $ctx >> "C:\Git\LBIntranet\QualityControl\FileImportAutomation\log.txt"
return
$items = Get-ChildItem -Filter *.xlsx


Write-Host "Is present - $ProductionEnvironment.IsPresent"

if($items.Count -gt 1){
    Write-Host "I'm leaving the building"
    return
}

 Get-ChildItem | ForEach-Object {
  if($_.Name.Split('.')[1] -eq 'xlsx' -and $_.Name.ToUpper().Contains("ORG")-eq $true){
    Write-Host $_.Name
    Move-Item -Path $_.FullName -Destination ".\Archive"
  }
 }

#Write-Output $Object >> C:\Git\LBIntranet\QualityControl\FileImportAutomation\log.txt