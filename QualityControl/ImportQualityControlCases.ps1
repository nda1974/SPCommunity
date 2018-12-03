﻿$global:emailBody=''
function _traverseGroup(){
    param
    (
        [Parameter(Mandatory=$true)] [System.Object] $group
        
    )
    $priviligedUser='';
    $group | foreach{
    
        #$global:emailBody=$global:emailBody + "<a href='https://lbforsikring.sharepoint.com/sites/skade/_layouts/15/workbench.aspx?ClaimID="+$_.ClaimID+"&BatchID="+$_.BatchID+"'>"+$_.ClaimID + "</a></br>"
        $global:emailBody=$global:emailBody + "<a href='https://lbforsikring.sharepoint.com/sites/skade/sitepages/Claim-Quality-Control.aspx?ClaimID="+$_.ClaimID+"&BatchID="+$_.BatchID+"'>Link til kvalitetskontrol af sagsnr: "+$_.ClaimID + "</a></br>"
        $priviligedUser=$_.PriviligedUser
        _createClaimControl -itemToCreate $_ 
    }
    $priviligedUser= 'Til ' +$priviligedUser
    # udkommenteret af praktiske hensyn :-)

    #Send-PnPMail -To nicd@lb.dk -Subject $priviligedUser  -Body $global:emailBody 
    $global:emailBody='';
}

function _createClaimControl(){
param
    (
        [Parameter(Mandatory=$true)] [System.Object] $itemToCreate
        
    )
    
    Add-PnPListItem -List $ListName -Values @{"Title" = $_.BatchID;
                                          "BatchID" = $_.BatchID;
                                          "PriviligedUser"=$_.PriviligedUserEmail;
                                          "EmployeeInFocus"=$_.EmployeeEmail;
                                          "EmployeeInFocusDisplayName"=$_.Employee;
                                          "ClaimID"=$_.ClaimID;
                                          "Department"=$_.Department;  
                                          "DataExtractionID"=$_.ExtractionID;}
}


#region Variables 
 $Username = "sadmnicd@lbforsikring.onmicrosoft.com" 
 $Password = "MandM2013" 
 #endregion Variables

#region Credentials 
 [SecureString]$SecurePass = ConvertTo-SecureString $Password -AsPlainText -Force 
 [System.Management.Automation.PSCredential]$PSCredentials = New-Object System.Management.Automation.PSCredential($Username, $SecurePass) 
 #endregion Credentials

$SiteURL = 'https://lbforsikring.sharepoint.com/sites/Skade/'
$ListName="Quality Control - Claims Handler Answers"

Connect-PnPOnline -Url $SiteURL -Credentials -NICD-

#$importFilePath = 'C:\Git\LBIntranet\QualityControl\Excel-output kvalitetskontrol.csv'
$importFilePath = 'C:\Git\LBIntranet\QualityControl\skadekontrol.csv'
$itemsFromFile = Import-Csv -Path $importFilePath -Delimiter ';' -Encoding UTF8
$groupeditems = $itemsFromFile  | Group-Object {$_.PriviligedUserEmail},{$_.PriviligedUserEmail}

$groupeditems | foreach{

    Write-Host $_
    _traverseGroup -group $_.Group
}


<#

$items | foreach{ 
Add-PnPListItem -List $ListName -Values @{"Title" = $_.BatchID;
                                          "BatchID" = $_.BatchID;
                                          "PriviligedUser"=$_.PriviligedUserEmail;
                                          "EmployeeInFocus"=$_.EmployeeEmail;
                                          "ClaimsNumber"=$_.ClaimID;
                                          "Department"=$_.Department;  }
}
$body = "<href src='https://lbforsikring.sharepoint.com/sites/skade/_layouts/15/workbench.aspx?1'>Goto case</a>"
Send-PnPMail -To nicd@lb.dk -Subject 'Quality Control' -Body @body -From 'Quality Control System'
 
#>
                                                                                                 