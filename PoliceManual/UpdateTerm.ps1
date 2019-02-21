Connect-PnPOnline -Credentials -NICD- -Url https://lbforsikring.sharepoint.com/
$tax = Get-PnPTaxonomySession
Get-PnPProperty -ClientObject $tax -Property "TermStores"
$ts = $tax.TermStores[0]
$site = Get-PnPSite
$ts.UpdateUsedTermsOnSite($site)