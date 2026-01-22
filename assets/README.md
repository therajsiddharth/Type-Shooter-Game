# Game Assets Directory

This folder contains all game assets organized by type.

## Asset Files

### Images
- **Background.png** - Main space background (parallax/grid pattern)
- **rocket.png** - Player rocket sprite (32x40px recommended)

### Powerup Icons
Powerup icons are generated as inline SVG in the game code:
- Laser (purple beam icon)
- Bomb (dark sphere with fuse)
- Shield (blue protective shield)
- Blast (yellow star burst)
- Life (red heart)

## Asset Specifications

### Background.png
- **Dimensions**: 1920x1080 or scalable
- **Format**: PNG with transparency
- **Purpose**: Tiled/scrolling space background
- **Recommended**: Grid pattern or nebula texture

### rocket.png
- **Dimensions**: 32x40 pixels
- **Format**: PNG with transparency
- **Purpose**: Player rocket sprite (rotates)
- **Anchor Point**: Center (16, 20)
- **Recommended**: Simple geometric rocket shape

## Loading

All assets are automatically loaded in `game.js`:
```javascript
const backgroundImage = new Image();
backgroundImage.src = "assets/Background.png";

const rocketImage = new Image();
rocketImage.src = "assets/rocket.png";
```

### Fallback Rendering
If images fail to load, the game uses fallback graphics:
- Background → Black screen
- Rocket → Green drawn triangle
- Powerups → SVG icons (always work)

## Adding New Assets

1. Place asset file in `assets/` folder
2. Create new Image object in game.js
3. Set `.src` to asset path
4. Add image.complete checks before drawing
5. Provide fallback rendering

## Notes

- All paths are relative to game.js location
- PNG format recommended for transparency
- SVG powerup icons ensure no asset dependency for core gameplay
- Game is fully playable without image assets
