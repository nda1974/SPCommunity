$global:emailBody=''
function _removeAllListItems(){
param(
[Parameter(Mandatory=$true)] [string] $listName
)
    
    
    $items =Get-PnPListItem -List $listName -PageSize 1000

    foreach ($item in $items)
     {
     try
     {
     Remove-PnPListItem -List $listName -Identity $item.Id -Force
     }
     catch
     {
     Write-Host “error”
    }

    } #for each end

}
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
                                          "DataExtractionID"=$_.ExtractionID;
                                          "DataExtractionDate"=$_.batchdate;}
}

function _getLipsumText(){
    $index = Get-Random -Maximum 8
    $answerDescription = @('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    'Praesent fringilla nisl eu eleifend fermentum. Donec magna sem, aliquam quis metus at, ullamcorper efficitur nibh. Vestibulum imperdiet tellus eget venenatis accumsan. Donec ipsum urna, molestie at purus a, accumsan ultrices nibh. Integer dapibus sollicitudin arcu sit amet cursus. Vestibulum ullamcorper, erat non suscipit malesuada, enim urna ornare sem, non ultrices felis elit a purus. Etiam vehicula luctus ipsum sit amet semper. Vivamus vehicula turpis et nulla tincidunt placerat ac et arcu. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec neque lectus, ullamcorper quis vehicula a, placerat eu sapien. Quisque vel elementum erat, vitae fermentum odio. Etiam ac erat sit amet dui bibendum consequat non non mi. Suspendisse sit amet mi pretium, fermentum odio id, lacinia quam. Curabitur viverra pharetra leo',
    'Aenean fringilla velit sed commodo dapibus. Mauris id tortor quam. Pellentesque tristique, massa vel vulputate aliquam, metus lacus condimentum purus, eget venenatis nisi ex in eros. Praesent rutrum dolor non mauris tristique vulputate. Nam mi magna, faucibus sed nulla ac, elementum ornare ante. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Sed finibus scelerisque purus, non iaculis mi facilisis eget. Aenean vulputate lectus vel lectus molestie posuere. Aliquam interdum justo eu magna tincidunt aliquet. Donec vehicula erat ac nunc imperdiet dignissim. Curabitur nec accumsan ipsum.',
    'Interdum et malesuada fames ac ante ipsum primis in faucibus. Fusce vel aliquam libero, sed sollicitudin orci. Morbi non magna orci. Nullam dignissim ipsum nibh, nec pretium sem iaculis id. Ut blandit accumsan mi. Cras turpis velit, finibus ac felis eget, blandit aliquam risus. Pellentesque sit amet fringilla erat. Quisque posuere lectus quis lorem porta, at pretium est bibendum.',
    'Aenean finibus mi quis erat viverra, vel ullamcorper turpis placerat. Etiam tempor nisl sed massa venenatis dignissim. Suspendisse potenti. Aliquam euismod lectus nisi, a bibendum nibh molestie vel. Pellentesque dapibus hendrerit rhoncus. Donec efficitur lacus eget neque feugiat eleifend eget nec orci. In hac habitasse platea dictumst. Quisque eu malesuada est. ',
    'Integer mollis sapien dui, luctus consequat purus sollicitudin ut. Nam gravida cursus urna et commodo. Mauris bibendum congue facilisis. Aliquam sodales at dolor a tincidunt. Aliquam venenatis, metus porttitor maximus scelerisque, dolor elit finibus felis, ut condimentum lectus nulla nec augue. Donec neque sem, accumsan a accumsan id, euismod id mauris. Proin dictum vel sapien in porta. 

     Donec id justo ligula. In bibendum lobortis metus vel auctor. Suspendisse sagittis elementum eros. Suspendisse faucibus eros id mi gravida fringilla. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Curabitur nec lectus vel arcu imperdiet volutpat. Sed vel nisi dui. Praesent vulputate vehicula dignissim.',
    'Integer id sapien ac erat accumsan fringilla eget eu turpis. Nam sed consectetur odio. Morbi elementum, elit eu tincidunt scelerisque, ipsum neque vestibulum eros, eu accumsan ex nulla a sem. Nullam lacus felis, euismod in semper vitae, scelerisque at purus. Ut lectus lorem, cursus in lobortis nec, faucibus eget velit. Nunc gravida libero consequat ligula dictum posuere. Suspendisse non nibh ut enim dignissim iaculis sed sed eros. Cras eleifend volutpat odio in sodales. Nunc pharetra blandit ex, eget tempus sapien varius vel. Phasellus aliquam hendrerit augue, at tempus nunc lacinia et. Ut sodales sem sapien',
    'Aliquam lacinia diam id cursus porttitor. Etiam ut lorem eu metus ultricies convallis. Curabitur congue mi et nulla tristique commodo. Proin non neque eget est placerat porta. Quisque sed aliquam neque. Cras lacus elit, semper eu egestas dapibus, pellentesque quis nulla. Nulla tristique consectetur imperdiet. Nulla eleifend risus purus, quis tristique nulla rhoncus a. Aliquam imperdiet ornare mi vitae gravida. Vestibulum eu urna eget enim tristique pharetra. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Maecenas in mauris mattis lectus feugiat rhoncus sit amet sit amet augue. Ut ullamcorper, ante vehicula pulvinar mattis, turpis nibh cursus erat, ac semper leo sapien id tellus. Mauris vitae turpis sed diam commodo feugiat ac sit amet dolor.',
    'Vestibulum consectetur lectus sed maximus vulputate. Nullam accumsan, sapien dignissim luctus congue, lacus libero aliquet urna, in blandit dolor augue sit amet odio. Phasellus quam dui, pellentesque sed gravida et, malesuada suscipit elit. Vestibulum lobortis, mi sed pretium egestas, nulla urna laoreet enim, sed lacinia turpis nulla eget arcu. Suspendisse semper diam et ex accumsan, non convallis sem volutpat. Morbi imperdiet sem ut enim egestas, eu imperdiet lorem fringilla. In suscipit egestas arcu sed aliquam. Curabitur tincidunt arcu vitae velit tempor cursus vel in est.'
    )
    return $answerDescription[$index]
}
function _createTestItemsForReporting(){
    
    $config = @(
    
    <#
                    @{ExtractionId='EXTRACTION-NICD-1';
                    BatchId='BATCH-NICD-1';
                    batchdate='30-dec-19';
                    Answer1=$false;
                    Answer1Remark=0;
                    Answer2=$false;
                    Answer2Remark=0;
                    Answer3=$false;
                    Answer3Remark=0;
                    Answer4=$false;
                    Answer4Remark=0;
                    Answer5=$false;
                    Answer5Remark=0;
                    Answer6=$false;
                    Answer6Remark=0;
                    Answer1Description=_getLipsumText;
                    Answer2Description=_getLipsumText;
                    Answer3Description=_getLipsumText;
                    Answer4Description=_getLipsumText;
                    Answer5Description=_getLipsumText;
                    Answer6Description=_getLipsumText;
                    ControlSubmitted=$true;
                    },
                    @{ExtractionId='EXTRACTION-NICD-1';
                    BatchId='BATCH-NICD-2';
                    batchdate='30-dec-19';
                    Answer1=$false;
                    Answer1Remark=0;
                    Answer2=$false;
                    Answer2Remark=0;
                    Answer3=$false;
                    Answer3Remark=0;
                    Answer4=$false;
                    Answer4Remark=0;
                    Answer5=$false;
                    Answer5Remark=0;
                    Answer6=$false;
                    Answer6Remark=0;
                    Answer1Description=_getLipsumText;
                    Answer2Description=_getLipsumText;
                    Answer3Description=_getLipsumText;
                    Answer4Description=_getLipsumText;
                    Answer5Description=_getLipsumText;
                    Answer6Description=_getLipsumText;
                    ControlSubmitted=$true;
                    }

                    <#
                    @{ExtractionId='EXTRACTION-NICD-2';
                    BatchId='BATCH-NICD-3';
                    batchdate='30-nov-19';
                    Answer1=$false;
                    Answer1Remark=0;
                    Answer2=$false;
                    Answer2Remark=0;
                    Answer3=$false;
                    Answer3Remark=0;
                    Answer4=$false;
                    Answer4Remark=0;
                    Answer5=$false;
                    Answer5Remark=0;
                    Answer6=$false;
                    Answer6Remark=0;
                    Answer1Description=_getLipsumText;
                    Answer2Description=_getLipsumText;
                    Answer3Description=_getLipsumText;
                    Answer4Description=_getLipsumText;
                    Answer5Description=_getLipsumText;
                    Answer6Description=_getLipsumText;
                    ControlSubmitted=$true;
                    },
                    @{ExtractionId='EXTRACTION-NICD-2';
                    BatchId='BATCH-NICD-4';
                    batchdate='30-nov-19';
                    Answer1=$false;
                    Answer1Remark=0;
                    Answer2=$false;
                    Answer2Remark=0;
                    Answer3=$false;
                    Answer3Remark=0;
                    Answer4=$false;
                    Answer4Remark=0;
                    Answer5=$false;
                    Answer5Remark=0;
                    Answer6=$false;
                    Answer6Remark=0;
                    Answer1Description=_getLipsumText;
                    Answer2Description=_getLipsumText;
                    Answer3Description=_getLipsumText;
                    Answer4Description=_getLipsumText;
                    Answer5Description=_getLipsumText;
                    Answer6Description=_getLipsumText;
                    ControlSubmitted=$true;
                    }
                    
                    
                    <#
                    @{ExtractionId='EXTRACTION-NICD-3';
                    BatchId='BATCH-NICD-5';
                    batchdate='30-oct-19';
                    Answer1=$false;
                    Answer1Remark=0;
                    Answer2=$false;
                    Answer2Remark=0;
                    Answer3=$false;
                    Answer3Remark=0;
                    Answer4=$false;
                    Answer4Remark=0;
                    Answer5=$false;
                    Answer5Remark=0;
                    Answer6=$false;
                    Answer6Remark=0;
                    Answer1Description=_getLipsumText;
                    Answer2Description=_getLipsumText;
                    Answer3Description=_getLipsumText;
                    Answer4Description=_getLipsumText;
                    Answer5Description=_getLipsumText;
                    Answer6Description=_getLipsumText;
                    ControlSubmitted=$true;
                    
                    },
                    @{ExtractionId='EXTRACTION-NICD-3';
                    BatchId='BATCH-NICD-6';
                    batchdate='30-oct-19';
                    Answer1=$false;
                    Answer1Remark=0;
                    Answer2=$false;
                    Answer2Remark=0;
                    Answer3=$false;
                    Answer3Remark=0;
                    Answer4=$false;
                    Answer4Remark=0;
                    Answer5=$false;
                    Answer5Remark=0;
                    Answer6=$false;
                    Answer6Remark=0;
                    Answer1Description=_getLipsumText;
                    Answer2Description=_getLipsumText;
                    Answer3Description=_getLipsumText;
                    Answer4Description=_getLipsumText;
                    Answer5Description=_getLipsumText;
                    Answer6Description=_getLipsumText;
                    ControlSubmitted=$true;
                    }
                    
                    
                    #>
                    @{ExtractionId='EXTRACTION-NICD-4';
                    BatchId='BATCH-NICD-7';
                    batchdate='30-sep-19';
                    Answer1=$false;
                    Answer1Remark=0;
                    Answer2=$false;
                    Answer2Remark=0;
                    Answer3=$false;
                    Answer3Remark=0;
                    Answer4=$false;
                    Answer4Remark=0;
                    Answer5=$false;
                    Answer5Remark=0;
                    Answer6=$false;
                    Answer6Remark=0;
                    Answer1Description=_getLipsumText;
                    Answer2Description=_getLipsumText;
                    Answer3Description=_getLipsumText;
                    Answer4Description=_getLipsumText;
                    Answer5Description=_getLipsumText;
                    Answer6Description=_getLipsumText;
                    ControlSubmitted=$true;
                    },
                    @{ExtractionId='EXTRACTION-NICD-4';
                    BatchId='BATCH-NICD-8';
                    batchdate='30-sep-19';
                    Answer1=$false;
                    Answer1Remark=0;
                    Answer2=$false;
                    Answer2Remark=0;
                    Answer3=$false;
                    Answer3Remark=0;
                    Answer4=$false;
                    Answer4Remark=0;
                    Answer5=$false;
                    Answer5Remark=0;
                    Answer6=$false;
                    Answer6Remark=0;
                    Answer1Description=_getLipsumText;
                    Answer2Description=_getLipsumText;
                    Answer3Description=_getLipsumText;
                    Answer4Description=_getLipsumText;
                    Answer5Description=_getLipsumText;
                    Answer6Description=_getLipsumText;
                    ControlSubmitted=$true;
                    }
                    
                    
                )


    $config | foreach{

        for ($i=0; $i -le 2; $i++) {
        Add-PnPListItem -List $ListName -Values @{
                                                    "Title" = 'Report test';
                                                    "BatchID" = $_.BatchID;
                                                    "ClaimID" = "ClaimID";
                                                    "DataExtractionID"=$_.ExtractionID;
                                                    "DataExtractionDate"=$_.batchdate;
                                                    "PriviligedUser"='nicd@lb.dk'
                                                    "EmployeeInFocus"='nicd@lb.dk'
                                                    "EmployeeInFocusDisplayName"='Nicolai Danielsen';
                                                    "Answer1"=$_.Answer1;
                                                    "Answer1Remark"=$_.Answer1Remark;
                                                    "Answer1Description"=$_.Answer1Description;
                                                    "Answer2"=$_.Answer2;
                                                    "Answer2Remark"=$_.Answer2Remark;
                                                    "Answer2Description"=$_.Answer2Description;
                                                    "Answer3"=$_.Answer3;
                                                    "Answer3Remark"=$_.Answer3Remark;
                                                    "Answer3Description"=$_.Answer3Description;
                                                    "Answer4"=$_.Answer4;
                                                    "Answer4Remark"=$_.Answer4Remark;
                                                    "Answer4Description"=$_.Answer4Description;
                                                    "Answer5"=$_.Answer5;
                                                    "Answer5Remark"=$_.Answer5Remark;
                                                    "Answer5Description"=$_.Answer5Description;
                                                    "Answer6"=$_.Answer6;
                                                    "Answer6Remark"=$_.Answer6Remark;
                                                    "Answer6Description"=$_.Answer6Description;
                                                    "ControlSubmitted"=$_.ControlSubmitted;
                                                    "Department"='Department'
                                                  }   
        }
    }
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
#_removeAllListItems -listName $ListName

_createTestItemsForReporting
return

#$importFilePath = 'C:\Git\LBIntranet\QualityControl\Excel-output kvalitetskontrol.csv'
$importFilePath = 'C:\Git\LBIntranet\QualityControl\skadekontrol.csv'
$importFilePath = 'C:\Git\LBIntranet\QualityControl\26NOV18_SkadetransRemastered.csv'
$importFilePath = 'C:\Git\LBIntranet\QualityControl\26NOV18_Skadetrans_OLJE.csv'
$importFilePath = 'C:\Git\LBIntranet\QualityControl\20DEC18_Skadetrans.csv'


$itemsFromFile = Import-Csv -Path $importFilePath -Delimiter ';' -Encoding UTF8
$groupeditems = $itemsFromFile  | Group-Object {$_.PriviligedUserEmail},{$_.PriviligedUserEmail}

$groupeditems | foreach{

    Write-Host $_
    _traverseGroup -group $_.Group
}
Write-Host $startTime
Write-Host Get-Date


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
                                                                                                 