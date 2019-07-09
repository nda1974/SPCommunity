function HashToDictionary {
  Param ([Hashtable]$ht)
  $dictionary = New-Object "System.Collections.Generic.Dictionary``2[System.String,System.String]"
  foreach ($entry in $ht.GetEnumerator()) {
    $dictionary.Add($entry.Name, $entry.Value)
  }
  return $dictionary
}

#LSBF BLÅ #5692B5
$themepallette =@{
"themePrimary" = "#016e8f";
"themeLighterAlt" = "#f1f8fb";
"themeLighter" = "#c7e4ed";
"themeLight" = "#9ccedd";
"themeTertiary" = "#4ca2bc";
"themeSecondary" = "#147c9c";
"themeDarkAlt" = "#016381";
"themeDark" = "#01536d";
"themeDarker" = "#013d50";
"neutralLighterAlt" = "#f8f8f8";
"neutralLighter" = "#f4f4f4";
"neutralLight" = "#eaeaea";
"neutralQuaternaryAlt" = "#dadada";
"neutralQuaternary" = "#d0d0d0";
"neutralTertiaryAlt" = "#c8c8c8";
"neutralTertiary" = "#c2c2c2";
"neutralSecondary" = "#858585";
"neutralPrimaryAlt" = "#4b4b4b";
"neutralPrimary" = "#333333";
"neutralDark" = "#272727";
"black" = "#1d1d1d";
"white" = "#ffffff";
"primaryBackground" = "#ffffff";
"primaryText" = "#333333";
"bodyBackground" = "#ffffff";
"bodyText" = "#333333";
"disabledBackground" = "#f4f4f4";
"disabledText" = "#c8c8c8";
}

$adminSiteUrl = "https://tailgating-admin.sharepoint.com" 
$themeName = "Trailgate Theme" 
 
$cred = Get-Credential -UserName 'nid@tailgating.onmicrosoft.com' -Message 'Hej'
Connect-SPOService $adminSiteUrl -Credential $cred  
 


Add-SPOTheme -Name $themeName -Palette $themepallette -IsInverted $false -Overwrite
