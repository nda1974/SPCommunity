$Username = "sadmnicd@lbforsikring.onmicrosoft.com" 
 $Password = "MandM2013" 
 #endregion Variables

#region Credentials 
 [SecureString]$SecurePass = ConvertTo-SecureString $Password -AsPlainText -Force 
 [System.Management.Automation.PSCredential]$PSCredentials = New-Object System.Management.Automation.PSCredential($Username, $SecurePass) 
 #endregion Credentials
 
$SiteURL = 'https://lbforsikring.sharepoint.com/sites/nicd/'
$ListName="NICDTest"
$ColumnName="Button"


Connect-PnPOnline -Url $SiteURL -Credentials -NICD-


Set-PnPField -List $ListName -Identity $ColumnName -Values @{CustomFormatter = @'
 {
  "$schema": "https://developer.microsoft.com/json-schemas/sp/column-formatting.schema.json",
  "elmType": "span",
  "style": {
    "color": "#0078d7"
  },
  "children": [
    {
      "elmType": "span",
      "attributes": {
        "iconName": "Flow"
      }
    },
    {
      "elmType": "button",
      "style": {
        "border": "none",
        "background-color": "transparent",
        "color": "#0078d7",
        "cursor": "pointer"
      },
      "txtContent": "Send to Powershell2",
      "customRowAction": {
        "action": "executeFlow",
        "actionParams": "{\"id\": \"60f23873-c2f3-4565-ab84-2ce0344053e7\"}"
      }
    }
  ]
}
'@
} 