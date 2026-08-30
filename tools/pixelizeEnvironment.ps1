param(
  [Parameter(Mandatory=$true)][string]$InputPath,
  [Parameter(Mandatory=$true)][string]$OutputPath,
  [Parameter(Mandatory=$true)][int]$Width,
  [Parameter(Mandatory=$true)][int]$Height,
  [switch]$RemoveEdgeBackdrop,
  [switch]$PreserveAspect,
  [switch]$ChromaMagenta,
  [int]$CropInsetPercent = 0,
  [int]$EdgeTolerance = 54
)

Add-Type -AssemblyName System.Drawing
$resolvedInput = (Resolve-Path -LiteralPath $InputPath).Path
$src = [Drawing.Bitmap]::new($resolvedInput)
$out = [Drawing.Bitmap]::new($Width, $Height, [Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [Drawing.Graphics]::FromImage($out)
$g.Clear([Drawing.Color]::Transparent)
$g.CompositingMode = [Drawing.Drawing2D.CompositingMode]::SourceCopy
$g.InterpolationMode = [Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.PixelOffsetMode = [Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$insetX=[Math]::Floor($src.Width*$CropInsetPercent/100); $insetY=[Math]::Floor($src.Height*$CropInsetPercent/100)
$sourceRect=[Drawing.Rectangle]::new($insetX,$insetY,$src.Width-2*$insetX,$src.Height-2*$insetY)
if ($PreserveAspect) {
  $scale=[Math]::Min($Width/$src.Width,$Height/$src.Height)
  $dw=[Math]::Max(1,[Math]::Round($src.Width*$scale)); $dh=[Math]::Max(1,[Math]::Round($src.Height*$scale))
  $dx=[Math]::Floor(($Width-$dw)/2); $dy=$Height-$dh
  $g.DrawImage($src,[Drawing.Rectangle]::new($dx,$dy,$dw,$dh),$sourceRect,[Drawing.GraphicsUnit]::Pixel)
} else { $g.DrawImage($src,[Drawing.Rectangle]::new(0,0,$Width,$Height),$sourceRect,[Drawing.GraphicsUnit]::Pixel) }
$g.Dispose()

if ($RemoveEdgeBackdrop) {
  $corners = @($out.GetPixel(0,0), $out.GetPixel($Width-1,0), $out.GetPixel(0,$Height-1), $out.GetPixel($Width-1,$Height-1))
  $seen = [bool[,]]::new($Width, $Height)
  $queue = [Collections.Generic.Queue[Drawing.Point]]::new()
  for ($x=0; $x -lt $Width; $x++) { $queue.Enqueue([Drawing.Point]::new($x,0)); $queue.Enqueue([Drawing.Point]::new($x,$Height-1)) }
  for ($y=0; $y -lt $Height; $y++) { $queue.Enqueue([Drawing.Point]::new(0,$y)); $queue.Enqueue([Drawing.Point]::new($Width-1,$y)) }
  while ($queue.Count) {
    $p = $queue.Dequeue()
    if ($p.X -lt 0 -or $p.X -ge $Width -or $p.Y -lt 0 -or $p.Y -ge $Height -or $seen[$p.X,$p.Y]) { continue }
    $seen[$p.X,$p.Y] = $true
    $c = $out.GetPixel($p.X,$p.Y)
    $match = $false
    foreach ($bg in $corners) {
      $d = [Math]::Abs($c.R-$bg.R) + [Math]::Abs($c.G-$bg.G) + [Math]::Abs($c.B-$bg.B)
      if ($d -le ($EdgeTolerance * 3)) { $match = $true; break }
    }
    if (-not $match) { continue }
    $out.SetPixel($p.X,$p.Y,[Drawing.Color]::Transparent)
    $queue.Enqueue([Drawing.Point]::new($p.X+1,$p.Y)); $queue.Enqueue([Drawing.Point]::new($p.X-1,$p.Y))
    $queue.Enqueue([Drawing.Point]::new($p.X,$p.Y+1)); $queue.Enqueue([Drawing.Point]::new($p.X,$p.Y-1))
  }
}

# 17刻み（各色15段階）に量子化し、Gaon画像と同じ硬いドット輪郭に揃える。
for ($y=0; $y -lt $Height; $y++) {
  for ($x=0; $x -lt $Width; $x++) {
    $c = $out.GetPixel($x,$y)
    if ($ChromaMagenta -and $c.R -gt 150 -and $c.B -gt 150 -and $c.G -lt 120 -and (($c.R + $c.B) - (2 * $c.G)) -gt 140) {
      $out.SetPixel($x,$y,[Drawing.Color]::Transparent); continue
    }
    if ($c.A -lt 96) { $out.SetPixel($x,$y,[Drawing.Color]::Transparent); continue }
    $q = { param($v) [Math]::Min(255,[Math]::Round($v/17)*17) }
    $out.SetPixel($x,$y,[Drawing.Color]::FromArgb(255,(&$q $c.R),(&$q $c.G),(&$q $c.B)))
  }
}

$dest = [IO.Path]::GetFullPath($OutputPath)
[IO.Directory]::CreateDirectory([IO.Path]::GetDirectoryName($dest)) | Out-Null
$out.Save($dest,[Drawing.Imaging.ImageFormat]::Png)
$out.Dispose(); $src.Dispose()
