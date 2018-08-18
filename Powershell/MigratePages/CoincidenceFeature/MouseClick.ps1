start iexplore.exe

#Set the average time to your system load and open an iexplorer page
Start-Sleep -Seconds 3

[system.Reflection.Assembly]::LoadWithPartialName("System.Windows.Forms") | out-null

# Set the exactly position of cursor in some iexplore hyperlink between the (open parenthesis) below: 
[System.Windows.Forms.Cursor]::Position = New-Object System.Drawing.Point(1240,489)

function Click-MouseButton
{
    $signature=@' 
      [DllImport("user32.dll",CharSet=CharSet.Auto, CallingConvention=CallingConvention.StdCall)]
      public static extern void mouse_event(long dwFlags, long dx, long dy, long cButtons, long dwExtraInfo);
'@ 

    $SendMouseClick = Add-Type -memberDefinition $signature -name "Win32MouseEventNew" -namespace Win32Functions -passThru 

        $SendMouseClick::mouse_event(0x00000002, 0, 0, 0, 0);
        $SendMouseClick::mouse_event(0x00000004, 0, 0, 0, 0);
}

Click-MouseButton