﻿param($minutes = 6000)

write "... screen will be awake for $minutes"

 $myshell = New-Object -com "Wscript.Shell"

 for ($i = 0; $i -lt $minutes; $i++) {
 write "... screen will be awake for" ($minutes-$i)
 Start-Sleep -Seconds 60    
 $myshell.sendkeys("{F15}")
}