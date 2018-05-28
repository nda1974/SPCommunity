
$items=Get-PnPListItem -List SitePages -Query "<View><Query><Where><Eq><FieldRef Name='ContentTyp
e'/><Value Type='text'>AnsvarManual</Value></Eq></Where></Query></View>"

$items | ForEach-Object {Remove-PnPListItem -List SitePages -Identity $_.Id -Force}