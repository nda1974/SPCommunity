############################################################## Logging #########################################
  
$date= Get-Date -format MMddyyyyHHmmss  
start-transcript -path .\Log_$date.doc   
 
################################################### Get input parameters from XML ###############################
 
# Get content from XML file  
[xml]$xmlData=Get-Content ".\Inputs.xml"  
 
# ConnectSPOnline node  
[System.Xml.XmlElement]$connectSPOnline = $xmlData.Inputs.ConnectSPOnline  
$siteURL=$connectSPOnline.SiteURL  
$userName=$connectSPOnline.UserName  
$password=$connectSPOnline.Password  
 
# UploadFiles node  
[System.Xml.XmlElement]$uploadFiles = $xmlData.Inputs.UploadFiles  
 
########################################################## Get Credentials ######################################
  
function GetCredentials()  
{   
    write-host -ForegroundColor Green "Get Credentials and connect to SP Online site: " $siteURL  
    # Convert password to secure string    
    $secureStringPwd = ConvertTo-SecureString -AsPlainText $Password -Force  
 
    # Get the credentials  
    $credentials = New-Object -TypeName System.Management.Automation.PSCredential -ArgumentList $userName,$secureStringPwd   
 
    # Connect to SP online site  
    Connect-PnPOnline –Url $siteURL –Credentials $credentials      
}  
 
########################################################### Upload Files ########################################
  
function UploadFiles()  
{  
    write-host -ForegroundColor Green "Upload files to SP Online site"  
 
    # Loop through UploadFiles XML node  
    foreach($uploadFile in $uploadFiles.UploadFile)  
    {  
        # UploadFile node parameters  
        $ufSourceFolder=$uploadFile.SourceFolder  
        $upDestinationFolder=$uploadFile.DestinationFolder  
        $ufCreateFolder=$uploadFile.CreateFolder  
        $ufFolderName=$uploadFile.FolderName          
         
        # Check whether folder has to be created  
        if($ufCreateFolder="yes")  
        {     
            $siteRelativePath=$upDestinationFolder+"/"+$ufFolderName  
             
            # Returns a folder from a given site relative path, and will create it if it does not exist.             
            Ensure-PnPFolder -SiteRelativePath $siteRelativePath               
        }   
        else  
        {  
            $siteRelativePath=$upDestinationFolder              
        }  
  
        write-host -ForegroundColor Yellow "Uploading files - Source Folder: " $ufSourceFolder " - Destination Folder: " $siteRelativePath  
 
        # Loop through all the files  
        foreach($file in Get-ChildItem $ufSourceFolder)  
        {  
            $filePath=$ufSourceFolder+"\"+$file.Name    
            write-host -ForegroundColor Magenta "uploading the file.... " $file.Name  
 
            # Add files to the respective folder  
            Add-PnPFile -Path $filePath -Folder $siteRelativePath  
        }   
    }  
}  
 
#################################################################  Initiate #####################################
  
function Initiate()  
{  
     write-host -ForegroundColor Green "Initiating the script.................. "   
 
     # Get Credentials and connect to SP Online site  
     GetCredentials  
 
     # Call the required functions  
     UploadFiles  
 
     # Disconnect from the server  
     Disconnect-PnPOnline  
  
     write-host -ForegroundColor Green "Completed!!!!"   
}  
 
#################################################################################################################
  
Initiate  
Stop-Transcript  