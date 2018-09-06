$SiteURL = 'https://lbforsikring.sharepoint.com/sites/Skade/'
$ListName='10SagsGennemgangImport'
Connect-PnPOnline -Url $SiteURL -Credentials 'sadmnicd@lbforsikring.onmicrosoft.com'
$Ctx=Get-PnPContext 
$List = $Ctx.Web.Lists.GetByTitle($ListName)
$Ctx.Load($List) 
$Ctx.ExecuteQuery();

#$file= Get-PnPFile -Url /10SagsGennemgangImport/Mycsv.csv -FileName Mycsv.csv
$infile= Get-PnPFile -Url https://lbforsikring.sharepoint.com/sites/Skade/10SagsGennemgangImport/Mycsv.csv

$inrec="";
$counter=0;
 
$input = New-Object -TypeName System.IO.StreamReader($infile);
 
$inrec = $input.ReadLine();
while ($inrec -ne $null) {
 $output.WriteLine($inrec);
 $counter++;
 
$inrec = $input.ReadLine();
}
 
$input.Close();
$input.Dispose();
$output.Flush();
$output.Close();
$output.Dispose();
 
$filelen = New-Object -TypeName System.IO.FileInfo($outfile);
Write-Host "File $($outfile.ToString()) has length $($filelen.length) bytes";
 
Write-Host "Lines written: $counter";
Write-Host "Files used:";
Write-Host ("Input file: {0}`nOutput file: {1}" -f $infile, $outfile);
cat $outfile | Measure-Object -Line;
Write-Host "All done now";