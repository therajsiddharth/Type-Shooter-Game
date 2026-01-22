"""Generate powerup PNG assets using PIL"""
import os
from PIL import Image, ImageDraw

# Create assets directory if it doesn't exist
assets_dir = "assets"
os.makedirs(assets_dir, exist_ok=True)

def create_laser():
    """Create laser powerup icon"""
    img = Image.new('RGBA', (64, 64), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    # Purple rect with light pink center
    draw.rectangle([8, 24, 56, 40], fill=(168, 85, 247, 255))
    draw.ellipse([26, 26, 38, 38], fill=(232, 121, 249, 255))
    img.save(os.path.join(assets_dir, "Laser.png"))
    print("✓ Created Laser.png")

def create_bomb():
    """Create bomb powerup icon"""
    img = Image.new('RGBA', (64, 64), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    # Dark circle with lighter inside
    draw.ellipse([12, 12, 52, 52], fill=(17, 17, 17, 255))
    draw.ellipse([16, 16, 48, 48], fill=(51, 51, 51, 255))
    # Fuse on top
    draw.rectangle([28, 8, 36, 16], fill=(102, 102, 102, 255))
    img.save(os.path.join(assets_dir, "Bomb.png"))
    print("✓ Created Bomb.png")

def create_shield():
    """Create shield powerup icon"""
    img = Image.new('RGBA', (64, 64), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    # Shield shape (simplified polygon)
    points = [(32, 4), (50, 14), (50, 32), (32, 56), (14, 32), (14, 14)]
    draw.polygon(points, fill=(56, 189, 248, 255))
    img.save(os.path.join(assets_dir, "Shield.png"))
    print("✓ Created Shield.png")

def create_blast():
    """Create blast powerup icon"""
    img = Image.new('RGBA', (64, 64), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    # Star shape
    points = [(32, 4), (48, 24), (40, 40), (24, 40), (16, 24)]
    draw.polygon(points, fill=(251, 191, 36, 255))
    # Center circle
    draw.ellipse([24, 24, 40, 40], fill=(245, 158, 11, 255))
    img.save(os.path.join(assets_dir, "Blast.png"))
    print("✓ Created Blast.png")

def create_life():
    """Create life powerup icon"""
    img = Image.new('RGBA', (64, 64), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    # Heart shape (simplified)
    # Draw two circles on top and triangle on bottom
    draw.ellipse([8, 12, 26, 30], fill=(239, 68, 68, 255))  # Left bump
    draw.ellipse([38, 12, 56, 30], fill=(239, 68, 68, 255))  # Right bump
    points = [(16, 30), (32, 52), (48, 30), (32, 36)]  # Triangle bottom
    draw.polygon(points, fill=(239, 68, 68, 255))
    img.save(os.path.join(assets_dir, "Life.png"))
    print("✓ Created Life.png")

if __name__ == "__main__":
    try:
        create_laser()
        create_bomb()
        create_shield()
        create_blast()
        create_life()
        print("\n✅ All powerup PNG assets created successfully in assets/ folder!")
    except Exception as e:
        print(f"Error: {e}")
        print("Falling back to SVG rendering in game...")
