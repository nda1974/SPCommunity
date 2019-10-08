
############################################# START ###################################################

$SiteURL = 'https://lbforsikring.sharepoint.com/sites/Skade/'
$QualityControlClaimsHandlerAnswersListID = '433d918b-2e51-4ebb-ab2a-3fc9e2b5c540'

Connect-PnPOnline -Url $SiteURL -Credentials -NICD-

$dataExtracionID="30SEP19Q3"
$priviligedUserEmail="mabr@lb.dk"

$listItems = (Get-PnPListItem -List $QualityControlClaimsHandlerAnswersListID -Fields "ClaimID","DataExtractionID","Title","PriviligedUser","ControlSubmitted").FieldValues

$i=0;
$notSubmittedCounter=0;
$listItems | ForEach-Object{
    if ($_.DataExtractionID.ToUpper() -eq $dataExtracionID -and $priviligedUserEmail.ToUpper() -eq $_.PriviligedUser.Email.ToUpper()){
        if($_.ControlSubmitted -eq $false){
        
        $notSubmittedCounter++;
        
        }
        else{
        }
        $i++
        #Write-Host "##########################################"
        #Write-Host  $_.DataExtractionID
        #Write-Host $_.PriviligedUser.Email
        Write-Host  $_.ClaimID
    }
}


Write-Host "Antal sager: " $i
Write-Host "Ikke behandlede sager: " $notSubmittedCounter

