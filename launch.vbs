' Opens the app in its own Chrome window, starting the local server first if it is not running.
' Records live in Chrome's storage for http://localhost:5173, so keep the same browser and port.
Option Explicit

Const APP_URL = "http://localhost:5173/"
Const CHROME = "C:\Program Files\Google\Chrome\Application\chrome.exe"
Const WAIT_LIMIT_MS = 60000

Dim shell, fso, waited
Set shell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
shell.CurrentDirectory = fso.GetParentFolderName(WScript.ScriptFullName)

Function IsServerUp()
  Dim http
  Set http = CreateObject("MSXML2.ServerXMLHTTP")
  On Error Resume Next
  http.Open "GET", APP_URL, False
  http.Send
  IsServerUp = (Err.Number = 0 And http.Status = 200)
  On Error GoTo 0
End Function

If Not IsServerUp() Then
  shell.Run "cmd /c npm run dev", 0, False
  waited = 0
  Do While Not IsServerUp()
    If waited >= WAIT_LIMIT_MS Then
      MsgBox "Local server did not start. Run 'npm run dev' in " & shell.CurrentDirectory & " to see the error.", 16, "OPIc"
      WScript.Quit 1
    End If
    WScript.Sleep 500
    waited = waited + 500
  Loop
End If

If fso.FileExists(CHROME) Then
  shell.Run """" & CHROME & """ --app=" & APP_URL, 1, False
Else
  shell.Run "msedge --app=" & APP_URL, 1, False
End If
