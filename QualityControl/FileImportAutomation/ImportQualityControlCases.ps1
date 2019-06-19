<##############################################################
##                  Helper functions                          #
###############################################################>
function _convertStringToDate{
    Param(
    [Parameter(Mandatory=$true, Position=0)]
        [double] $dateValueToConvert
    )



    $cultureInfoSpec = [Globalization.CultureInfo]::CreateSpecificCulture('en-US')
    $cultureInfoEnUS = New-Object system.globalization.cultureinfo(“en-US”)
    $cultureInfoDaDK = New-Object system.globalization.cultureinfo(“da-DK”)
    
    #$date= [System.DateTime]::ParseExact($dateValueToConvert,'dd-MMMM-yyyy',[System.Globalization.CultureInfo]::GetCultureInfo('en-US'))
    $OADate=[DateTime]::FromOADate($dateValueToConvert)

    $date = Get-Date -Date $OADate -Format 'dd-MMMM-yyyy' 
    #$date = Get-Date -Date $OADate -Format 'dd-MM-yyyy' 
    #$date = Get-Date -Date $OADate -Format
    return $date.Replace('maj','may')
    <#
    $dateToConvert2= Get-Date ([datetime]::ParseExact($date,$cultureInfoEnUS)) -Format "dd-MMMM-yyyy"
    $dateToConvert = [datetime]::ParseExact($date,"dd-MMMM-yyyy",$cultureInfoDaDK);
    $dateToConvert2= [datetime]::ParseExact($date,"dd-MMMM-yyyy",$cultureInfoEnUS);

    $newdate = [datetime]::ParseExact($dateToConvert,"dd-MMMM-yyyy",$cultureInfoEnUS);
    #$newdate = [datetime]::Parse($dateToConvert,$cultureInfoEnUS)
    
    return $newdate

    #>

}
function _removeAllListItems(){
param(
[Parameter(Mandatory=$true)] [string] $listID
)
    
    
    $items =Get-PnPListItem -List $listID -PageSize 1000

    foreach ($item in $items)
     {
        try
        {
        Remove-PnPListItem -List $listID -Identity $item.Id -Force
        }
        catch
        {
        Write-Host “error”
        }

    } #for each end

}


function _createClaimControlItem(){
param
    (
        [Parameter(Mandatory=$true)] [System.Object] $itemToCreate,
        [Parameter(Mandatory=$true)] [string] $listID
        
    )
    
    
    if($itemToCreate.PriviligedUserEmail -eq 'BOT'){
        $PriviligedUserEmail = $null
        $EmployeeInFocus=$null;

    }
    else{
        $PriviligedUserEmail = $itemToCreate.PriviligedUserEmail
        $EmployeeInFocus=$itemToCreate.EmployeeEmail;
    }
    
    

    $evaluationItem = @{"Title" = $itemToCreate.BatchID;
    "BatchID" = $itemToCreate.BatchID;
    "PriviligedUser"=$PriviligedUserEmail;
    "EmployeeInFocus"=$EmployeeInFocus;
    "EmployeeInFocusDisplayName"=$itemToCreate.Employee;
    "ClaimID"=$itemToCreate.ClaimID;
    "Department"=$itemToCreate.Afdeling.ToUpper();  
    "DataExtractionID"=$itemToCreate.ExtractionID;
    "DataExtractionDate"=$itemToCreate.BatchDate;
    "QuarterStartDate"=$itemToCreate.FromDate;
    "QuarterEndDate"=$itemToCreate.ToDate;
    "ControlSubmitted"=$false;
    <#
    "Question1"=$questions[0]["ControlQuestion"];
    "Question2"=$questions[1]["ControlQuestion"];
    "Question3"=$questions[2]["ControlQuestion"];
    "Question4"=$questions[3]["ControlQuestion"];
    "Question5"=$questions[4]["ControlQuestion"];
    "Question6"=$questions[5]["ControlQuestion"];
    #>
};
    

    
    
    Add-PnPListItem -List $listID -Values $evaluationItem
    
}

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

#$global:questionsList = Get-PnPListItem -List $QualityControlClaimsHandlerQuestionsListID

#$QualityControlClaimsHandlerAnswersListID = '433d918b-2e51-4ebb-ab2a-3fc9e2b5c540'

# Reading the import file revieved from BI



$DEV_LIST_ID = 'fc98c6c2-1d45-4502-aedd-970f39c474eb'
#_removeAllListItems -listID $DEV_LIST_ID 
#return

$importFilePath = '.\17JUN19_Skadetrans.xlsx'


$xlCellTypeLastCell=14
$startRow=2
$excel = New-Object -Com Excel.Application
$wb = $excel.Workbooks.Open('C:\Git\LBIntranet\QualityControl\FileImportAutomation\17JUN19_SkadetransTest.xlsx')


$sh = $wb.Sheets.Item(1)
#$endRow = $sh.UsedRange.SpecialCells($xlCellTypeLastCell).Row
$endRow = $sh.UsedRange.Rows.Count
#[DateTime]::FromOADate(43616)

$itemsFromFile = @();
for ($i = 2; $i -le $endRow; $i++){
    $hash = @{
            Team = $sh.Cells.Item($i, 1).Value2; 
            Afdeling = $sh.Cells.Item($i, 2).Value2; 
            BatchDate=$sh.Cells.Item($i, 3).Text; 
            FromDate=$sh.Cells.Item($i, 4).Text; 
            ToDate= _convertStringToDate -dateValueToConvert $sh.Cells.Item($i, 5).Value2; 
            ExtractionID=$sh.Cells.Item($i, 6).Value2; 
            BatchID=$sh.Cells.Item($i, 7).Value2; 
            ClaimID=$sh.Cells.Item($i, 8).Value2; 
            PriviligedUser=$sh.Cells.Item($i, 9).Value2; 
            PriviligedUserEmail=$sh.Cells.Item($i, 10).Value2; 
            Employee=$sh.Cells.Item($i, 13).Value2; 
            EmployeeEmail=$sh.Cells.Item($i, 14).Value2;
            }
            $newRow = New-Object -Property $hash -TypeName psobject
            $itemsFromFile += $newRow
}
$excel.Workbooks.Close()


# Looping trough all claim transactions
$i=0;

$itemsFromFile | ForEach-Object{
$i++
Write-Host "counter - " $i
    _createClaimControlItem -listID $DEV_LIST_ID -itemToCreate $_
}
$stopClock = Get-Date 
Write-Host "Kickoff - " $startClock
Write-Host "Finished - " $stopClock


