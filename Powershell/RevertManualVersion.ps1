#Import SharePoint Online module
#Import-Module Microsoft.Online.SharePoint.Powershell
Function Restore-PreviousVersion()
{
  param
    (
        [Parameter(Mandatory=$true)] [string] $SiteURL,
        [Parameter(Mandatory=$true)] [string] $ListName
    )
   Try {
        Connect-PnPOnline -Url $SiteURL -Credentials 'sadmnicd@lbforsikring.onmicrosoft.com'
        $Ctx=Get-PnPContext 
        $taxonomyField="Håndbog"

        
        $List = $Ctx.Web.Lists.GetByTitle($ListName)
        
        $TaxonomyategorieFld = $List.Fields.GetByInternalNameOrTitle($taxonomyField) 
        $TaxonomyKategorieFld='Håndbog'
        $Ctx.Load($List)        
        $Ctx.Load($TaxonomyategorieFld)
        $Ctx.ExecuteQuery();




        #Get all items from the list/library
        $query= [string]::Format("<View><Query><OrderBy><FieldRef Name='Title' Ascending='FALSE'/></OrderBy><Where><Eq><FieldRef Name='H_x00e5_ndbog'/><Value Type='Text'>{0}</Value></Eq></Where></Query></View>", "Bil") 

        $listItems=Get-PnPListItem -List $List -Query $query
        
        foreach($listItem in $listItems){  

        $file = Get-PnPFile -Url $listItem["FileRef"]
        $Ctx.Load($file)
        $Ctx.ExecuteQuery()
        
        $fileVersions=$file.Versions;
        
        $Ctx.Load($fileVersions)
        $Ctx.ExecuteQuery()
        If($fileVersions.Count -gt 0){
            Write-Host -f Green $file.Title
            foreach ($version in $fileVersions)
            {
                if($version.IsCurrentVersion -eq $false){
                    Write-Host -f Red $version.VersionLabel 
                }
                else{
                    Write-Host -f Green $version.VersionLabel
                }
                
            }
            $versionLabel=$fileVersions[$fileVersions.Count - 1].VersionLabel 
            $versionLabel = '1.0'
            #$fileVersions.RestoreByLabel($versionLabel)
            #$Ctx.ExecuteQuery()
            #$file.Publish('Published by PowerShell')
            #$ctx.ExecuteQuery()
            Write-Host -f Green "Previous version $VersionLabel Restored on :" $file.Name
            
            
        }

        }
        
        
     }
    Catch {
        write-host -f Red "Der opstod en fejl: " $_.Exception.Message
    }
} 

 

#Set parameter values
$SiteURL="https://lbforsikring.sharepoint.com/sites/Skade/"
$ListName="Webstedssider"
#Import-Csv -Path '' -Delimiter ';' -Encoding UTF8
 

#Call the function to restore previous document version
Restore-PreviousVersion -SiteURL $SiteURL -ListName $ListName
#Read more: http://www.sharepointdiary.com/2016/08/sharepoint-online-restore-previous-version-using-powershell.html#ixzz5ObHckiut
