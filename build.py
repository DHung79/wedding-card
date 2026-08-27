#!/usr/bin/env python3
"""
BUILD SCRIPT — gộp source thành 1 file HTML standalone
"""
import base64, json, os, re, sys

BASE     = sys.argv[1]
SRC      = os.path.join(BASE, "src")
IMG_DIR  = os.path.join(SRC, "images")
OUT      = os.path.join(BASE, "dist", "wedding-card.html")

IMG_EXTS  = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
MIME      = {".jpg": "image/jpeg", ".jpeg": "image/jpeg",
             ".png": "image/png",  ".webp": "image/webp", ".gif": "image/gif"}
AUDIO_EXTS = {".mp3", ".ogg", ".wav", ".m4a", ".aac"}
AUDIO_MIME = {".mp3": "audio/mpeg", ".ogg": "audio/ogg", ".wav": "audio/wav",
              ".m4a": "audio/mp4",  ".aac": "audio/aac"}

def to_data_uri(path):
    ext  = os.path.splitext(path)[1].lower()
    mime = MIME.get(ext, "image/jpeg")
    with open(path, "rb") as f:
        b64 = base64.b64encode(f.read()).decode()
    return f"data:{mime};base64,{b64}"

def first_image(folder):
    if not os.path.isdir(folder):
        return None
    files = sorted(
        f for f in os.listdir(folder)
        if os.path.splitext(f)[1].lower() in IMG_EXTS
    )
    return os.path.join(folder, files[0]) if files else None

def all_images(folder):
    if not os.path.isdir(folder):
        return []
    return sorted(
        os.path.join(folder, f) for f in os.listdir(folder)
        if os.path.splitext(f)[1].lower() in IMG_EXTS
    )

def all_audio(folder):
    if not os.path.isdir(folder):
        return []
    return sorted(
        os.path.join(folder, f) for f in os.listdir(folder)
        if os.path.splitext(f)[1].lower() in AUDIO_EXTS
    )

def to_audio_data_uri(path):
    ext  = os.path.splitext(path)[1].lower()
    mime = AUDIO_MIME.get(ext, "audio/mpeg")
    with open(path, "rb") as f:
        b64 = base64.b64encode(f.read()).decode()
    return {"src": f"data:{mime};base64,{b64}", "name": os.path.splitext(os.path.basename(path))[0]}

# --- Đọc source ---
print("▶ Đọc source files...")
html_src   = open(os.path.join(SRC, "index.html"),  encoding="utf-8").read()
css_src    = open(os.path.join(SRC, "styles.css"),  encoding="utf-8").read()
config_src = open(os.path.join(SRC, "config.js"),   encoding="utf-8").read()
app_src    = open(os.path.join(SRC, "app.js"),      encoding="utf-8").read()

# --- Xử lý ảnh ---
print("▶ Xử lý ảnh nền...")

intro_bg_file         = first_image(os.path.join(IMG_DIR, "intro-bg"))
cover_fullscreen_file = first_image(os.path.join(IMG_DIR, "cover-fullscreen"))
cover_box_file        = first_image(os.path.join(IMG_DIR, "cover-box"))
hero_file             = first_image(os.path.join(IMG_DIR, "hero"))
illustration_file     = first_image(os.path.join(IMG_DIR, "illustration"))
petal_files           = all_images(os.path.join(IMG_DIR, "petals"))
album_files           = all_images(os.path.join(IMG_DIR, "album"))

intro_bg_uri         = to_data_uri(intro_bg_file)         if intro_bg_file         else None
cover_fullscreen_uri = to_data_uri(cover_fullscreen_file) if cover_fullscreen_file else None
cover_box_uri        = to_data_uri(cover_box_file)        if cover_box_file        else None
hero_uri             = to_data_uri(hero_file)             if hero_file             else None
illustration_uri     = to_data_uri(illustration_file)     if illustration_file     else None
petal_uris           = [to_data_uri(f) for f in petal_files]

def log_img(label, f):
    if f: print(f"   ✔ {label:<18}: {os.path.basename(f)}")
    else: print(f"   — {label:<18}: không có")

log_img("intro-bg",         intro_bg_file)
log_img("cover-fullscreen", cover_fullscreen_file)
log_img("cover-box",        cover_box_file)
log_img("hero",             hero_file)
log_img("illustration",     illustration_file)
if petal_files:
    for f in petal_files:
        print(f"   ✔ {'petal':<18}: {os.path.basename(f)}")
else:
    print(f"   — {'petals':<18}: không có (dùng emoji mặc định)")

print("▶ Xử lý album ảnh...")
album_uris = []
for f in album_files:
    album_uris.append(to_data_uri(f))
    print(f"   ✔ album  : {os.path.basename(f)}")
if not album_uris:
    print("   — album  : không có ảnh")

print("▶ Xử lý nhạc...")
music_files = all_audio(os.path.join(SRC, "music"))
music_tracks = []
for f in music_files:
    track = to_audio_data_uri(f)
    music_tracks.append(track)
    size_kb = os.path.getsize(f) / 1024
    print(f"   ✔ nhạc   : {os.path.basename(f)} ({size_kb:.0f} KB)")
if not music_tracks:
    print("   — nhạc   : không có (thêm file vào src/music/)")

# --- Patch images block vào config.js ---
intro_bg_js         = json.dumps(intro_bg_uri)
cover_fullscreen_js = json.dumps(cover_fullscreen_uri)
cover_box_js        = json.dumps(cover_box_uri)
hero_js             = json.dumps(hero_uri)
illustration_js     = json.dumps(illustration_uri)
petals_js = "[\n" + ",\n".join(f"    {json.dumps(u)}" for u in petal_uris)  + "\n  ]" if petal_uris  else "[]"
album_js  = "[\n" + ",\n".join(f"    {json.dumps(u)}" for u in album_uris) + "\n  ]" if album_uris else "[]"

music_js = (
    "[\n" +
    ",\n".join(f'    {{"src": {json.dumps(t["src"])}, "name": {json.dumps(t["name"])}}}' for t in music_tracks) +
    "\n  ]"
) if music_tracks else "[]"

images_block = f"""  images: {{
    introBg:         {intro_bg_js},
    coverFullscreen: {cover_fullscreen_js},
    coverBox:        {cover_box_js},
    heroBg:          {hero_js},
    illustration:    {illustration_js},
    petals:          {petals_js},
    album:           {album_js},
  }},"""

music_block = f"  music: {music_js},"

config_patched = re.sub(
    r"  // --- Ảnh.*?  images:\s*\{.*?\},",
    images_block,
    config_src,
    flags=re.DOTALL,
)
config_patched = re.sub(
    r"  // --- Nhạc.*?  music:\s*\[.*?\],",
    music_block,
    config_patched,
    flags=re.DOTALL,
)

# Escape </script> trong data URIs để không phá vỡ HTML parser
def escape_script_tag(s):
    return s.replace("</script>", r"<\/script>").replace("</SCRIPT>", r"<\/SCRIPT>")

config_patched = escape_script_tag(config_patched)

# --- Nhúng vào HTML ---
inline_css = f"<style>\n{css_src}\n</style>"
inline_scripts = (
    f"<script>\n{config_patched}\n</script>\n"
    f"<script>\n{app_src}\n</script>"
)

result = html_src.replace('<link rel="stylesheet" href="styles.css" />', inline_css)
result = result.replace('<script src="config.js"></script>', "")
result = result.replace('<script src="app.js"></script>', inline_scripts)

# --- Ghi output ---
with open(OUT, "w", encoding="utf-8") as f:
    f.write(result)

size = os.path.getsize(OUT)
print()
print("✅ Build thành công!")
print(f"   📄 Output    : {OUT}")
print(f"   📦 Kích thước : {size:,} bytes ({size/1024:.1f} KB)")
print(f"   🖼  Album     : {len(album_uris)} ảnh")
print(f"   🎵 Nhạc      : {len(music_tracks)} bài")
print()
print(f'   Mở để xem : open "{OUT}"')
print("   Gửi file này trực tiếp cho người nhận — không cần hosting! 🎉")
