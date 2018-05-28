#Load SharePoint Online Assemblies
Add-Type -Path "C:\Program Files\Common Files\Microsoft Shared\Web Server Extensions\16\ISAPI\Microsoft.SharePoint.Client.dll"
Add-Type -Path "C:\Program Files\Common Files\Microsoft Shared\Web Server Extensions\16\ISAPI\Microsoft.SharePoint.Client.Runtime.dll"
    
##Variables for Processing
$SiteUrl = "https://lbforsikring.sharepoint.com/sites/Skade"
$UserName="admnicd@lb.dk"
 
#Get the password to connect 
$Password = Read-host -assecurestring "Enter Password for $UserName"
$Credentials = New-Object Microsoft.SharePoint.Client.SharePointOnlineCredentials($UserName,$Password)
  
Try {    
    #Setup the context
    $Context = New-Object Microsoft.SharePoint.Client.ClientContext($SiteUrl)
    $Context.Credentials = $Credentials
     
    #Get the recycle bin
    $Site = $Context.Site
    $RecycleBinItems = $Site.RecycleBin
    $Context.Load($Site)
    $Context.Load($RecycleBinItems)
    $Context.ExecuteQuery()
 
    Write-Host "Total Number of Items found Recycle Bin:" $RecycleBinItems.Count
    $RecycleBinItems.DeleteAll()
    $Context.ExecuteQuery()
}
catch {
    write-host "Error: $($_.Exception.Message)" -foregroundcolor Red
}


#Read more: http://www.sharepointdiary.com/2016/06/sharepoint-online-powershell-to-empty-recycle-bin.html#ixzz5EVfH5tLy