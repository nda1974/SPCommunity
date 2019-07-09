# Excelproblems - https://superuser.com/questions/579900/why-cant-excel-open-a-file-when-run-from-task-scheduler
# Excel DCOM https://blogs.technet.microsoft.com/the_microsoft_excel_support_team_blog/2012/11/12/microsoft-excel-or-microsoft-word-does-not-appear-in-dcom-configuration-snap-in/
Param(
    [Parameter(Mandatory=$true, Position=0)]
    [ValidateSet("Production","Development")]
    [string] $Environment,
    [Parameter(Mandatory=$false, Position=1)]
    [string] $DeleteItemsByDataExtractionID,
    [Parameter(Mandatory=$false, Position=2)]
    [switch] $DeleteDevelopmentItems
)
<##############################################################
##                  Helper functions                          #
###############################################################>
function _createBackUpList{
    Param(
            [Parameter(Mandatory=$true, Position=0)]
            [string] $fileBaseName
        )
    Import-Module Sharegate	

    $mypassword = ConvertTo-SecureString "MandM7777" -AsPlainText -Force
    $myusername="nicd@lb.dk"
    $mysite = Connect-Site -Url $SiteURL -Username $myusername -Password $mypassword

    Copy-List -SourceSite $mysite -Name "Quality Control - Claims Handler Answers" -DestinationSite $mysite -ListTitleUrlSegment $fileBaseName -ListTitle "ShareGate - $fileBaseName"
}

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

    
    $monthString=''

    $date = Get-Date -Date $OADate -Format 'dd-MMM-yyyy' 

    for($i=0;$i -le 11;$i++){
        if( $date.Contains($cultureInfoDaDK.DateTimeFormat.AbbreviatedMonthGenitiveNames[$i]))
        {
            $res = $date.Replace($cultureInfoDaDK.DateTimeFormat.AbbreviatedMonthGenitiveNames[$i],$cultureInfoEnUS.DateTimeFormat.AbbreviatedMonthGenitiveNames[$i])
            Write-Host $date
            Write-Host $res
        }
    }
    return $res
    

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

function _deleteItemsByDataExtractionID(){
param(
[Parameter(Mandatory=$true)] [string] $listID,
[Parameter(Mandatory=$true)] [string] $dataExtractionID
)
    
    
    $items =Get-PnPListItem -List $listID -PageSize 1000

    foreach ($item in $items)
     {
        try
        {
            #if($item['DataExtractionID'] -eq '01JUL19Q3')
            if($item['DataExtractionID'] -eq $dataExtractionID)
            {
                
                Remove-PnPListItem -List $listID -Identity $item.Id -Force
            }
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
    

    
    try{
        Add-PnPListItem -List $listID -Values $evaluationItem
    }
    catch{
        Write-Output $_.Exception >> "C:\Git\LBIntranet\QualityControl\FileImportAutomation\log.txt"
    }
    
}
function _readExcelFile{
    param
    (
        [Parameter(Mandatory=$true)] [System.Object] $importFilePath
    )
    Write-Output "_readExcelFile.." >> "C:\Git\LBIntranet\QualityControl\FileImportAutomation\log.txt"
    $xlCellTypeLastCell=14
    $startRow=2
    $excel = New-Object -Com Excel.Application
    $wb = $excel.Workbooks.Open($importFilePath)
    #$wb = $excel.Workbooks.Open('C:\Git\LBIntranet\QualityControl\FileImportAutomation\17JUN19_Skadetrans.xlsx')


    $sh = $wb.Sheets.Item(1)
    $endRow = $sh.UsedRange.Rows.Count


    $itemsFromFile = @();
    for ($i = 2; $i -le $endRow; $i++){
        $hash = @{
                Team = $sh.Cells.Item($i, 1).Value2; 
                Afdeling = $sh.Cells.Item($i, 2).Value2; 
                BatchDate=_convertStringToDate -dateValueToConvert $sh.Cells.Item($i, 3).Value2; 
                FromDate=_convertStringToDate -dateValueToConvert $sh.Cells.Item($i, 4).Value2; 
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

    return $itemsFromFile

}
<#
function _createQuarterlyReport(){
    $URI ='https://prod-91.westeurope.logic.azure.com:443/workflows/bbe3b88806ee4d988b96d4eca37b792f/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=cI7oIMOy00OKG3h7Tfac1TJkFrvE3PTd_3LpaIeyLmw'
    $body = ConvertTo-JSON @{text  = 'Hello World cmd'}; 
    Invoke-RestMethod -uri $URI -Method Post -body $body -ContentType 'application/json'
}

#>

############################################# START ###################################################
try{
    $startClock = Get-Date
    Write-Output "Starting to import items" >> "C:\Git\LBIntranet\QualityControl\FileImportAutomation\log.txt"
    $items = Get-ChildItem -Path "C:\Git\LBIntranet\QualityControl\FileImportAutomation" -Filter *.xlsx
    Write-Output "File read." >> "C:\Git\LBIntranet\QualityControl\FileImportAutomation\log.txt"

    if($items.Count -eq 1){
        
        


        Write-Output "Fire in the hole." >> "C:\Git\LBIntranet\QualityControl\FileImportAutomation\log.txt"
        $importFilePath = $items[0].FullName
        $SiteURL = 'https://lbforsikring.sharepoint.com/sites/Skade/'

        Write-Output "Trying to fly to the Cloud." >> "C:\Git\LBIntranet\QualityControl\FileImportAutomation\log.txt"
        #Connect-PnPOnline -Url $SiteURL -Credentials $(Get-Credential -Credential:[-NICD-])
        #Connect-SPOService -Url $o365TenantAdmin -Credential $(Get-StoredCredential -Target [MyLabel])
        Connect-PnPOnline -Url $SiteURL -Credentials -NICD-

        
        
        Write-Output "I'm in the Cloud." >> "C:\Git\LBIntranet\QualityControl\FileImportAutomation\log.txt"
        <#
        $QualityControlClaimsHandlerAnswersListID = '433d918b-2e51-4ebb-ab2a-3fc9e2b5c540'
        $DEV_LIST_ID = 'fc98c6c2-1d45-4502-aedd-970f39c474eb'
        #>
        if($Environment -eq "Development"){
            $QualityControlClaimsHandlerAnswersListID = 'fc98c6c2-1d45-4502-aedd-970f39c474eb'
            
            if($DeleteDevelopmentItems.IsPresent -eq $true){
            _removeAllListItems -listID $QualityControlClaimsHandlerAnswersListID 
            }
        }
        elseif($Environment -eq "Production"){
            #_createBackUpList -fileBaseName $items.BaseName
            $QualityControlClaimsHandlerAnswersListID = '433d918b-2e51-4ebb-ab2a-3fc9e2b5c540'
            if($DeleteItemsByDataExtractionID -ne "")
            {
                #_deleteItemsByDataExtractionID -listID $QualityControlClaimsHandlerAnswersListID -dataExtractionID $DeleteItemsByDataExtractionID
            }
        }
        


        $date=Get-Date
        $text = "{0} - Trying to read file {1}" -f $date, $importFilePath
        Write-Output "Fire in the hole." >> "C:\Git\LBIntranet\QualityControl\FileImportAutomation\log.txt"
        _readExcelFile -importFilePath $importFilePath | ForEach-Object{
            try{
                Write-Output "Creating ITEM $_" >> "C:\Git\LBIntranet\QualityControl\FileImportAutomation\log.txt"
                $i++
                _createClaimControlItem -listID $QualityControlClaimsHandlerAnswersListID -itemToCreate $_
            }
            catch{
                Write-Output $_.Exception >> "C:\Git\LBIntranet\QualityControl\FileImportAutomation\log.txt"
            }
        }


        $stopClock = Get-Date 
        Write-Host "Kickoff - " $startClock
        Write-Host "Finished - " $stopClock
    }
    else{

    }

}
catch{
    Write-Output $_.Exception >> "C:\Git\LBIntranet\QualityControl\FileImportAutomation\log.txt"
}
