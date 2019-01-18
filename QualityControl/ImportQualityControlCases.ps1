$global:emailBody=''
$global:questionsList
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


function _getRandomAnswer()
{
    return Get-Random -InputObject $true,$false
}
function _getRandomRemark()
{
    return Get-Random -InputObject 0,1,2,3
}
function _getRandomSubmitted()
{
    return Get-Random -InputObject $true,$false
}
function _createClaimControlItem(){
param
    (
        [Parameter(Mandatory=$true)] [System.Object] $itemToCreate,
        [Parameter(Mandatory=$true)] [bool] $isTestDrive
        
    )
    $questions = $global:questionsList
    
    if($_.PriviligedUserEmail -eq 'BOT'){
        $PriviligedUserEmail = $null
    }
    else{
        $PriviligedUserEmail = $_.PriviligedUserEmail
    }

    if($isTestDrive -eq $true)
    {   
        $committed = _getRandomSubmitted
        $Answer1 = _getRandomAnswer;
        $Answer1Remark=0;
        $Answer1Description=$null;

        if($Answer1 -eq $false)
        {
            $Answer1Remark=_getRandomRemark;
            $Answer1Description=_getLipsumText;
        }

        $Answer2 = _getRandomAnswer;
        $Answer2Remark=0;
        $Answer2Description=$null;

        if($Answer2 -eq $false)
        {
            $Answer2Remark=_getRandomRemark;
            $Answer2Description=_getLipsumText;
        }

        $Answer3 = _getRandomAnswer;
        $Answer3Remark=0;
        $Answer3Description=$null;

        if($Answer3 -eq $false)
        {
            $Answer3Remark=_getRandomRemark;
            $Answer3Description=_getLipsumText;
        }
        
        $evaluationItem = @{"Title" = $_.BatchID;
                            "BatchID" = $_.BatchID;
                            "PriviligedUser"=$PriviligedUserEmail;
                            "EmployeeInFocus"=$_.EmployeeEmail;
                            "EmployeeInFocusDisplayName"=$_.Employee;
                            "ClaimID"=$_.ClaimID;
                            "Department"=$_.Team.ToUpper();  
                            "DataExtractionID"=$_.ExtractionID;
                            "DataExtractionDate"=$_.batchdate;
                            "Answer1"=$Answer1;
                            "Answer1Remark"=$Answer1Remark;
                            "Answer1Description"=$Answer1Description;
                            "Answer2"=$Answer2;
                            "Answer2Remark"=$Answer2Remark;
                            "Answer2Description"=$Answer2Description;
                            "Answer3"=$Answer3;
                            "Answer3Remark"=$Answer3Remark;
                            "Answer3Description"=$Answer3Description;
                            "ControlSubmitted"=_getRandomSubmitted;
                            "LinkToSummary"=$_.Employee +"_"+$_.BatchID + "_"+$_.ExtractionID +".docx";
                            "Question1"=$questions[0]["ControlQuestion"];
                            "Question2"=$questions[1]["ControlQuestion"];
                            "Question3"=$questions[2]["ControlQuestion"];
                            "Question4"=$questions[3]["ControlQuestion"];
                            "Question5"=$questions[4]["ControlQuestion"];
                            "Question6"=$questions[5]["ControlQuestion"];
                        };
    }
    else{

        $evaluationItem = @{"Title" = $_.BatchID;
                            "BatchID" = $_.BatchID;
                            "PriviligedUser"=$PriviligedUserEmail;
                            "EmployeeInFocus"=$_.EmployeeEmail;
                            "EmployeeInFocusDisplayName"=$_.Employee;
                            "ClaimID"=$_.ClaimID;
                            "Department"=$_.Team.ToUpper();  
                            "DataExtractionID"=$_.ExtractionID;
                            "DataExtractionDate"=$_.batchdate;
                            "ControlSubmitted"=$false;
                            "LinkToSummary"=$_.Employee +"_"+$_.BatchID + "_"+$_.ExtractionID +".docx";
                            "Question1"=$questions[0]["ControlQuestion"];
                            "Question2"=$questions[1]["ControlQuestion"];
                            "Question3"=$questions[2]["ControlQuestion"];
                            "Question4"=$questions[3]["ControlQuestion"];
                            "Question5"=$questions[4]["ControlQuestion"];
                            "Question6"=$questions[5]["ControlQuestion"];
                        };
    }

    
    
    Add-PnPListItem -List $ListName -Values $evaluationItem
    
}

function _getLipsumText(){
    $index = Get-Random -Maximum 8
    $answerDescription = @('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    'Praesent fringilla nisl eu eleifend fermentum. Donec magna sem, aliquam quis metus at, ullamcorper efficitur nibh. Vestibulum imperdiet tellus eget venenatis accumsan. Donec ipsum urna, molestie at purus a, accumsan ultrices nibh. Integer dapibus sollicitudin arcu sit amet cursus. Vestibulum ullamcorper, erat non suscipit malesuada, enim urna ornare sem, non ultrices felis elit a purus. Etiam vehicula luctus ipsum sit amet semper. Vivamus vehicula turpis et nulla tincidunt placerat ac et arcu. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec neque lectus, ullamcorper quis vehicula a, placerat eu sapien. Quisque vel elementum erat, vitae fermentum odio. Etiam ac erat sit amet dui bibendum consequat non non mi. Suspendisse sit amet mi pretium, fermentum odio id, lacinia quam. Curabitur viverra pharetra leo',
    'Aenean fringilla velit sed commodo dapibus. Mauris id tortor quam. Pellentesque tristique, massa vel vulputate aliquam, metus lacus condimentum purus, eget venenatis nisi ex in eros. Praesent rutrum dolor non mauris tristique vulputate. Nam mi magna, faucibus sed nulla ac, elementum ornare ante. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Sed finibus scelerisque purus, non iaculis mi facilisis eget. Aenean vulputate lectus vel lectus molestie posuere. Aliquam interdum justo eu magna tincidunt aliquet. Donec vehicula erat ac nunc imperdiet dignissim. Curabitur nec accumsan ipsum.',
    'Interdum et malesuada fames ac ante ipsum primis in faucibus. Fusce vel aliquam libero, sed sollicitudin orci. Morbi non magna orci. Nullam dignissim ipsum nibh, nec pretium sem iaculis id. Ut blandit accumsan mi. Cras turpis velit, finibus ac felis eget, blandit aliquam risus. Pellentesque sit amet fringilla erat. Quisque posuere lectus quis lorem porta, at pretium est bibendum.',
    'Aenean finibus mi quis erat viverra, vel ullamcorper turpis placerat. Etiam tempor nisl sed massa venenatis dignissim. Suspendisse potenti. Aliquam euismod lectus nisi, a bibendum nibh molestie vel. Pellentesque dapibus hendrerit rhoncus. Donec efficitur lacus eget neque feugiat eleifend eget nec orci. In hac habitasse platea dictumst. Quisque eu malesuada est. ',
    'Integer mollis sapien dui, luctus consequat purus sollicitudin ut. Nam gravida cursus urna et commodo. Mauris bibendum congue facilisis. Aliquam sodales at dolor a tincidunt. Aliquam venenatis, metus porttitor maximus scelerisque, dolor elit finibus felis, ut condimentum lectus nulla nec augue. Donec neque sem, accumsan a accumsan id, euismod id mauris. Proin dictum vel sapien in porta. Donec id justo ligula. In bibendum lobortis metus vel auctor. Suspendisse sagittis elementum eros. Suspendisse faucibus eros id mi gravida fringilla. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Curabitur nec lectus vel arcu imperdiet volutpat. Sed vel nisi dui. Praesent vulputate vehicula dignissim.',
    'Integer id sapien ac erat accumsan fringilla eget eu turpis. Nam sed consectetur odio. Morbi elementum, elit eu tincidunt scelerisque, ipsum neque vestibulum eros, eu accumsan ex nulla a sem. Nullam lacus felis, euismod in semper vitae, scelerisque at purus. Ut lectus lorem, cursus in lobortis nec, faucibus eget velit. Nunc gravida libero consequat ligula dictum posuere. Suspendisse non nibh ut enim dignissim iaculis sed sed eros. Cras eleifend volutpat odio in sodales. Nunc pharetra blandit ex, eget tempus sapien varius vel. Phasellus aliquam hendrerit augue, at tempus nunc lacinia et. Ut sodales sem sapien',
    'Rutrum massa neque nonummy mi pellentesque. Torquent nullam consequat ut laoreet eros turpis duis sodales wisi mattis montes. Volutpat tempus justo quis ultricies faucibus. Ultricies veniam enim suscipit pellentesque amet. Suspendisse sociosqu ornare. Sollicitudin id elit tellus interdum torquent a eget mollis. Sed in sodales. Egestas sociosqu ligula mauris purus vitae. Etiam maecenas lectus.',
    'Aliquam lacinia diam id cursus porttitor. Etiam ut lorem eu metus ultricies convallis. Curabitur congue mi et nulla tristique commodo. Proin non neque eget est placerat porta. Quisque sed aliquam neque. Cras lacus elit, semper eu egestas dapibus, pellentesque quis nulla. Nulla tristique consectetur imperdiet. Nulla eleifend risus purus, quis tristique nulla rhoncus a. Aliquam imperdiet ornare mi vitae gravida. Vestibulum eu urna eget enim tristique pharetra. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Maecenas in mauris mattis lectus feugiat rhoncus sit amet sit amet augue. Ut ullamcorper, ante vehicula pulvinar mattis, turpis nibh cursus erat, ac semper leo sapien id tellus. Mauris vitae turpis sed diam commodo feugiat ac sit amet dolor.',
    'Vestibulum consectetur lectus sed maximus vulputate. Nullam accumsan, sapien dignissim luctus congue, lacus libero aliquet urna, in blandit dolor augue sit amet odio. Phasellus quam dui, pellentesque sed gravida et, malesuada suscipit elit. Vestibulum lobortis, mi sed pretium egestas, nulla urna laoreet enim, sed lacinia turpis nulla eget arcu. Suspendisse semper diam et ex accumsan, non convallis sem volutpat. Morbi imperdiet sem ut enim egestas, eu imperdiet lorem fringilla. In suscipit egestas arcu sed aliquam. Curabitur tincidunt arcu vitae velit tempor cursus vel in est.'
    )
    return $answerDescription[$index]
}


############################################# START ###################################################
Write-Host "Is this a Test Drive [Y]/[N]"
[Bool] $isTestDrive = $true;

$input= Read-Host
if($input.ToString().ToUpper() -eq "N"){
    $isTestDrive=$false
}
$SiteURL = 'https://lbforsikring.sharepoint.com/sites/Skade/'
$ListName="Quality Control - Claims Handler Answers"

Connect-PnPOnline -Url $SiteURL -Credentials -NICD-
$global:questionsList = Get-PnPListItem -List "Quality Control - Claims Handler Questions"
# Remove existing list items
#_removeAllListItems -listName $ListName

# Reading the import file revieved from BI
$importFilePath = 'C:\Git\LBIntranet\QualityControl\Q2TestCSV.csv'
$itemsFromFile = Import-Csv -Path $importFilePath -Delimiter ';' -Encoding UTF8

# Looping trough all claim transactions
$itemsFromFile | ForEach-Object{
    _createClaimControlItem -itemToCreate $_ -isTestDrive $isTestDrive
}


