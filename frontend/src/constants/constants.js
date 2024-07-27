export const PRODUCT_CATEGORIES = ["Bunga", "Daun", "Pohon", "Buah", "Akar"];
export const PRICE_FILTER_MIN = [
  { label: "Kurang dari Rp.10.000,-", value: 10000 },
  { label: "Kurang dari Rp.20.000,-", value: 20000 },
  { label: "Kurang dari Rp.50.000,-", value: 50000 },
  { label: "Kurang dari Rp.100.000,-", value: 100000 },
];
export const PRICE_FILTER_MAX = [
  { label: "Lebih dari Rp.100.000,-", value: 100001 },
  { label: "Lebih dari Rp.500.000,-", value: 500001 },
  { label: "Lebih dari Rp.1000.000,-", value: 1000001 },
];

export const categoryOfPlants = [
  {
    title: "Hijaukan dengan",
    desc: "Tanaman hias daun",
    imageUrl: "/images/daun.webp",
    url: "/all_products?category=Daun",
  },
  {
    title: "Menawan & cantik",
    desc: "Tanaman hias bunga",
    imageUrl: "/images/bunga.webp",
    url: "/all_products?category=Bunga",
  },
  {
    title: "Terlhat segar",
    desc: "Tanaman hias buah",
    imageUrl: "/images/buah.webp",
    url: "/all_products?category=Buah",
  },
  {
    title: "Semua merambat ",
    desc: "Tanaman hias akar",
    imageUrl: "/images/akar.webp",
    url: "/all_products?category=Akar",
  },
  {
    title: "Asri & Sejuk dengan",
    desc: "Tanaman hias pohon",
    imageUrl: "/images/pohon.webp",
    url: "/all_products?category=Pohon",
  },
];

export const profileSettingMenu = [
  {
    label: "Profile",
    link: "/me/profile",
  },
  {
    label: "Update Profile",
    link: "/me/update_profile",
  },
  {
    label: "Upload Avatar",
    link: "/me/upload_avatar",
  },
  {
    label: "Update Password",
    link: "/me/update_password",
  },
];

export const adminSettingMenu = [
  {
    label: "Dashboard",
    link: "/admin/dashboard",
  },
  {
    label: "Produk Baru",
    link: "/admin/product/new",
  },
  {
    label: "Produk",
    link: "/admin/products",
  },
  {
    label: "Pesanan",
    link: "/admin/orders",
  },

  {
    label: "Pengguna",
    link: "/admin/users",
  },
  {
    label: "Ulasan",
    link: "/admin/reviews",
  },
];

export const navMenuItem = [
  { label: "Beranda", link: "/" },
  { label: "Produk", link: "/all_products" },
  { label: "Tentang Kami", link: "/about_us" },
];

export const categories = ["Bunga", "Daun", "Pohon", "Buah", "Akar"];
