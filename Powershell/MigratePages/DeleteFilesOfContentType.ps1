
$cred = Get-Credential -UserName sadmnicd@lbforsikring.onmicrosoft.com -Message "Indtast noget"
#Connect-SPOService -Url https://lbforsikring-admin.sharepoint.com/ -Credential $cred

Connect-PnPOnline -url https://lbforsikring.sharepoint.com/sites/skade -Credentials $cred



$items=Get-PnPListItem -List SitePages -Query "<View><Query><Where><Eq><FieldRef Name='ContentTyp
e'/><Value Type='computed'>HundManual</Value></Eq></Where></Query></View>"

$items | ForEach-Object {
Write-Host "Deleting :" $_.Title
Remove-PnPListItem -List SitePages -Identity $_.Id -Force
}