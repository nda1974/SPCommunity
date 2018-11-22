#Connect-PnPOnline -Url https://lbforsikring-admin.sharepoint.com/ -Credentials -any-



##Connecting to site


Connect-PnPOnline -Url https://lbforsikring.sharepoint.com/sites/sr -Credentials -NICD-

function CreatePage($pageName,$content,$group,$subGroup){


#Set variable pagename
#$pagename = “nicdTest3”
Write-Host "Creating page - " $pagename
#Add 3 new sections to the page
$page = Add-PnPClientSidePage -Name $pagename -LayoutType Article #Using layouttype Home, removes the title and banner zone
Add-PnPClientSidePageSection -Page $page -SectionTemplate OneColumn -Order 1 
Add-PnPClientSideText -Page $page -Text $content -Section 1 -Column 1 

#Add-PnPClientSidePageSection -Page $page -SectionTemplate OneColumnFullWidth -Order 1 # OneColumnFullWidth is only available if the site is a Communication site
#Add-PnPClientSidePageSection -Page $page -SectionTemplate TwoColumn -Order 2
#Add-PnPClientSidePageSection -Page $page -SectionTemplate OneColumn -Order 3
#Add Hero webpart to page
#Add-PnPClientSideWebPart -Page $page -DefaultWebPartType “Hero” -Section 1 -Column 1
#Add List webpart to the page, currently we need to provide the List-GUID,
#Add-PnPClientSideWebPart -Page $page -DefaultWebPartType “List” -Section 2 -Column 1


[string[]]$groupTermID= $null; 
[string[]]$subGroupTermID= $null; 

if($group.length -gt 0 ){
    $groups=$group.split(',')
    
    foreach ($grp in $groups) {
        
        $groupTerm = Get-PnPTerm -Identity $grp.Trim() -TermSet "Policehåndbog" -TermGroup "03ba507c-3d2e-45c1-83cc-03a2e9db3c36" -Recursive 
        $groupTermID += $groupTerm.Id

    }
}

if($subGroup.length -gt 0 ){
    $subGroups=$subGroup.split(',')
    
    foreach ($subGrp in $subGroups) {
        $subGroupTerm = Get-PnPTerm -Identity $subGrp.Trim() -TermSet "Policehåndbog" -TermGroup "03ba507c-3d2e-45c1-83cc-03a2e9db3c36" -Recursive 
        $subGroupTermID += $subGroupTerm.Id

    }
}

Set-PnPListItem -List "1db6bcc9-fecc-4fb3-917c-a461b5468952" -Identity $page.PageListItem.Id -ContentType "Police håndbog" -Values @{"Title" = "$pagename";"PoliceManualCategory" = $groupTermID; "PoliceManualSubCategory" = $subGroupTermID; } 

}
function Main{

$xlCellTypeLastCell = 5 
$startRow = 1

$excel = new-object -com excel.application
#$wb = $excel.workbooks.open("C:\Git\LBIntranet\SPOApp\SPOApp\SPOApp\PoliceManuals\PH.xlsx")
$wb = $excel.workbooks.open("C:\Git\LBIntranet\PoliceManual\PHND.xlsx")


for($i=2;$i -le $wb.Sheets[1].Rows.Count;$i++){
    $row=$wb.Sheets[1].Rows[$i];
    if($row.Columns[1].Text.Length -gt 0)
    {
        $ii++;
        $content = $row.Columns[2].Text 
        CreatePage -pageName $row.Columns[1].Text -content $row.Columns[2].Text-group $row.Columns[3].Text -subGroup $row.Columns[4].Text
        #ORG CreatePage -pageName $row.Columns[1].Text -content $row.Columns[2].Text -group $row.Columns[3].Text -subGroup $row.Columns[4].Text
        
        #Write-Host $row.Columns[1].Text
        #Write-Host $row.Columns[2].Text
        #Write-Host $row.Columns[3].Text
        #Write-Host $row.Columns[4].Text
        #Write-Host $ii
    }
    else
    {
        $excel.Workbooks.Close()
        return
    }
}


$excel.Workbooks.Close()



}

function CreateTerm(){
    New-PnPTerm -TermSet "Departments" -TermGroup "Corporate" -Name "Finance"
}


Main

