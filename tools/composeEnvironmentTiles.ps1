param([Parameter(Mandatory=$true)][string]$Root)

Add-Type -AssemblyName System.Drawing
$pixel = Join-Path $Root "assets/environment/pixel"

function New-Tile([string]$Name, [string]$Overlay, [int]$X, [int]$Y, [int]$W, [int]$H) {
  $grass = [Drawing.Bitmap]::new((Join-Path $pixel "grass-ground.png"))
  $item = [Drawing.Bitmap]::new((Join-Path $pixel $Overlay))
  $tile = [Drawing.Bitmap]::new(64,64,[Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g = [Drawing.Graphics]::FromImage($tile)
  $g.InterpolationMode = [Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
  $g.PixelOffsetMode = [Drawing.Drawing2D.PixelOffsetMode]::Half
  $g.DrawImage($grass,0,0,64,64)
  $g.DrawImage($item,$X,$Y,$W,$H)
  $g.Dispose()
  $tile.Save((Join-Path $pixel $Name),[Drawing.Imaging.ImageFormat]::Png)
  $tile.Dispose(); $item.Dispose(); $grass.Dispose()
}

New-Tile "tall-grass-tile.png" "tall-grass.png" 0 16 64 48
New-Tile "field-rock-tile.png" "field-rock.png" 8 20 48 40
New-Tile "mountain-tile.png" "mountain.png" 0 0 64 64
