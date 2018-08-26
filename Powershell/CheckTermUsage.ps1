$usedTerms = @{}

Connect-PnPOnline -Url $SiteURL -Credentials 'sadmnicd@lbforsikring.onmicrosoft.com'
$Ctx=Get-PnPContext 

$web = Get-SP
        return;
        $TaxonomyategorieFld = $List.Fields.GetByInternalNameOrTitle($taxonomyField) 
        $TaxonomyKategorieFld='Håndbog'
        $Ctx.Load($List)        
        $Ctx.Load($TaxonomyategorieFld)
Get-SPSite -Limit All | foreach {
    $web = $_.OpenWeb()
    $list = $web.Lists | where { $_.Title -eq "TaxonomyHiddenList" }
    $list.Items | foreach {
        if ($_ -ne $null)
        {
            $key = ($_["Path"] + " (" + $_["IdForTerm"] + ")")
            if ($usedTerms.ContainsKey($key))
            {
                $usedTerms[$key] = ($usedTerms[$key] + ", " + $web.Url)
            }
            else
            {
                $usedTerms.Add($key, $web.Url)
            }
        }
    }
}

$usedTerms