$SiteURL = 'https://lbforsikring.sharepoint.com/sites/Skade/'
$ListName='Quality Control - 10 sags gennemgang'

Connect-PnPOnline -Url $SiteURL -Credentials 'sadmnicd@lbforsikring.onmicrosoft.com'

$importFilePath = 'C:\Git\LBIntranet\QualityControl\QualityControlImport.csv'
$items = Import-Csv -Path $importFilePath -Delimiter ';' -Encoding UTF8

$items | foreach{ Add-PnPListItem -List $ListName -Values @{"Title" = $_.Sagsnummer} }