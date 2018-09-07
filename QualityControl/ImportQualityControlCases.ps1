#region Variables 
 $Username = "sadmnicd@lbforsikring.onmicrosoft.com" 
 $Password = "MandM1974" 
 #endregion Variables

#region Credentials 
 [SecureString]$SecurePass = ConvertTo-SecureString $Password -AsPlainText -Force 
 [System.Management.Automation.PSCredential]$PSCredentials = New-Object System.Management.Automation.PSCredential($Username, $SecurePass) 
 #endregion Credentials

$SiteURL = 'https://lbforsikring.sharepoint.com/sites/Skade/'
$ListName='Quality Control - 10 sags gennemgang'

Connect-PnPOnline -Url $SiteURL -Credentials $PSCredentials
#Connect-PnPOnline -Url $SiteURL -Credentials 'sadmnicd@lbforsikring.onmicrosoft.com'

$importFilePath = 'C:\Git\LBIntranet\QualityControl\QualityControlImport.csv'
$items = Import-Csv -Path $importFilePath -Delimiter ';' -Encoding UTF8

$items | foreach{ Add-PnPListItem -List $ListName -Values @{"Title" = $_.Sagsnummer;"Afdeling"=$_.Afdeling;"Medarbejder_x0020_i_x0020_fokus"=$_.Medarbejder;"BatchID"=$_.BatchID} }
