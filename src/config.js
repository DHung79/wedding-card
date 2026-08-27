// ============================================================
//  WEDDING CARD CONFIG — chỉnh sửa tại đây
// ============================================================

const WEDDING_CONFIG = {
  // --- Thông tin cặp đôi ---
  bride: "Lê Thị Diệu Hiền",
  groom: "Đào Lê Duy Hùng",

  // --- Ngày cưới ---
  weddingDate: "2026-10-11",          // YYYY-MM-DD
  weddingTime: "10 Giờ 00",
  weddingDayLabel: "Chủ nhật",         // hiển thị trên thiệp

  // --- Địa điểm ---
  venue: "Trung Tâm Tiệc Cưới Hoa Viên",
  venueAddress: "123 Đường Lạc Long Quân, Quận 11, TP.HCM",
  venueMapUrl: "",                     // để trống hoặc điền link Google Maps

  // --- Lễ ăn hỏi (để trống nếu không có) ---
  engagementDate: "2026-10-09",
  engagementTime: "08:00 SA",
  engagementVenue: "Tư Gia Nhà Gái",
  engagementAddress: "456 Đường Hoa Phượng, Quận Bình Thạnh, TP.HCM",

  // --- Lời mời ---
  invitationTitle: "Trân Trọng Kính Mời",
  invitationMessage:
    "Chúng tôi trân trọng kính mời Quý Vị đến dự buổi tiệc vui mừng ngày trọng đại của chúng tôi. Sự hiện diện của Quý Vị là niềm vinh hạnh và hạnh phúc lớn lao đối với gia đình chúng tôi.",

  // --- Quote / lời thơ ---
  quote: "\"Tình yêu không phải là ngắm nhìn nhau, mà là cùng nhìn về một hướng.\"",
  quoteAuthor: "— Antoine de Saint-Exupéry",

  // --- Họ nhà trai ---
  groomFamily: {
    father: "Ông Trần Văn Nam",
    mother: "Bà Lê Thị Hoa",
  },

  // --- Họ nhà gái ---
  brideFamily: {
    father: "Ông Nguyễn Văn Đức",
    mother: "Bà Phạm Thị Mai",
  },

  // --- Ngày âm lịch (tuỳ chọn, hiện dưới ngày dương) ---
  lunarDate: "(Tức ngày 2 tháng 9 năm Bính Ngọ)",

  // --- Màu sắc & theme ---
  theme: {
    primary:   "#47613e",   // sage green (từ mẫu chungdoi)
    primaryDk: "#35452f",   // sage green đậm
    accent:    "#7a9c68",   // xanh lá nhạt
    bg:        "#f5f2ec",   // kem
    bgCard:    "rgba(255,255,255,0.82)",
    text:      "#35452f",
    textLight: "#6b7f61",
    textMuted: "#8fa385",
  },

  // --- Hiệu ứng ---
  effects: {
    floatingDust:  true,
    fallingLeaves: true,
    particleCount: 35,
  },

  // --- Ảnh (do build.sh tự động điền — KHÔNG chỉnh tay) ---
  // Đặt ảnh vào đúng thư mục:
  //   src/images/hero-bg.jpg       → nền section hero (phía trên thiệp)
  //   src/images/cover-bg.jpg      → ảnh background phủ toàn màn hình
  //   src/images/album/*.jpg|png   → ảnh album (bao nhiêu tấm cũng được)
  // Khi không có ảnh → hiển thị nền mặc định (CSS gradient + SVG)
  images: {
    introBg:         null,   // ảnh nền màn intro (bì thư)
    coverFullscreen: null,   // ảnh phủ toàn màn hình phía sau tất cả
    coverBox:        null,   // ảnh nền của box thiệp (.page)
    heroBg:          null,   // ảnh nền riêng section hero
    illustration:    null,   // ảnh minh hoạ giữa hero
    petals:          [],     // ảnh PNG lá/cánh hoa rơi (fallback emoji nếu trống)
    album:           [],     // mảng ảnh album cưới
  },

  // --- Nhạc (do build.py tự động điền — KHÔNG chỉnh tay) ---
  // Đặt file nhạc vào: src/music/*.mp3 (hoặc .ogg/.wav/.m4a)
  // Playlist sẽ phát tuần tự, lặp lại khi hết danh sách
  music: [],
};
