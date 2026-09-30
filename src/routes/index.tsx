import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Bot,
  ChevronDown,
  Gift,
  Globe2,
  GraduationCap,
  Grid2X2,
  MessageCircle,
  Play,
  Search,
  Sparkles,
  Video,
} from "lucide-react";
import { useMemo, useState } from "react";

import coverPhoto from "@/assets/cover-ai-photo.jpg";
import coverStoryboard from "@/assets/cover-storyboard.jpg";
import coverVideo from "@/assets/cover-video-studio.jpg";
import coverWebsite from "@/assets/cover-website.jpg";
import { Button } from "@/components/ui/button";

type Product = {
  title: string;
  description: string;
  image: string;
  badge?: string;
  price?: string;
  oldPrice?: string;
  free?: boolean;
};

type Category = {
  id: string;
  numeral: string;
  label: string;
  icon: typeof Gift;
  products: Product[];
};

const categories: Category[] = [
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

const faqs = [
  ["Tôi cần chuẩn bị gì để bắt đầu?", "Bạn chỉ cần ảnh sản phẩm rõ nét và mục tiêu nội dung. Mỗi sản phẩm đều có hướng dẫn từng bước để bắt đầu."],
  ["Tôi nhận sản phẩm bằng cách nào?", "Sau khi đăng ký, tài liệu và đường dẫn sử dụng sẽ được gửi qua kênh liên hệ bạn cung cấp."],
  ["Video có phù hợp TikTok, Reels và Shopee không?", "Có. Các quy trình ưu tiên khung hình dọc 9:16 và nội dung ngắn phù hợp những nền tảng phổ biến."],
  ["Người mới có dùng được không?", "Có. Nội dung được thiết kế theo từng bước, có ví dụ và mẫu thực hành để người mới dễ làm theo."],
  ["Nếu cần hỗ trợ thì liên hệ ở đâu?", "Bạn có thể dùng nút trò chuyện ở góc màn hình để gửi câu hỏi và nhận tư vấn."],
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KHO AI Studio | Công cụ AI cho người bán hàng" },
      { name: "description", content: "Khám phá công cụ, kỹ năng và lộ trình AI giúp bạn tạo ảnh, video và website bán hàng." },
      { property: "og:title", content: "KHO AI Studio | Công cụ AI cho người bán hàng" },
      { property: "og:description", content: "Công cụ, kỹ năng và lộ trình AI dành cho người bán hàng hiện đại." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Storefront,
});

function Storefront() {
  const [query, setQuery] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const filtered = useMemo(() => {
    const term = query.trim().toLocaleLowerCase("vi");
    if (!term) return categories;
    return categories
      .map((category) => ({ ...category, products: category.products.filter((product) => `${product.title} ${product.description}`.toLocaleLowerCase("vi").includes(term)) }))
      .filter((category) => category.products.length > 0);
  }, [query]);

  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <header className="border-b border-border/70 bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
          <a href="#top" className="flex items-center gap-3" aria-label="KHO AI Studio">
            <span className="grid size-10 place-items-center rounded-md bg-primary text-primary-foreground"><Bot className="size-5" /></span>
            <span><strong className="block font-display text-lg">KHO AI STUDIO</strong><span className="hidden text-xs text-muted-foreground sm:block">Bán hàng thông minh cùng AI</span></span>
          </a>
          <Button asChild size="sm"><a href="#lien-he"><MessageCircle className="size-4" />Tư vấn</a></Button>
        </div>
      </header>

      <div id="top" className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-5 py-3 lg:px-8" aria-label="Danh mục sản phẩm">
          <a href="#san-pham" className="flex shrink-0 items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground"><Grid2X2 className="size-4" />Tất cả <span className="rounded-full bg-primary-foreground/20 px-2 py-0.5">16</span></a>
          {categories.map(({ id, label, icon: Icon, products }) => <a key={id} href={`#${id}`} className="flex shrink-0 items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-secondary-foreground hover:bg-accent"><Icon className="size-4" />{label}<span className="text-primary">{products.length}</span></a>)}
        </nav>
      </div>

      <section id="san-pham" className="mx-auto max-w-7xl px-5 pb-10 pt-8 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="flex rounded-full border border-border bg-card p-1.5 shadow-sm focus-within:ring-2 focus-within:ring-ring">
            <Search className="ml-3 mt-2.5 size-5 shrink-0 text-muted-foreground" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none" placeholder="Tìm công cụ, kỹ năng hoặc khóa học..." aria-label="Tìm kiếm sản phẩm" />
            <Button size="sm">Tìm kiếm</Button>
          </div>
        </div>
      </section>

      {filtered.length ? filtered.map((category) => <ProductSection key={category.id} category={category} />) : <div className="mx-auto max-w-7xl px-5 py-24 text-center"><Search className="mx-auto mb-4 size-10 text-muted-foreground" /><h2 className="text-2xl font-bold">Không tìm thấy sản phẩm</h2><p className="mt-2 text-muted-foreground">Hãy thử một từ khóa ngắn hơn.</p></div>}

      <section className="mt-16 border-y border-border bg-secondary/55 py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="text-center"><span className="rounded-full border border-border bg-card px-4 py-2 text-xs font-bold uppercase text-primary">Khách hàng nói gì</span><h2 className="mt-6 font-display text-3xl font-extrabold md:text-5xl">Phản hồi từ người dùng</h2></div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {["Chủ shop thời trang", "Người làm affiliate", "Nhà sáng tạo nội dung"].map((role, index) => <article key={role} className="rounded-lg border border-border bg-card p-7 shadow-sm"><div className="text-action" aria-label="5 sao">★★★★★</div><p className="mt-4 leading-7 text-muted-foreground">“Quy trình rõ ràng, dễ làm theo. Tôi tiết kiệm được nhiều thời gian khi chuẩn bị nội dung bán hàng mỗi tuần.”</p><div className="mt-6 flex items-center gap-3"><span className="grid size-11 place-items-center rounded-full bg-primary font-bold text-primary-foreground">{String.fromCharCode(65 + index)}</span><div><strong className="block">Khách hàng {index + 1}</strong><span className="text-sm text-muted-foreground">{role}</span></div></div></article>)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-20 lg:px-8">
        <div className="text-center"><span className="text-xs font-bold uppercase text-primary">Hỏi đáp</span><h2 className="mt-3 font-display text-3xl font-extrabold md:text-5xl">Câu hỏi thường gặp</h2></div>
        <div className="mt-10 space-y-3">
          {faqs.map(([question, answer], index) => <div key={question} className="overflow-hidden rounded-lg border border-border bg-card shadow-sm"><Button variant="ghost" className="h-auto w-full justify-between whitespace-normal px-6 py-5 text-left text-base" aria-expanded={openFaq === index} onClick={() => setOpenFaq(openFaq === index ? null : index)}>{question}<ChevronDown className={`size-5 shrink-0 text-primary transition-transform ${openFaq === index ? "rotate-180" : ""}`} /></Button>{openFaq === index && <p className="border-t border-border px-6 py-5 leading-7 text-muted-foreground">{answer}</p>}</div>)}
        </div>
      </section>

      <footer id="lien-he" className="border-t border-border bg-secondary/55">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
          <div className="sm:col-span-2 lg:col-span-1"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-md bg-primary text-primary-foreground"><Sparkles className="size-5" /></span><strong>KHO AI STUDIO</strong></div><p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">Bộ công cụ, kỹ năng và lộ trình thực hành AI dành cho người bán hàng và nhà sáng tạo.</p></div>
          <FooterGroup title="Danh mục" links={categories.map((item) => [item.label, `#${item.id}`])} />
          <FooterGroup title="Khám phá" links={[["Tất cả sản phẩm", "#san-pham"], ["Phản hồi", "#lien-he"], ["Hỏi đáp", "#lien-he"]]} />
          <div><h3 className="font-bold">Cần tư vấn?</h3><p className="mt-4 text-sm leading-6 text-muted-foreground">Gửi câu hỏi để được gợi ý sản phẩm phù hợp với mục tiêu của bạn.</p><Button className="mt-5" variant="coral"><MessageCircle className="size-4" />Nhắn tư vấn</Button></div>
        </div>
        <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">© 2026 KHO AI Studio. Nội dung và giá đang dùng để minh họa.</div>
      </footer>

      <Button asChild size="icon" className="fixed bottom-5 right-5 z-40 size-14 rounded-full shadow-lg"><a href="#lien-he" aria-label="Liên hệ tư vấn"><MessageCircle className="size-6" /></a></Button>
    </main>
  );
}

function ProductSection({ category }: { category: Category }) {
  return <section id={category.id} className="scroll-mt-24 py-8"><div className="mx-auto max-w-7xl px-5 lg:px-8"><div className="mb-6 flex items-end justify-between gap-4"><div><h2 className="font-display text-xl font-extrabold text-primary md:text-2xl">{category.numeral} • {category.label}</h2><div className="mt-3 h-1 w-14 rounded-full bg-primary" /></div><a href={`#${category.id}`} className="hidden items-center gap-1 text-sm font-bold text-primary sm:flex">Xem tất cả ({category.products.length}) <ArrowRight className="size-4" /></a></div><div className={`grid gap-5 ${category.products.length === 2 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-4"}`}>{category.products.map((product) => <ProductCard key={product.title} product={product} />)}</div></div></section>;
}

function ProductCard({ product }: { product: Product }) {
  return <article className="group flex min-w-0 flex-col overflow-hidden rounded-lg border-2 border-primary bg-card transition-transform hover:-translate-y-1"><div className="relative aspect-[4/5] overflow-hidden bg-muted"><img src={product.image} alt={product.title} loading="lazy" width={800} height={1000} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />{product.badge && <span className="absolute right-3 top-3 rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground">{product.badge}</span>} {product.title.toLocaleLowerCase("vi").includes("video") && <span className="absolute left-1/2 top-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-primary/90 text-primary-foreground"><Play className="ml-1 size-6 fill-current" /></span>}</div><div className="flex flex-1 flex-col p-5"><h3 className="text-lg font-extrabold leading-snug text-primary">{product.title}</h3><p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">{product.description}</p><div className="mt-5 flex min-h-12 items-end justify-between gap-3">{product.free ? <strong className="text-success">Miễn phí</strong> : <div>{product.oldPrice && <span className="block text-xs text-muted-foreground line-through">{product.oldPrice}</span>}<strong className="text-xl text-action">{product.price}</strong></div>}<Button asChild variant={product.free ? "default" : "coral"} size="sm"><a href="#lien-he">{product.free ? "Nhận quà" : "Chi tiết"}</a></Button></div></div></article>;
}

function FooterGroup({ title, links }: { title: string; links: string[][] }) {
  return <div><h3 className="font-bold">{title}</h3><ul className="mt-4 space-y-3 text-sm text-muted-foreground">{links.map(([label, href]) => <li key={label}><a className="hover:text-primary" href={href}>{label}</a></li>)}</ul></div>;
}