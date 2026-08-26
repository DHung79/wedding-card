// ============================================================
//  WEDDING CARD CONFIG — chỉnh sửa tại đây
// ============================================================

const WEDDING_CONFIG = {
  // --- Thông tin cặp đôi ---
  bride: "Nguyễn Thị Lan",
  groom: "Trần Văn Minh",

  // --- Ngày cưới ---
  weddingDate: "2026-10-10",          // YYYY-MM-DD
  weddingTime: "10:00 SA",
  weddingDayLabel: "Thứ Bảy",         // hiển thị trên thiệp

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

  // --- Màu sắc & theme (Ghibli Totoro/Spirited Away) ---
  theme: {
    primary:   "#4a7c59",   // sage green
    secondary: "#8b6914",   // warm brown/gold
    accent:    "#c9956a",   // terracotta
    bg:        "#fdf6e3",   // warm cream
    bgDark:    "#e8ddc8",   // darker cream
    text:      "#3d2b1f",   // dark brown
    textLight: "#7a5c44",   // medium brown
    petal:     "#d4b896",   // petal/floral tone
  },

  // --- Hiệu ứng ---
  effects: {
    floatingDust: true,     // hạt bụi lấp lánh (kodama dust)
    fallingLeaves: true,    // lá rơi
    particleCount: 40,
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
};
