param(
  [Parameter(Mandatory=$true)][string]$InputPath,
  [Parameter(Mandatory=$true)][string]$OutputPath,
  [switch]$RemoveDarkBackdrop,
  [int]$DarkBackdropLightLimit = 112,
  [switch]$RecolorGreenToGray
)

Add-Type -AssemblyName System.Drawing
$resolvedInput = (Resolve-Path -LiteralPath $InputPath).Path
$src = [Drawing.Bitmap]::new($resolvedInput)
$small = [Drawing.Bitmap]::new(64, 64, [Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [Drawing.Graphics]::FromImage($small)
$g.Clear([Drawing.Color]::Transparent)
$g.CompositingMode = [Drawing.Drawing2D.CompositingMode]::SourceCopy
$g.InterpolationMode = [Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.PixelOffsetMode = [Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.DrawImage($src, 3, 3, 58, 58)
$g.Dispose()

# 生成元に暗い背景が残った場合だけ、画像端につながる暗色領域を透明化する。
# キャラクター内部の濃い輪郭や目は端と接続していないため保持される。
if ($RemoveDarkBackdrop) {
  $seen = [bool[,]]::new(64, 64)
  $queue = [Collections.Generic.Queue[Drawing.Point]]::new()
  for ($i = 0; $i -lt 64; $i++) {
    $queue.Enqueue([Drawing.Point]::new($i, 0)); $queue.Enqueue([Drawing.Point]::new($i, 63))
    $queue.Enqueue([Drawing.Point]::new(0, $i)); $queue.Enqueue([Drawing.Point]::new(63, $i))
  }
  while ($queue.Count) {
    $p = $queue.Dequeue()
    if ($p.X -lt 0 -or $p.X -ge 64 -or $p.Y -lt 0 -or $p.Y -ge 64 -or $seen[$p.X, $p.Y]) { continue }
    $seen[$p.X, $p.Y] = $true
    $c = $small.GetPixel($p.X, $p.Y)
    $light = (0.2126 * $c.R) + (0.7152 * $c.G) + (0.0722 * $c.B)
    if ($light -gt $DarkBackdropLightLimit -or $c.R -gt 105) { continue }
    $small.SetPixel($p.X, $p.Y, [Drawing.Color]::Transparent)
    $queue.Enqueue([Drawing.Point]::new($p.X + 1, $p.Y)); $queue.Enqueue([Drawing.Point]::new($p.X - 1, $p.Y))
    $queue.Enqueue([Drawing.Point]::new($p.X, $p.Y + 1)); $queue.Enqueue([Drawing.Point]::new($p.X, $p.Y - 1))
  }
}

# 半透明の縁を整理して、ドットの輪郭をくっきりさせる。
for ($y = 0; $y -lt 64; $y++) {
  for ($x = 0; $x -lt 64; $x++) {
    $c = $small.GetPixel($x, $y)
    if ($c.A -lt 96) { $small.SetPixel($x, $y, [Drawing.Color]::Transparent) }
    else {
      $q = { param($v) [Math]::Min(255, [Math]::Round($v / 17) * 17) }
      if ($RecolorGreenToGray -and $c.G -gt ($c.R * 1.18) -and $c.G -gt ($c.B * 1.12)) {
        $gray = [Math]::Min(221, [Math]::Max(34, [Math]::Round((0.25 * $c.R) + (0.60 * $c.G) + (0.15 * $c.B))))
        $small.SetPixel($x, $y, [Drawing.Color]::FromArgb(255, (&$q $gray), (&$q $gray), (&$q ([Math]::Min(255, $gray + 8)))))
      } else {
        $small.SetPixel($x, $y, [Drawing.Color]::FromArgb(255, (&$q $c.R), (&$q $c.G), (&$q $c.B)))
      }
    }
  }
}

$out = [Drawing.Bitmap]::new(128, 128, [Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g2 = [Drawing.Graphics]::FromImage($out)
$g2.Clear([Drawing.Color]::Transparent)
$g2.CompositingMode = [Drawing.Drawing2D.CompositingMode]::SourceCopy
$g2.InterpolationMode = [Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
$g2.PixelOffsetMode = [Drawing.Drawing2D.PixelOffsetMode]::Half
$g2.DrawImage($small, 0, 0, 128, 128)
$g2.Dispose()

$dest = [IO.Path]::GetFullPath($OutputPath)
[IO.Directory]::CreateDirectory([IO.Path]::GetDirectoryName($dest)) | Out-Null
$out.Save($dest, [Drawing.Imaging.ImageFormat]::Png)
$out.Dispose(); $small.Dispose(); $src.Dispose()
