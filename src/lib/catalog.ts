import { BookOpen, Gift, Globe2, GraduationCap, Video } from "lucide-react";

import coverPhoto from "@/assets/cover-ai-photo.jpg";
import coverStoryboard from "@/assets/cover-storyboard.jpg";
import coverVideo from "@/assets/cover-video-studio.jpg";
import coverWebsite from "@/assets/cover-website.jpg";

export type Product = {
  title: string;
  description: string;
  image: string;
  badge?: string;
  price?: string;
  oldPrice?: string;
  free?: boolean;
};

export type Category = {
  id: string;
  numeral: string;
  label: string;
  icon: typeof Gift;
  products: Product[];
};

export const categories: Category[] = [
  {
    id: "qua-tang",
    numeral: "I",
    label: "Quà tặng",
    icon: Gift,
    products: [
      { title: "Bộ prompt ảnh sản phẩm", description: "30 công thức tạo ảnh bán hàng rõ nét, đồng bộ và dễ áp dụng.", image: coverPhoto, badge: "Quà tặng", free: true },
      { title: "Mẫu storyboard 9:16", description: "Tự chia cảnh, giữ nhân vật nhất quán và sẵn sàng dựng video ngắn.", image: coverStoryboard, badge: "Tặng kèm hướng dẫn", free: true },
      { title: "Checklist video chốt đơn", description: "Kiểm tra hook, nhịp dựng, lời thoại và CTA trước khi đăng video.", image: coverVideo, badge: "Tải miễn phí", free: true },
      { title: "Bộ khung landing page", description: "Cấu trúc nội dung một trang giúp người bán trình bày ưu đãi mạch lạc.", image: coverWebsite, badge: "Quà tặng", free: true },
    ],
  },
  {
    id: "cong-cu-video",
    numeral: "II",
    label: "Công cụ tạo video",
    icon: Video,
    products: [
      { title: "Video AI đa ngành", description: "Từ một ảnh sản phẩm, tạo kịch bản và video dọc phù hợp nhiều ngành hàng.", image: coverVideo, badge: "Tặng 8 bộ mẫu", oldPrice: "699.000đ", price: "449.000đ" },
      { title: "Storyboard thành video", description: "Biến bộ ảnh phân cảnh thành video kể chuyện liền mạch chỉ trong vài bước.", image: coverStoryboard, badge: "Bán chạy", oldPrice: "499.000đ", price: "249.000đ" },
      { title: "Studio ảnh chuyển động", description: "Tạo chuyển động máy quay và hiệu ứng trình diễn cho ảnh sản phẩm.", image: coverPhoto, badge: "Mới", oldPrice: "399.000đ", price: "199.000đ" },
      { title: "Video người dẫn AI", description: "Tạo video giới thiệu có người dẫn, phụ đề và nhạc nền đồng bộ.", image: coverVideo, badge: "Tặng 20 giọng đọc", oldPrice: "599.000đ", price: "299.000đ" },
    ],
  },
  {
    id: "ky-nang",
    numeral: "III",
    label: "Kỹ năng bán hàng",
    icon: BookOpen,
    products: [
      { title: "Viết kịch bản video bán hàng", description: "Xây hook, nỗi đau, lợi ích và lời kêu gọi hành động theo từng ngành.", image: coverVideo, badge: "Mua 1 tặng 1", price: "149.000đ" },
      { title: "Ảnh thương mại bằng AI", description: "Tạo bộ ảnh sản phẩm chuyên nghiệp mà không cần studio lớn.", image: coverPhoto, badge: "Mua 1 tặng 1", price: "149.000đ" },
      { title: "Làm chủ storyboard", description: "Thiết kế mạch kể chuyện rõ ràng, đồng nhất bối cảnh và nhân vật.", image: coverStoryboard, badge: "Thực hành", price: "99.000đ" },
      { title: "Giọng nói và âm thanh AI", description: "Tạo giọng đọc tự nhiên, chọn nhạc và cân bằng âm thanh cho video.", image: coverVideo, badge: "Thực hành", price: "99.000đ" },
    ],
  },
  {
    id: "website",
    numeral: "IV",
    label: "Website bán hàng",
    icon: Globe2,
    products: [
      { title: "Landing page chốt đơn", description: "Trang bán hàng tập trung vào một ưu đãi và dẫn khách tới hành động chính.", image: coverWebsite, badge: "Bàn giao trọn gói", oldPrice: "1.290.000đ", price: "690.000đ" },
      { title: "Website cửa hàng số", description: "Danh mục sản phẩm, tìm kiếm, trang chi tiết và giao diện chuẩn di động.", image: coverWebsite, badge: "Tối ưu di động", oldPrice: "3.900.000đ", price: "1.990.000đ" },
    ],
  },
  {
    id: "dong-hanh",
    numeral: "V",
    label: "Khóa đồng hành",
    icon: GraduationCap,
    products: [
      { title: "14 ngày xây kênh video AI", description: "Lộ trình từng ngày từ chọn chủ đề, sản xuất nội dung đến đăng và tối ưu.", image: coverVideo, badge: "Có người hướng dẫn", price: "599.000đ" },
      { title: "Tự xây website bán hàng", description: "Học theo dự án thật để hoàn thiện trang bán hàng phù hợp ngành của bạn.", image: coverWebsite, badge: "Tặng bộ tài nguyên", price: "799.000đ" },
      { title: "Xây hệ thống nội dung AI", description: "Thiết lập quy trình ảnh, kịch bản và video để sản xuất đều đặn mỗi tuần.", image: coverStoryboard, badge: "Nhóm nhỏ", price: "999.000đ" },
    ],
  },
];

export const allProducts = categories.flatMap((c) => c.products.map((p) => ({ ...p, category: c.label })));
export const priceValue = (p: Product) => (p.free || !p.price ? 0 : Number(p.price.replace(/\D/g, "")));
export const formatVnd = (n: number) => `${n.toLocaleString("vi-VN")}đ`;
