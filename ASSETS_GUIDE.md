# 🎮 Game Assets Guide

## Current Asset Setup

All assets are now centrally configured in `game.js` under the `ASSETS` object.

### Asset Structure

```
Typing Shooter Game/
├── index.html
├── game.js
├── style.css
├── ASSETS_GUIDE.md (this file)
└── assets/
    ├── README.md
    ├── Background.png ⭐ (REQUIRED)
    └── rocket.png ⭐ (REQUIRED)
```

## Required Assets

### 1. Background.png
**Location**: `assets/Background.png`
- **Size**: 1920x1080px (or scalable)
- **Format**: PNG (transparency optional)
- **Purpose**: Main space background
- **Recommendations**:
  - Grid pattern background
  - Nebula/space texture
  - Parallax-ready design

### 2. rocket.png  
**Location**: `assets/rocket.png`
- **Size**: 32x40px (exact)
- **Format**: PNG with transparency
- **Purpose**: Player rocket sprite
- **Center Point**: (16, 20) for rotation
- **Recommendations**:
  - Green-tinted rocket
  - Simple geometric design
  - Smooth edges for rotation

## Powerup Icons

All powerup icons are **embedded as SVG** (no files needed):
- ✅ Laser - Purple beam
- ✅ Bomb - Dark sphere  
- ✅ Shield - Blue protective shield
- ✅ Blast - Yellow star burst
- ✅ Life - Red heart

**No action needed** - these are automatically rendered.

## Asset Configuration (in game.js)

```javascript
const ASSETS = {
  images: {
    background: "assets/Background.png",
    rocket: "assets/rocket.png",
  },
  powerups: {
    laser: "data:image/svg+xml,...",
    bomb: "data:image/svg+xml,...",
    shield: "data:image/svg+xml,...",
    blast: "data:image/svg+xml,...",
    life: "data:image/svg+xml,...",
  },
};
```

## Loading & Fallbacks

✅ **Automatic Loading**
- Images load asynchronously
- Game starts while assets load

✅ **Fallback Graphics**
- Background → Black screen
- Rocket → Green triangle
- Powerups → SVG (always works)

## Adding Custom Assets

To add new images:

1. **Place file** in `assets/` folder
2. **Add to ASSETS config**:
   ```javascript
   const ASSETS = {
     images: {
       newAsset: "assets/myimage.png",
     }
   };
   ```
3. **Load in code**:
   ```javascript
   const myImage = new Image();
   myImage.src = ASSETS.images.newAsset;
   ```
4. **Check if loaded**:
   ```javascript
   if (myImage.complete) {
     ctx.drawImage(myImage, x, y, width, height);
   }
   ```

## Current Status

✅ Asset system initialized
✅ Configuration centralized
✅ Fallback rendering available
✅ Powerups ready (SVG embedded)
⏳ Background.png - Add to `assets/` folder
⏳ rocket.png - Add to `assets/` folder

## Testing

Game is fully playable with fallback graphics. 
Add PNG files to assets folder to use custom images.

No image = automatic fallback ✅
Broken path = automatic fallback ✅
Missing folder = error in console (still plays)

