function Upload-FileToAzureStorage {
    
    $storagename = 'lbfstoragedevtest'
    $key ='GBnc8a2MmGe5I1KQMIfLo33hMFR/U6BXcMlY7mmUwH/P6hEVXXW5LgiSKavXoQ4oD22y/NYhz3AYjhj+yf+W6g=='
    $context = New-AzureStorageContext -StorageAccountName $storagename -StorageAccountKey $key
    Set-AzureStorageFileContent -ShareName lbf-sharepoint-files -Force -Context $context -Source 'C:\Git\AzureFile.txt' -Path "Kvalitetssystem"
    Set-AzureStorageFileContent -ShareName lbf-sharepoint-files -Force -Context $context -Source 'C:\Git\AzureFile.txt' 
}
function Upload-FileToAzureBlobStorage {
    
    $storagename = 'lbfstoragedevtest'
    $key ='GBnc8a2MmGe5I1KQMIfLo33hMFR/U6BXcMlY7mmUwH/P6hEVXXW5LgiSKavXoQ4oD22y/NYhz3AYjhj+yf+W6g=='
    $context = New-AzureStorageContext -StorageAccountName $storagename -StorageAccountKey $key
    Set-AzureStorageBlobContent  -Force -Context $context -File "C:\Git\AzureFile.csv" -Container 'lbf-sharepoint-blobs' -Properties @{"ContentType" = "text/csv"}
}
function Upload-TextToAzureBlobStorage {
    
    $storagename = 'lbfstoragedevtest'
    $key ='GBnc8a2MmGe5I1KQMIfLo33hMFR/U6BXcMlY7mmUwH/P6hEVXXW5LgiSKavXoQ4oD22y/NYhz3AYjhj+yf+W6g=='
    $context = New-AzureStorageContext -StorageAccountName $storagename -StorageAccountKey $key
    Set-AzureStorageBlobContent  -Force -Context $context -Blob "C:\Git\AzureFile.csv" -Container 'lbf-sharepoint-blobs' -Properties @{"ContentType" = "text/csv"} 
}

function Read-FileFromAzureStorage {
    
    $storagename = 'lbfstoragedevtest'
    $key ='GBnc8a2MmGe5I1KQMIfLo33hMFR/U6BXcMlY7mmUwH/P6hEVXXW5LgiSKavXoQ4oD22y/NYhz3AYjhj+yf+W6g=='
    $context = New-AzureStorageContext -StorageAccountName $storagename -StorageAccountKey $key
    write-host($context)

    $file = Get-AzureStorageFileContent -Path "Kvalitetssystem" -ShareName lbf-sharepoint-files -Context $context
    $content=Get-Content $file
    write-host($content)
}
#Upload-FileToAzureStorage

#Read-FileFromAzureStorage

Upload-TextToAzureBlobStorage