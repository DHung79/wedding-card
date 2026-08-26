# Thiệp Cưới Điện Tử

Tạo file HTML standalone gửi trực tiếp cho khách mời — không cần hosting.

---

## Yêu cầu

- macOS / Linux với Bash
- Không cần cài thêm thư viện nào

---

## Cách dùng

### 1. Chỉnh thông tin thiệp

Mở file `src/config.js` và điền thông tin của cặp đôi:

```js
const WEDDING_CONFIG = {
  bride: "Tên cô dâu",
  groom: "Tên chú rể",
  weddingDate: "2026-10-10",   // định dạng YYYY-MM-DD
  weddingTime: "10:00 SA",
  venue: "Tên địa điểm",
  venueAddress: "Địa chỉ đầy đủ",
  venueMapUrl: "",             // link Google Maps (để trống nếu không có)
  // ...
}
```

### 2. Thêm ảnh (tuỳ chọn)

Đặt ảnh vào thư mục `src/images/` theo quy tắc:

| Thư mục | Vai trò | Số lượng | Tối thiểu | Lý tưởng |
|---|---|---|---|---|
| `src/images/intro-bg/` | Nền màn giới thiệu (trước khi mở thiệp) | 1 ảnh | 1080×1920px | 1440×2560px |
| `src/images/cover-fullscreen/` | Phủ toàn màn hình phía sau thiệp | 1 ảnh | 1080×1920px | 1440×2560px |
| `src/images/cover-box/` | Nền của box thiệp (tối đa 780px rộng) | 1 ảnh | 780×1200px | 1560×2400px |
| `src/images/hero/` | Nền section hero | 1 ảnh | 780×400px | 1560×800px |
| `src/images/illustration/` | Ảnh minh hoạ giữa hero | 1 ảnh | 200×110px | 400×220px |
| `src/images/petals/` | Ảnh hiệu ứng lá/cánh hoa rơi | nhiều ảnh PNG | 80×80px | 120×120px |
| `src/images/album/` | Album ảnh cưới | nhiều ảnh | 800×600px | 1600×1200px |

> Ảnh có độ phân giải thấp hơn mức tối thiểu sẽ bị phóng to và mờ/bể hình.
> Trên màn hình Retina (iPhone, MacBook) cần gấp đôi kích thước tối thiểu để sắc nét.

Đặt ảnh vào đúng thư mục với tên bất kỳ. Nếu có nhiều ảnh trong `intro-bg/`, `cover-fullscreen/`, `cover-box/`, `hero/`, `illustration/` — ảnh đầu tiên theo tên sẽ được dùng.

**Lưu ý `petals/`:** Dùng ảnh PNG nền trong suốt. Build script tự tạo 50+ hạt rơi với 3 kích cỡ (nhỏ ~40px, vừa ~60px, lớn ~80px) — nhỏ và lớn chiếm 40% tổng, vừa chiếm 60%. Không có ảnh → fallback về emoji lá mặc định.

- Hỗ trợ định dạng: `.jpg`, `.jpeg`, `.png`, `.webp`
- **Không có ảnh** → hiển thị nền mặc định (gradient + hoạ tiết Ghibli)
- **Có ảnh** → build script tự động nhúng vào thiệp, không cần hosting

### 3. Build

```bash
chmod +x build.sh   # chỉ cần chạy lần đầu
./build.sh
```

### 4. Gửi file

Output là một file HTML duy nhất tại:

```
dist/wedding-card.html
```

Gửi file này trực tiếp cho khách mời qua Zalo, email, hoặc bất kỳ kênh nào.  
Khách mời chỉ cần **mở bằng trình duyệt**, không cần kết nối internet (trừ font chữ từ Google Fonts).

---

## Cấu trúc dự án

```
wedding-card/
├── src/
│   ├── config.js          ← chỉnh thông tin tại đây
│   ├── index.html         ← cấu trúc thiệp
│   ├── styles.css         ← giao diện
│   ├── app.js             ← logic (đếm ngược, hiệu ứng, album...)
│   └── images/
│       ├── intro-bg/          ← (tuỳ chọn) ảnh nền màn giới thiệu
│       ├── cover-fullscreen/  ← (tuỳ chọn) ảnh phủ toàn màn hình
│       ├── cover-box/         ← (tuỳ chọn) ảnh nền box thiệp
│       ├── hero/              ← (tuỳ chọn) ảnh nền section hero
│       ├── illustration/      ← (tuỳ chọn) ảnh minh hoạ giữa hero
│       ├── petals/            ← (tuỳ chọn) PNG hiệu ứng lá/hoa rơi
│       └── album/             ← (tuỳ chọn) ảnh album cưới
├── dist/
│   └── wedding-card.html  ← file build để gửi
└── build.sh               ← script build
```

---

## Xem trước

```bash
open dist/wedding-card.html
```
