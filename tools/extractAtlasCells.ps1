param(
  [Parameter(Mandatory=$true)][string]$InputPath,
  [Parameter(Mandatory=$true)][string]$OutputDirectory,
  [Parameter(Mandatory=$true)][int]$Columns,
  [Parameter(Mandatory=$true)][int]$Rows
)
Add-Type -AssemblyName System.Drawing
$src=[Drawing.Bitmap]::new((Resolve-Path -LiteralPath $InputPath).Path)
[IO.Directory]::CreateDirectory([IO.Path]::GetFullPath($OutputDirectory)) | Out-Null
$cw=[Math]::Floor($src.Width/$Columns); $ch=[Math]::Floor($src.Height/$Rows)
for($row=0;$row -lt $Rows;$row++){
  for($col=0;$col -lt $Columns;$col++){
    $w=if($col -eq $Columns-1){$src.Width-$col*$cw}else{$cw}
    $h=if($row -eq $Rows-1){$src.Height-$row*$ch}else{$ch}
    $cell=$src.Clone([Drawing.Rectangle]::new($col*$cw,$row*$ch,$w,$h),[Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $n=($row*$Columns+$col+1).ToString("00")
    $cell.Save((Join-Path $OutputDirectory ("cell-"+$n+".png")),[Drawing.Imaging.ImageFormat]::Png)
    $cell.Dispose()
  }
}
$src.Dispose()
