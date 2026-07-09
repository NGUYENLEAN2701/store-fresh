export type Category = "keyboard" | "gear" | "decor";

export interface CategoryInfo {
  id: Category;
  name: string;
  description: string;
  icon: string;
}

export const categories: CategoryInfo[] = [
  {
    id: "keyboard",
    name: "Bàn phím cơ",
    description: "Gõ đã tay, switch đa dạng, hotswap dễ dàng",
    icon: "⌨️",
  },
  {
    id: "gear",
    name: "Gaming Gear",
    description: "Chuột, tai nghe, phụ kiện tối ưu hiệu năng thi đấu",
    icon: "🎮",
  },
  {
    id: "decor",
    name: "Mô hình trang trí",
    description: "Mô hình sưu tầm, trang trí góc làm việc thêm chất",
    icon: "🗿",
  },
];

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: Category;
  price: number;
  oldPrice?: number;
  icon: string;
  gallery: string[];
  rating: number;
  reviews: number;
  badge?: "Mới" | "Hot" | "Giảm giá" | "Bán chạy";
  featured?: boolean;
  shortDescription: string;
  description: string;
  specs: Record<string, string>;
}

export const products: Product[] = [
  {
    id: "kb-01",
    slug: "akko-zenith-75",
    name: "AKKO Zenith 75",
    category: "keyboard",
    price: 2190000,
    oldPrice: 2490000,
    icon: "⌨️",
    gallery: ["⌨️", "🟢", "🔌"],
    rating: 4.8,
    reviews: 132,
    badge: "Bán chạy",
    featured: true,
    shortDescription: 'Bàn phím cơ hotswap gasket, âm thanh "thock" đặc trưng',
    description:
      "AKKO Zenith 75 sở hữu thiết kế gasket mount hiện đại, mang lại cảm giác gõ êm tay và âm thanh đầm ấm. Hỗ trợ hotswap 3/5 chân, kết nối 3 chế độ Bluetooth/2.4GHz/Type-C, phù hợp cho cả làm việc lẫn chơi game.",
    specs: {
      "Layout": "75% (81 phím)",
      "Kết nối": "Bluetooth 5.0 / 2.4GHz / Type-C",
      "Switch": "Hotswap 3/5 chân",
      "Keycap": "PBT Dye-sub",
      "Pin": "Lên đến 300 giờ",
      "Trọng lượng": "980g",
    },
  },
  {
    id: "kb-02",
    slug: "keychron-v3",
    name: "Keychron V3",
    category: "keyboard",
    price: 1790000,
    icon: "⌨️",
    gallery: ["⌨️", "🟩", "🔧"],
    rating: 4.7,
    reviews: 98,
    badge: "Mới",
    featured: true,
    shortDescription: "Bàn phím cơ lập trình QMK/VIA, custom mọi phím bấm",
    description:
      "Keychron V3 hỗ trợ QMK/VIA cho phép tùy biến layer và macro không giới hạn. Khung nhôm chắc chắn, gasket mount giảm rung, đi kèm núm xoay điều chỉnh âm lượng tiện lợi.",
    specs: {
      "Layout": "80% TKL",
      "Kết nối": "Type-C có dây",
      "Switch": "Hotswap Keychron K Pro",
      "Keycap": "Double-shot PBT",
      "Phần mềm": "QMK/VIA",
      "Trọng lượng": "1050g",
    },
  },
  {
    id: "kb-03",
    slug: "royal-kludge-rk84",
    name: "Royal Kludge RK84",
    category: "keyboard",
    price: 1350000,
    oldPrice: 1590000,
    icon: "⌨️",
    gallery: ["⌨️", "🔋", "🟢"],
    rating: 4.5,
    reviews: 210,
    badge: "Giảm giá",
    featured: true,
    shortDescription: "Bàn phím cơ không dây 3 chế độ, giá tốt cho người mới",
    description:
      "RK84 là lựa chọn quen thuộc cho người mới bước vào thế giới bàn phím cơ, với mức giá hợp lý, kết nối linh hoạt và độ bền cao, phù hợp sử dụng hàng ngày.",
    specs: {
      "Layout": "75% (84 phím)",
      "Kết nối": "Bluetooth / 2.4GHz / Type-C",
      "Switch": "RK Brown/Red (hotswap)",
      "Keycap": "ABS Doubleshot",
      "Pin": "4000mAh",
      "Trọng lượng": "900g",
    },
  },
  {
    id: "kb-04",
    slug: "fuhlen-g87",
    name: "Fuhlen G87",
    category: "keyboard",
    price: 890000,
    icon: "⌨️",
    gallery: ["⌨️", "💡"],
    rating: 4.3,
    reviews: 76,
    shortDescription: "Bàn phím cơ RGB phổ thông, độ bền cao",
    description:
      "Fuhlen G87 mang đến trải nghiệm gõ cơ học ổn định với chi phí tiết kiệm, đèn RGB 16.8 triệu màu và khung nhựa cứng cáp, thích hợp cho học sinh, sinh viên.",
    specs: {
      "Layout": "TKL (87 phím)",
      "Kết nối": "Type-C có dây",
      "Switch": "Blue/Red/Brown",
      "Đèn nền": "RGB 16.8 triệu màu",
      "Trọng lượng": "820g",
    },
  },
  {
    id: "kb-05",
    slug: "leobog-hi75",
    name: "Leobog Hi75",
    category: "keyboard",
    price: 1990000,
    icon: "⌨️",
    gallery: ["⌨️", "🟢", "🔊"],
    rating: 4.9,
    reviews: 54,
    badge: "Hot",
    shortDescription: 'Bàn phím cơ gasket cao cấp, âm thanh "creamy" mượt mà',
    description:
      "Leobog Hi75 được giới enthusiast đánh giá cao nhờ kết cấu gasket 5 lớp tiêu âm, mang lại âm thanh sâu, mượt cùng cảm giác gõ mềm mại hiếm có trong tầm giá.",
    specs: {
      "Layout": "75% (81 phím)",
      "Kết nối": "Bluetooth / 2.4GHz / Type-C",
      "Switch": "Hotswap 5 chân",
      "Kết cấu": "Gasket mount 5 lớp foam",
      "Keycap": "PBT Cherry Profile",
      "Trọng lượng": "1020g",
    },
  },
  {
    id: "gr-01",
    slug: "logitech-g-pro-x-superlight",
    name: "Logitech G Pro X Superlight",
    category: "gear",
    price: 2450000,
    icon: "🖱️",
    gallery: ["🖱️", "🟢", "📡"],
    rating: 4.9,
    reviews: 305,
    badge: "Bán chạy",
    featured: true,
    shortDescription: "Chuột gaming không dây siêu nhẹ, chuẩn thi đấu Esports",
    description:
      "Trọng lượng dưới 63g cùng cảm biến HERO 25K độ chính xác tuyệt đối, G Pro X Superlight là lựa chọn hàng đầu của các tuyển thủ chuyên nghiệp trên toàn thế giới.",
    specs: {
      "Cảm biến": "HERO 25K",
      "DPI": "100 - 25,600",
      "Kết nối": "Wireless LIGHTSPEED",
      "Trọng lượng": "63g",
      "Pin": "Lên đến 70 giờ",
    },
  },
  {
    id: "gr-02",
    slug: "razer-deathadder-v3",
    name: "Razer DeathAdder V3",
    category: "gear",
    price: 1290000,
    oldPrice: 1490000,
    icon: "🖱️",
    gallery: ["🖱️", "🟩"],
    rating: 4.7,
    reviews: 189,
    badge: "Giảm giá",
    featured: true,
    shortDescription: "Chuột gaming công thái học huyền thoại",
    description:
      "Thiết kế công thái học được hoàn thiện qua nhiều thế hệ, DeathAdder V3 mang lại sự thoải mái tối đa cho phiên chơi game kéo dài, cùng switch quang học bền bỉ.",
    specs: {
      "Cảm biến": "Focus Pro 30K",
      "DPI": "100 - 30,000",
      "Switch": "Optical Gen-3",
      "Trọng lượng": "59g",
      "Kết nối": "Có dây",
    },
  },
  {
    id: "gr-03",
    slug: "steelseries-arctis-nova-7",
    name: "SteelSeries Arctis Nova 7",
    category: "gear",
    price: 3290000,
    icon: "🎧",
    gallery: ["🎧", "🟢", "🎙️"],
    rating: 4.8,
    reviews: 142,
    badge: "Hot",
    featured: true,
    shortDescription: "Tai nghe gaming không dây, âm thanh vòm 360",
    description:
      "Arctis Nova 7 tích hợp công nghệ đa kết nối 2.4GHz/Bluetooth, driver âm thanh vòm sống động cùng micro khử ồn ClearCast, lý tưởng cho cả gaming và giải trí.",
    specs: {
      "Driver": "40mm Neodymium",
      "Kết nối": "2.4GHz + Bluetooth",
      "Pin": "Lên đến 38 giờ",
      "Micro": "ClearCast khử ồn",
      "Trọng lượng": "310g",
    },
  },
  {
    id: "gr-04",
    slug: "hyperx-cloud-ii",
    name: "HyperX Cloud II",
    category: "gear",
    price: 1590000,
    icon: "🎧",
    gallery: ["🎧", "🟩"],
    rating: 4.6,
    reviews: 264,
    shortDescription: "Tai nghe gaming có dây, đệm foam áp suất êm ái",
    description:
      "Một trong những tai nghe gaming bán chạy nhất mọi thời đại, Cloud II mang lại âm bass mạnh mẽ, đệm tai foam áp suất êm ái cho những giờ chơi dài không mỏi.",
    specs: {
      "Driver": "53mm",
      "Kết nối": "3.5mm / USB (7.1 ảo)",
      "Đệm tai": "Foam áp suất bọc da",
      "Trọng lượng": "320g",
    },
  },
  {
    id: "gr-05",
    slug: "razer-goliathus-extended",
    name: "Razer Goliathus Extended Chroma",
    category: "gear",
    price: 990000,
    icon: "🟩",
    gallery: ["🟩", "💡"],
    rating: 4.5,
    reviews: 87,
    shortDescription: "Lót chuột full-size RGB, bề mặt vải cao cấp",
    description:
      "Kích thước extended bao phủ cả bàn phím và chuột, viền RGB Chroma tùy biến, bề mặt vải dệt mịn giúp thao tác chuột chuẩn xác ở mọi tốc độ.",
    specs: {
      "Kích thước": "920 x 294 x 3mm",
      "Bề mặt": "Vải dệt mịn",
      "Đèn nền": "RGB Chroma",
      "Đế": "Cao su chống trượt",
    },
  },
  {
    id: "gr-06",
    slug: "xbox-wireless-controller",
    name: "Tay cầm chơi game không dây",
    category: "gear",
    price: 1450000,
    icon: "🎮",
    gallery: ["🎮", "🟢"],
    rating: 4.6,
    reviews: 121,
    badge: "Mới",
    shortDescription: "Tay cầm không dây đa nền tảng PC/Console",
    description:
      "Thiết kế cầm nắm công thái học, độ trễ thấp khi kết nối không dây, tương thích PC, console và thiết bị di động, pin sử dụng liên tục nhiều giờ.",
    specs: {
      "Kết nối": "Bluetooth / USB-C",
      "Pin": "Lên đến 40 giờ",
      "Tương thích": "PC / Console / Mobile",
      "Rung phản hồi": "Có",
    },
  },
  {
    id: "dc-01",
    slug: "mo-hinh-gundam-rx78",
    name: "Mô hình Gundam RX-78-2",
    category: "decor",
    price: 690000,
    icon: "🤖",
    gallery: ["🤖", "🟢", "🛠️"],
    rating: 4.9,
    reviews: 63,
    badge: "Hot",
    featured: true,
    shortDescription: "Mô hình lắp ráp Gunpla tỷ lệ 1/100, chi tiết sắc nét",
    description:
      "Bộ mô hình Gunpla tỷ lệ 1/100 với khớp chuyển động linh hoạt, chi tiết sơn sẵn sắc nét, kèm phụ kiện vũ khí, là món quà lý tưởng cho người yêu thích Gundam.",
    specs: {
      "Tỷ lệ": "1/100",
      "Chất liệu": "Nhựa ABS/PVC cao cấp",
      "Chiều cao": "~18cm",
      "Khớp động": "Đầy đủ, có thể tạo dáng",
    },
  },
  {
    id: "dc-02",
    slug: "mo-hinh-lego-technic-xe-the-thao",
    name: "Mô hình LEGO Technic Xe thể thao",
    category: "decor",
    price: 1850000,
    icon: "🚗",
    gallery: ["🚗", "🟩", "🔩"],
    rating: 4.8,
    reviews: 41,
    featured: true,
    shortDescription: "Mô hình xe thể thao lắp ráp, chi tiết cơ khí sống động",
    description:
      "Hàng nghìn chi tiết tái hiện chân thực hệ thống cơ khí của một chiếc siêu xe, vô lăng chuyển động, động cơ mô phỏng - trải nghiệm lắp ráp đầy cuốn hút.",
    specs: {
      "Số chi tiết": "~3800 mảnh",
      "Chất liệu": "Nhựa ABS cao cấp",
      "Kích thước": "~62 x 24 x 15cm",
      "Độ tuổi": "12+",
    },
  },
  {
    id: "dc-03",
    slug: "mo-hinh-rong-trung-hoa-resin",
    name: "Mô hình Rồng Trung Hoa Resin",
    category: "decor",
    price: 450000,
    oldPrice: 590000,
    icon: "🐉",
    gallery: ["🐉", "🟢"],
    rating: 4.7,
    reviews: 38,
    badge: "Giảm giá",
    shortDescription: "Tượng rồng phong thủy chất liệu resin sơn tay",
    description:
      "Tượng rồng điêu khắc tinh xảo từ chất liệu resin cao cấp, sơn thủ công từng chi tiết vảy rồng, mang ý nghĩa phong thủy và điểm nhấn trang trí sang trọng.",
    specs: {
      "Chất liệu": "Resin cao cấp",
      "Kích thước": "~25 x 12 x 18cm",
      "Hoàn thiện": "Sơn tay thủ công",
    },
  },
  {
    id: "dc-04",
    slug: "mo-hinh-cay-bonsai-mini",
    name: "Mô hình Cây Bonsai mini",
    category: "decor",
    price: 320000,
    icon: "🎋",
    gallery: ["🎋", "🪴"],
    rating: 4.6,
    reviews: 52,
    badge: "Mới",
    shortDescription:
      "Cây bonsai mini trang trí bàn làm việc, không cần chăm sóc",
    description:
      "Mô hình cây bonsai mini với khung dây đồng uốn dáng nghệ thuật và chậu gốm mini, mang không gian xanh mát đến góc làm việc mà không cần tưới nước hay chăm sóc.",
    specs: {
      "Chất liệu": "Dây đồng + lá nhựa cao cấp",
      "Kích thước": "~15 x 12cm",
      "Chậu": "Gốm sứ mini",
    },
  },
  {
    id: "dc-05",
    slug: "mo-hinh-robot-transformer",
    name: "Mô hình Robot Transformer",
    category: "decor",
    price: 590000,
    icon: "🦾",
    gallery: ["🦾", "🟢"],
    rating: 4.5,
    reviews: 29,
    shortDescription: "Mô hình robot biến hình, khớp nối chắc chắn",
    description:
      "Mô hình robot có thể biến hình qua lại giữa dạng xe và robot, khớp nối chắc chắn, chi tiết sơn hoàn thiện cao, thích hợp trưng bày hoặc sưu tầm.",
    specs: {
      "Chất liệu": "Hợp kim & nhựa ABS",
      "Chiều cao": "~20cm",
      "Tính năng": "Biến hình 2 dạng",
    },
  },
];

export function formatPrice(price: number): string {
  return price.toLocaleString("vi-VN") + "₫";
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, limit);
}

export function getCategoryInfo(id: Category): CategoryInfo {
  return categories.find((c) => c.id === id)!;
}
