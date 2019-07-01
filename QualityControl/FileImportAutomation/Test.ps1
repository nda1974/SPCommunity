

 Get-ChildItem | ForEach-Object {
  if($_.Name.Split('.')[1] -eq 'xlsx'){
    Write-Host $_.Name
    Move-Item -Path $_.FullName -Destination ".\Archive"
  }
 }

Write-Output $Object >> C:\Git\LBIntranet\QualityControl\FileImportAutomation\log.txt