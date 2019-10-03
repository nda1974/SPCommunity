cls
$searchBase = "OU=SharepointOnline,OU=O365,OU=Resource Groups,OU=Groups,OU=LB,DC=LB,DC=NET"
$searchBase = "CN=Alle Core Services,OU=Mail Distribution Groups,OU=Groups,OU=LB,DC=LB,DC=NET"
$searchBase = "CN=Alle SR Kompetence Team,OU=Mail Distribution Groups,OU=Groups,OU=LB,DC=LB,DC=NET"

$filterString = "RES-Con*"
$filterString = "Alle Core*"
$filterString = "*"
$mylist = [System.Collections.Generic.List[string]]::new()
Get-ADGroup  -SearchBase $searchBase -Filter {name -like $filterString} | 
    ForEach-Object{
        $mylist.Add($_.name)
        #Write-Host "Res grp: " $_.name | Get-ADGroupMember -Identity $_.Name 
    }


$userList=''
$counter=0
$mylist | ForEach-Object{ 
            Write-Host '################################# ' $_ ' #################################' 
            Get-ADGroupMember -Identity $_} | 
            ForEach-Object{
                            $counter+=1
                            #Write-Host $counter
                            #Write-Host (-join($_.samaccountname,"@lb.dk;"))
                            Write-Host $_.name
                            
                          }
                          Write-Host  $userList 
#Get-ADGroupMember -Identity "RES-FunctionalDocumentation-MyPage-MODIFY" | ForEach-Object{ Write-Host $_.name}
    