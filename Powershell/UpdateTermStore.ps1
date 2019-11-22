#Load SharePoint Online Assemblies
#Add-Type -Path "C:\Program Files\Common Files\Microsoft Shared\Web Server Extensions\16\ISAPI\Microsoft.SharePoint.Client.dll"
#Add-Type -Path "C:\Program Files\Common Files\Microsoft Shared\Web Server Extensions\16\ISAPI\Microsoft.SharePoint.Client.Runtime.dll"
    
##Variables for Processing
$SiteUrl = "https://lbforsikring.sharepoint.com/sites/skade"
$UserName="admnicd@lb.dk"
 
#Get the password to connect 
$Password = Read-host -assecurestring "Enter Password for $UserName"
$Credentials = Get-Credential -UserName 'admnicd@lbforsikring.onmicrosoft.com'
  
Connect-PnPOnline -Url $SiteUrl -Credentials $Credentials

$tax = Get-PnPTaxonomySession
Get-PnPProperty -ClientObject $tax -Property "TermStores"
$ts = $tax.TermStores[0]
$site = Get-PnPSite
$ts.UpdateUsedTermsOnSite($site)