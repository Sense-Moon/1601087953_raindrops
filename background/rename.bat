@echo off
setlocal enabledelayedexpansion

set "prefix="
set "extension=.png"

set /a i=0

:loop
if exist "%prefix%!i!%extension%" (
    set /a i+=1
    goto :loop
)

for %%a in (*%extension%) do (
    ren "%%~a" "%prefix%!i!%extension%"
    set /a i+=1
)

echo All files have been renamed.
pause
