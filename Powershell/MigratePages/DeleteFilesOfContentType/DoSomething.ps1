# Loop through to get all the folders and subfolders  
Function GetFolders($folderUrl)  
{      
    $folderColl=Get-PnPFolderItem -FolderSiteRelativeUrl $folderUrl -ItemType Folder  
  
        # Loop through the folders  
        foreach($folder in $folderColl)  
        {                      
          $newFolderURL= $folderUrl+"/"+$folder.Name   

          $f=Get-PnPFolder -Url $newFolderURL
          
          $s=$f.ParentFolder.ServerRelativePath
          
          write-host -ForegroundColor Green $folderUrl
          write-host -ForegroundColor Green $folder.Name " - " $newFolderURL  
  
          # Call the function to get the folders inside folder  
          GetFolders($newFolderURL)  
        } 
}  

$site='https://lbforsikring.sharepoint.com/sites/Skade'
$site='https://tailgating.sharepoint.com/sites/DocumentCenter'
$listID = '9efd4b15-ebba-472a-90c8-966ec23cda15'
#Connect-PnPOnline -Url $site -Credentials 'sadmnicd@lbforsikring.onmicrosoft.com'
Connect-PnPOnline -Url $site -Credentials -TAILGATING-


$query= [string]::Format("<View><FieldRef Name='H_x00e5_ndbog'/><Query><Where><Eq><FieldRef Name='H_x00e5_ndbog'/><Value Type='text'>{0}</Value></Eq></Where></Query></View>", 'Bygning') 


$listItems  = Get-PnPListItem -List $listID -PageSize 1000
$list=Get-PnPList -Identity $listID


$folders = Get-PnPFolderItem -FolderSiteRelativeUrl "/Demo Processes"


GetFolders -folderUrl "/Demo Processes"
return
foreach($folder in $folders)
{
    GetFolders -folderUrl $folder.Name
}

return
#$items=Get-PnPListItem -List Webstedssider -Query "<View><Query><Where><Eq><FieldRef Name='ContentType'/><Value Type='computed'>$contentType.ContentTypeName</Value></Eq></Where></Query></View>"


foreach ($item in $listItems){
    if($item.Folder){
        Write-Host $item["Name"]
    }
    

    #Write-Host "Is folder: $item.Folder"
}

$url = "http://myspurl"
$SPWeb = Get-SPWeb $url
#retrieve list to update
$list = $SPWeb.Lists["myList"]
write-host $list.Title
#loop in lib
foreach($folder in $list.Folders)
{
  if($folder.Name -eq "10002")
  {
    $query = New-Object -Type 'Microsoft.SharePoint.SPQuery'
    $query.Folder = $folder.Folder
    $folderItems = $list.GetItems($query)
    foreach($item in $folderItems)
    {
      write-host $item.Title
    }
  }
}

