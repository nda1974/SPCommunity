$csv=import-csv C:\Git\LBIntranet\Powershell\sitesTest.csv
$cred = Get-Credential -UserName sadmnicd@lbforsikring.onmicrosoft.com -Message "Indtast noget"
Connect-SPOService -Url https://lbforsikring-admin.sharepoint.com/ -Credential $cred

Connect-PnPOnline -url https://lbforsikring.sharepoint.com/sites/sandkasse -Credentials $cred
$web = Get-PnPWeb -Includes RoleAssignments
$ctx=$web.Context
$siteGroups = $web.SiteGroups
$ctx.load($siteGroups)
$ctx.executequery()
#Add-PnPUserToGroup -LoginName nicd@lb.dk -Identity "Besøgende på Sandkasse"

foreach($group in $siteGroups) {
    Write-Host $group.Title
    $groupTitle=$group.Title;
    if($groupTitle -like 'Bes*')
    {
        # $user = Get-SPOUser -LoginName nicd@lb.dk 
        $user =Get-SPOUser -Site 'https://lbforsikring.sharepoint.com/sites/sandkasse'
        $user =Get-AzureRmADUser -UserPrincipalName 'toha@lb.dk'
        
        $group.Users.Add($user)
    }
    # if($group.Title -like 'Medlemmer*')
    # {
    #     $g = Get-SPOSiteGroup -Group $group.Title -Site $web
    #     $ctx.load($g)
    #     $ctx.executequery()
    #     Write-Host $g
    # }
}
<#
foreach($ra in $web.RoleAssignments) {
    $member = $ra.Member
    $loginName = get-pnpproperty -ClientObject $member -Property LoginName
    
    $rolebindings = get-pnpproperty -ClientObject $ra -Property RoleDefinitionBindings
    Add-PnPUserToGroup -LoginName toha@lb.dk -Identity "Reader" -
    #write-host "$($loginName) - $($rolebindings.Name)"
    write-host "$($rolebindings[0].RoleTypeKind)"  
}


$ctx=Get-PnPContext 
foreach($item in $csv)
{
    
    #Write-Host $site.SiteUrl
    #Add-SPOUser -Site $site.SiteUrl -LoginName toha@lb.dk -IsSiteCollectionAdmin $false -Group
    $s=Get-SPOSite -Identity $item.SiteUrl
    $groups=Get-SPOSiteGroup -Site $s
    Write-Host $groups
}
#>