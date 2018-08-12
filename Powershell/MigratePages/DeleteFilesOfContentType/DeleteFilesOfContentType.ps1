

$contentTypes = Import-Csv -Path C:\Git\LBIntranet\Powershell\MigratePages\DeleteFilesOfContentType\ContentType.csv -Encoding UTF8 -Delimiter ';'
$site="https://lbforsikring.sharepoint.com/sites/skade"

Connect-PnPOnline -Url $site -Credentials 'sadmnicd@lbforsikring.onmicrosoft.com'

foreach($contentType in $contentTypes){

    $query= [string]::Format("<View><Query><Where><Eq><FieldRef Name='ContentType'/><Value Type='computed'>{0}</Value></Eq></Where></Query></View>", $contentType.ContentTypeName) 
    $listItems=Get-PnPListItem -List 'Webstedssider' -Query $query


    #$items=Get-PnPListItem -List Webstedssider -Query "<View><Query><Where><Eq><FieldRef Name='ContentType'/><Value Type='computed'>$contentType.ContentTypeName</Value></Eq></Where></Query></View>"
    $listItems | ForEach-Object {
            Write-Host 'Deleting : ' $_.Title
                Remove-PnPListItem -List SitePages -Identity $_.Id -Force
            }
}



