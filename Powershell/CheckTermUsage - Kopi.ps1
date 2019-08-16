$usedTerms = @{}

$SiteURL = 'https://lbforsikring.sharepoint.com/sites/Skade/'
$SiteURL = 'https://lbforsikring.sharepoint.com/sites/intra'
#$credentials = Get-Credential -UserName nicd@lb.dk 
#$connection= Connect-PnPOnline -Url $SiteURL -Credentials $credentials

$c=Connect-PnPOnline -Url 'https://lbforsikring.sharepoint.com/sites/Skade/' -Credentials -NICD- 

Get-SPSite -Limit All | foreach {
    $web = $_.OpenWeb()
    $list = $web.Lists | where { $_.Title -eq "SitePages" }
    $list.Items | foreach {
        if ($_ -ne $null)
        {
           Write-Host $_
        }
    }
}

