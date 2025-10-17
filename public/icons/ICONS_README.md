# Icon Generation Instructions

The PWA requires icons in multiple sizes. You have two options:

## Option 1: Use Online Icon Generator (Recommended)

1. Visit https://www.pwabuilder.com/imageGenerator
2. Upload a high-quality logo (512x512 or larger)
3. Download the generated icon pack
4. Extract all icons to the `public/icons/` folder

## Option 2: Use Command Line Tools

If you have ImageMagick installed:

```bash
# Install ImageMagick first
# Windows: choco install imagemagick
# Mac: brew install imagemagick
# Linux: apt-get install imagemagick

# Convert SVG to all required sizes
magick convert icon-512x512.svg -resize 72x72 icon-72x72.png
magick convert icon-512x512.svg -resize 96x96 icon-96x96.png
magick convert icon-512x512.svg -resize 128x128 icon-128x128.png
magick convert icon-512x512.svg -resize 144x144 icon-144x144.png
magick convert icon-512x512.svg -resize 152x152 icon-152x152.png
magick convert icon-512x512.svg -resize 192x192 icon-192x192.png
magick convert icon-512x512.svg -resize 384x384 icon-384x384.png
magick convert icon-512x512.svg -resize 512x512 icon-512x512.png
magick convert icon-512x512.svg -resize 512x512 icon-512x512-maskable.png
```

## Option 3: Use Online SVG to PNG Converter

1. Visit https://cloudconvert.com/svg-to-png
2. Upload the `icon-512x512.svg` file
3. Convert to each required size:
   - 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512
4. Save each file with the corresponding name in `public/icons/`

## Required Icon Sizes

- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png
- icon-512x512-maskable.png (with safe padding)

## Temporary Fallback

For development purposes, the vite-plugin-pwa can generate basic icons automatically.
Just ensure you have at least one 512x512 icon.
