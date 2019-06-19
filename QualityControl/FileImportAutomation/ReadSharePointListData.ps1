$global:emailBody=''
$global:questionsList
function _getSharePointListItems(){
param(
[Parameter(Mandatory=$true)] [string] $listID
)
    
    
    $items =Get-PnPListItem -List $listID -PageSize 1000
    $outputFile;
    if($listID -eq '7f1efd48-2c02-4c72-a204-4dd978020b19'){
        $outputFile='.\PriviligedUsersList.csv'
    }elseif($listID -eq 'f57d3267-9aa4-4b32-96ec-fecda70b6124'){
        $outputFile='.\LeaderGroupList.csv'
    }
    
    
    $outarray = @();
    
    foreach ($item in $items)
    {
        try
        {
            if($listID -eq '7f1efd48-2c02-4c72-a204-4dd978020b19')
            {
                $hash= @{
                        "Email"=$item['Privileged_x0020_User_x0020_Name'].Email
                        "Name"=$item['Privileged_x0020_User_x0020_Name'].LookupValue
                        "Distribution"=$item['Distribution']
                        "Afdeling"=$item['Department']
                        "Team"=$item['Team']
                        "Status"=$item['Status']
                        "Rolle"=$item['EmployeeRole']
                        }
            }

            if($listID -eq 'f57d3267-9aa4-4b32-96ec-fecda70b6124')
            {
                $hash= @{
                        "Email"=$item['Email']
                        "Leader"=$item['Leader'].Email
                        "Status"=$item['Status']
                        }
            }

            $newRow = New-Object -Property $hash -TypeName psobject
            $outarray += $newRow

        }
        catch
        {
            Write-Host “error”
        }

    } 
    #for each end

    $outarray | Export-Csv -Path $outputFile -Encoding UTF8 -Delimiter ';' -NoTypeInformation 

}

<#
function _createClaimControlItem(){
param
    (
        [Parameter(Mandatory=$true)] [System.Object] $itemToCreate,
        [Parameter(Mandatory=$true)] [bool] $isTestDrive,
        [Parameter(Mandatory=$true)] [string] $listID
        
    )
    $questions = $global:questionsList
    
    
    
    
    
    Add-PnPListItem -List $listID -Values $evaluationItem
    
}
#>

<#
function _createQuarterlyReport(){
    $URI ='https://prod-91.westeurope.logic.azure.com:443/workflows/bbe3b88806ee4d988b96d4eca37b792f/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=cI7oIMOy00OKG3h7Tfac1TJkFrvE3PTd_3LpaIeyLmw'
    $body = ConvertTo-JSON @{text  = 'Hello World cmd'}; 
    Invoke-RestMethod -uri $URI -Method Post -body $body -ContentType 'application/json'
}

#>



############################################# START ###################################################

    
$SiteURL = 'https://lbforsikring.sharepoint.com/sites/Skade/' 
Connect-PnPOnline -Url $SiteURL -Credentials -NICD-

$QualityControl_Priviliged_Users_ListID = '7f1efd48-2c02-4c72-a204-4dd978020b19'
$QualityControl_LeaderGroup_ListID ='f57d3267-9aa4-4b32-96ec-fecda70b6124'
$listIds = @($QualityControl_Priviliged_Users_ListID,$QualityControl_LeaderGroup_ListID );

foreach($item in $listIds)
{
    _getSharePointListItems -listID $item
}
#_getPriviligedUserListItems -listID $QualityControl_Priviliged_Users_ListID




