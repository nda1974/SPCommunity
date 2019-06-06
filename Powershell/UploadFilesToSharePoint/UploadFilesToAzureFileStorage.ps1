function Upload-FileToAzureStorage {
    
    $storagename = 'lbfstoragedevtest'
    $key ='GBnc8a2MmGe5I1KQMIfLo33hMFR/U6BXcMlY7mmUwH/P6hEVXXW5LgiSKavXoQ4oD22y/NYhz3AYjhj+yf+W6g=='
    $context = New-AzureStorageContext -StorageAccountName $storagename -StorageAccountKey $key
    Set-AzureStorageFileContent -ShareName lbf-sharepoint-files -Force -Context $context -Source 'C:\Git\AzureFile.txt' -Path "Kvalitetssystem"
}


Upload-FileToAzureStorage 