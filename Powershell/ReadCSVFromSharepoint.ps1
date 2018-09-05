$SiteURL = 'https://lbforsikring.sharepoint.com/sites/Skade/'
$ListName='10SagsGennemgangImport'
Connect-PnPOnline -Url $SiteURL -Credentials 'sadmnicd@lbforsikring.onmicrosoft.com'
$Ctx=Get-PnPContext 
$List = $Ctx.Web.Lists.GetByTitle($ListName)
$Ctx.Load($List) 
$Ctx.ExecuteQuery();

$file= Get-PnPFile -Url /10SagsGennemgangImport/Mycsv.csv -FileName Mycsv.csv -AsFile
#$Ctx.Load($file) 
#$Ctx.ExecuteQuery();



#$file   = $item.File
$data   = $file.OpenBinary()
$encode = New-Object System.Text.UTF8Encoding

$test   = $encode.GetString($data)

