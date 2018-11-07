function HashToDictionary {
  Param ([Hashtable]$ht)
  $dictionary = New-Object "System.Collections.Generic.Dictionary``2[System.String,System.String]"
  foreach ($entry in $ht.GetEnumerator()) {
    $dictionary.Add($entry.Name, $entry.Value)
  }
  return $dictionary
}

$themepallette = HashToDictionary(@{
"themePrimary" = "#003262";
"themeLighterAlt" = "#3c3c3c";
"themeLighter" = "#a0d1ff";
"themeLight" = "#73bbff";
"themeTertiary" = "#45a5ff";
"themeSecondary" = "#5692b5";
"themeDarkAlt" = "#0078e9";
"themeDark" = "#0061bc";
"themeDarker" = "#004a8e";
"neutralLighterAlt" = "#f8f8f8";
"neutralLighter" = "#f4f4f4";
"neutralLight" = "#eaeaea";
"neutralQuaternaryAlt" = "#dadada";
"neutralQuaternary" = "#d0d0d0";
"neutralTertiaryAlt" = "#c8c8c8";
"neutralTertiary" = "#a6a6a6";
"neutralSecondary" = "#666666";
"neutralPrimaryAlt" = "#3c3c3c";
"neutralPrimary" = "#333333";
"neutralDark" = "#212121";
"black" = "#1c1c1c";
"white" = "#ffffff";
"primaryBackground" = "#ffffff";
"primaryText" = "#333333";
"bodyBackground" = "#ffffff";
"bodyText" = "#333333";
"disabledBackground" = "#f4f4f4";
"disabledText" = "#c8c8c8";
})



$themepallette =@{
"themePrimary" = "#003262";
"themeLighterAlt" = "#cde7ff";
"themeLighter" = "#a0d1ff";
"themeLight" = "#73bbff";
"themeTertiary" = "#45a5ff";
"themeSecondary" = "#5692b5";
"themeDarkAlt" = "#0078e9";
"themeDark" = "#0061bc";
"themeDarker" = "#004a8e";
"neutralLighterAlt" = "#f8f8f8";
"neutralLighter" = "#f4f4f4";
"neutralLight" = "#eaeaea";
"neutralQuaternaryAlt" = "#dadada";
"neutralQuaternary" = "#d0d0d0";
"neutralTertiaryAlt" = "#c8c8c8";
"neutralTertiary" = "#a6a6a6";
"neutralSecondary" = "#666666";
"neutralPrimaryAlt" = "#3c3c3c";
"neutralPrimary" = "#333333";
"neutralDark" = "#212121";
"black" = "#1c1c1c";
"white" = "#ffffff";
"primaryBackground" = "#ffffff";
"primaryText" = "#333333";
"bodyBackground" = "#ffffff";
"bodyText" = "#333333";
"disabledBackground" = "#f4f4f4";
"disabledText" = "#c8c8c8";
}



Add-SPOTheme -Name "LB Company Theme V3" -Palette $themepallette -IsInverted $false -Overwrite
