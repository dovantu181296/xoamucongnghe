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

import { AiAdvisor, CartDrawer, type CartLine } from "@/components/ShopExtras";
import { Button } from "@/components/ui/button";
import { categories, type Category, type Product } from "@/lib/catalog";
import { ShoppingCart } from "lucide-react";
import { createContext, useContext, useEffect } from "react";

const AddCtx = createContext<(title: string) => void>(() => {});

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
  const [lines, setLines] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  useEffect(() => { try { setLines(JSON.parse(localStorage.getItem("kho-cart") || "[]")); } catch { /* ignore */ } }, []);
  const saveLines = (l: CartLine[]) => { setLines(l); localStorage.setItem("kho-cart", JSON.stringify(l)); };
  const add = (title: string) => { const ex = lines.find((l) => l.title === title); saveLines(ex ? lines.map((l) => (l.title === title ? { ...l, qty: l.qty + 1 } : l)) : [...lines, { title, qty: 1 }]); setCartOpen(true); };
  const count = lines.reduce((n, l) => n + l.qty, 0);
  const filtered = useMemo(() => {
    const term = query.trim().toLocaleLowerCase("vi");
    if (!term) return categories;
    return categories
      .map((category) => ({ ...category, products: category.products.filter((product) => `${product.title} ${product.description}`.toLocaleLowerCase("vi").includes(term)) }))
      .filter((category) => category.products.length > 0);
  }, [query]);

  return (
    <AddCtx.Provider value={add}><main className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <header className="border-b border-border/70 bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
          <a href="#top" className="flex items-center gap-3" aria-label="KHO AI Studio">
            <span className="grid size-10 place-items-center rounded-md bg-primary text-primary-foreground"><Bot className="size-5" /></span>
            <span><strong className="block font-display text-lg">KHO AI STUDIO</strong><span className="hidden text-xs text-muted-foreground sm:block">Bán hàng thông minh cùng AI</span></span>
          </a>
          <div className="flex gap-2"><Button asChild size="sm" variant="outline"><a href="#tu-van-ai">Tư vấn AI</a></Button><Button size="sm" onClick={() => setCartOpen(true)} aria-label="Giỏ hàng"><ShoppingCart className="size-4" />{count}</Button></div>
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

      <AiAdvisor onAdd={add} />

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
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} lines={lines} setLines={saveLines} />
    </main></AddCtx.Provider>
  );
}

function ProductSection({ category }: { category: Category }) {
  return <section id={category.id} className="scroll-mt-24 py-8"><div className="mx-auto max-w-7xl px-5 lg:px-8"><div className="mb-6 flex items-end justify-between gap-4"><div><h2 className="font-display text-xl font-extrabold text-primary md:text-2xl">{category.numeral} • {category.label}</h2><div className="mt-3 h-1 w-14 rounded-full bg-primary" /></div><a href={`#${category.id}`} className="hidden items-center gap-1 text-sm font-bold text-primary sm:flex">Xem tất cả ({category.products.length}) <ArrowRight className="size-4" /></a></div><div className={`grid gap-5 ${category.products.length === 2 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-4"}`}>{category.products.map((product) => <ProductCard key={product.title} product={product} />)}</div></div></section>;
}

function ProductCard({ product }: { product: Product }) {
  const add = useContext(AddCtx);
  return <article className="group flex min-w-0 flex-col overflow-hidden rounded-lg border-2 border-primary bg-card transition-transform hover:-translate-y-1"><div className="relative aspect-[4/5] overflow-hidden bg-muted"><img src={product.image} alt={product.title} loading="lazy" width={800} height={1000} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />{product.badge && <span className="absolute right-3 top-3 rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground">{product.badge}</span>} {product.title.toLocaleLowerCase("vi").includes("video") && <span className="absolute left-1/2 top-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-primary/90 text-primary-foreground"><Play className="ml-1 size-6 fill-current" /></span>}</div><div className="flex flex-1 flex-col p-5"><h3 className="text-lg font-extrabold leading-snug text-primary">{product.title}</h3><p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">{product.description}</p><div className="mt-5 flex min-h-12 items-end justify-between gap-3">{product.free ? <strong className="text-success">Miễn phí</strong> : <div>{product.oldPrice && <span className="block text-xs text-muted-foreground line-through">{product.oldPrice}</span>}<strong className="text-xl text-action">{product.price}</strong></div>}<Button variant={product.free ? "default" : "coral"} size="sm" onClick={() => add(product.title)}>{product.free ? "Nhận quà" : "Thêm vào giỏ"}</Button></div></div></article>;
}

function FooterGroup({ title, links }: { title: string; links: string[][] }) {
  return <div><h3 className="font-bold">{title}</h3><ul className="mt-4 space-y-3 text-sm text-muted-foreground">{links.map(([label, href]) => <li key={label}><a className="hover:text-primary" href={href}>{label}</a></li>)}</ul></div>;
}