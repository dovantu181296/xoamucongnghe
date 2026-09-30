import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, Loader2, Minus, Plus, ShoppingCart, Trash2, Wand2, X } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { recommendProducts, type Recommendation } from "@/lib/advisor.functions";
import { allProducts, formatVnd, priceValue, type Product } from "@/lib/catalog";

export type CartLine = { title: string; qty: number };

const findProduct = (title: string) => allProducts.find((p) => p.title === title);

const checkoutSchema = z.object({
  name: z.string().trim().min(2, "Vui lòng nhập họ tên").max(100),
  email: z.string().trim().email("Email không hợp lệ").max(255),
  phone: z.string().trim().regex(/^[0-9+ ]{9,15}$/, "Số điện thoại không hợp lệ"),
});

const field = "w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring";

export function CartDrawer({ open, onClose, lines, setLines }: { open: boolean; onClose: () => void; lines: CartLine[]; setLines: (l: CartLine[]) => void }) {
  const [step, setStep] = useState<"cart" | "checkout" | "done">("cart");
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [orderId, setOrderId] = useState("");
  const total = lines.reduce((sum, l) => sum + priceValue(findProduct(l.title) as Product) * l.qty, 0);

  if (!open) return null;
  const update = (title: string, qty: number) => setLines(qty <= 0 ? lines.filter((l) => l.title !== title) : lines.map((l) => (l.title === title ? { ...l, qty } : l)));
  const close = () => { if (step === "done") setStep("cart"); onClose(); };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = checkoutSchema.safeParse(form);
    if (!r.success) { setErrors(Object.fromEntries(r.error.issues.map((i) => [i.path[0], i.message]))); return; }
    setErrors({});
    setOrderId(`KHO${Date.now().toString().slice(-6)}`);
    setLines([]);
    setStep("done");
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-foreground/40" onClick={close}>
      <aside className="flex h-full w-full max-w-md flex-col bg-card shadow-xl" onClick={(e) => e.stopPropagation()} aria-label="Giỏ hàng">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-display text-lg font-extrabold">{step === "checkout" ? "Thanh toán" : step === "done" ? "Đặt hàng thành công" : "Giỏ hàng"}</h2>
          <Button variant="ghost" size="icon" onClick={close} aria-label="Đóng"><X className="size-5" /></Button>
        </div>

        {step === "done" ? (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <CheckCircle2 className="size-14 text-success" />
            <p className="mt-4 text-lg font-bold">Mã đơn: {orderId}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Cảm ơn {form.name}! Hướng dẫn nhận sản phẩm số sẽ được gửi tới {form.email}.</p>
            <Button className="mt-6" onClick={close}>Tiếp tục mua sắm</Button>
          </div>
        ) : lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center text-muted-foreground"><ShoppingCart className="size-12" /><p className="mt-3">Giỏ hàng đang trống.</p></div>
        ) : (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto p-5">
              {step === "cart" ? lines.map((l) => {
                const p = findProduct(l.title);
                if (!p) return null;
                return (
                  <div key={l.title} className="flex gap-3 rounded-lg border border-border p-3">
                    <img src={p.image} alt={p.title} className="size-16 rounded-md object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold leading-snug">{p.title}</p>
                      <p className="text-sm text-action">{p.free ? "Miễn phí" : formatVnd(priceValue(p))}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <Button variant="outline" size="icon" className="size-7" onClick={() => update(l.title, l.qty - 1)} aria-label="Giảm"><Minus className="size-3" /></Button>
                        <span className="w-6 text-center text-sm">{l.qty}</span>
                        <Button variant="outline" size="icon" className="size-7" onClick={() => update(l.title, l.qty + 1)} aria-label="Tăng"><Plus className="size-3" /></Button>
                        <Button variant="ghost" size="icon" className="ml-auto size-7" onClick={() => update(l.title, 0)} aria-label="Xóa"><Trash2 className="size-4" /></Button>
                      </div>
                    </div>
                  </div>
                );
              }) : (
                <form id="checkout" onSubmit={submit} className="space-y-4">
                  {total > 0 && (
                    <div className="rounded-xl border-2 border-primary bg-secondary/45 p-4 text-center">
                      <h3 className="font-display text-lg font-extrabold">Quét QR để thanh toán</h3>
                      <p className="mt-1 text-sm text-muted-foreground">MB Bank · Chủ tài khoản Đỗ Văn Tú</p>
                      <p className="mt-1 text-sm font-bold">Số tài khoản: 5410145678999</p>
                      <img src="/qr-thanh-toan-mb-do-van-tu.jpg" alt="Mã QR thanh toán MB Bank của Đỗ Văn Tú" width={1080} height={1175} className="mx-auto mt-4 h-auto w-full max-w-xs rounded-lg border border-border bg-white" />
                      <p className="mt-3 text-sm">Số tiền cần chuyển: <strong className="text-action">{formatVnd(total)}</strong></p>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">Sau khi chuyển khoản, vui lòng điền thông tin bên dưới và bấm “Xác nhận đặt hàng”.</p>
                    </div>
                  )}
                  {([["name", "Họ và tên", "text"], ["email", "Email nhận sản phẩm", "email"], ["phone", "Số điện thoại", "tel"]] as const).map(([k, label, type]) => (
                    <label key={k} className="block text-sm font-semibold">{label}
                      <input type={type} className={`${field} mt-1.5`} value={form[k]} maxLength={255} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
                      {errors[k] && <span className="mt-1 block text-xs text-destructive">{errors[k]}</span>}
                    </label>
                  ))}
                  {total === 0 && <p className="rounded-md bg-secondary p-3 text-xs leading-5 text-muted-foreground">Sản phẩm này miễn phí. Hãy điền thông tin để nhận sản phẩm.</p>}
                </form>
              )}
            </div>
            <div className="border-t border-border p-5">
              <div className="mb-4 flex justify-between text-lg"><span>Tổng cộng</span><strong className="text-action">{formatVnd(total)}</strong></div>
              {step === "cart"
                ? <Button className="w-full" variant="coral" onClick={() => setStep("checkout")}>Tiến hành thanh toán</Button>
                : <div className="flex gap-2"><Button variant="outline" onClick={() => setStep("cart")}>Quay lại</Button><Button className="flex-1" variant="coral" type="submit" form="checkout">Xác nhận đặt hàng</Button></div>}
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

export function AiAdvisor({ onAdd }: { onAdd: (title: string) => void }) {
  const recommend = useServerFn(recommendProducts);
  const [form, setForm] = useState({ need: "", budget: "", purpose: "" });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ summary: string; items: Recommendation[]; error?: string } | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.need.trim().length < 3) { setResult({ summary: "", items: [], error: "Hãy mô tả nhu cầu của bạn." }); return; }
    setLoading(true);
    try { setResult(await recommend({ data: form })); }
    catch { setResult({ summary: "", items: [], error: "Không thể tạo gợi ý lúc này." }); }
    finally { setLoading(false); }
  };

  return (
    <section id="tu-van-ai" className="scroll-mt-24 mx-auto max-w-7xl px-5 py-12 lg:px-8">
      <div className="grid gap-8 rounded-xl border-2 border-primary bg-card p-6 md:p-10 lg:grid-cols-2">
        <div>
          <span className="text-xs font-bold uppercase text-primary">Tư vấn bằng AI</span>
          <h2 className="mt-2 font-display text-2xl font-extrabold md:text-4xl">Chưa biết chọn gì? Để AI gợi ý</h2>
          <p className="mt-3 text-muted-foreground">Mô tả nhu cầu, ngân sách và mục đích — trợ lý sẽ chọn sản phẩm phù hợp nhất trong kho.</p>
          <form onSubmit={submit} className="mt-6 space-y-3">
            <textarea className={`${field} min-h-24`} maxLength={800} placeholder="VD: Tôi bán mỹ phẩm online, muốn làm video TikTok nhanh hơn" value={form.need} onChange={(e) => setForm({ ...form, need: e.target.value })} />
            <div className="grid gap-3 sm:grid-cols-2">
              <input className={field} maxLength={100} placeholder="Ngân sách (VD: 500.000đ)" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} />
              <input className={field} maxLength={300} placeholder="Mục đích (VD: tăng đơn hàng)" value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} />
            </div>
            <Button type="submit" disabled={loading}>{loading ? <Loader2 className="size-4 animate-spin" /> : <Wand2 className="size-4" />}{loading ? "Đang phân tích..." : "Nhận gợi ý"}</Button>
          </form>
        </div>
        <div className="rounded-lg bg-secondary/60 p-5">
          {!result && !loading && <p className="text-sm text-muted-foreground">Gợi ý sẽ hiển thị ở đây.</p>}
          {loading && <p className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin" />Trợ lý đang chọn sản phẩm cho bạn...</p>}
          {result?.error && <p className="text-sm text-destructive">{result.error}</p>}
          {result && !result.error && (
            <div className="space-y-3">
              <p className="leading-7">{result.summary}</p>
              {result.items.map((item) => {
                const p = findProduct(item.title);
                if (!p) return null;
                return (
                  <div key={item.title} className="flex gap-3 rounded-lg border border-border bg-card p-3">
                    <img src={p.image} alt={p.title} className="size-16 rounded-md object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-primary">{p.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{item.reason}</p>
                      <div className="mt-2 flex items-center justify-between"><strong className="text-action">{p.free ? "Miễn phí" : formatVnd(priceValue(p))}</strong><Button size="sm" variant="coral" onClick={() => onAdd(p.title)}><Plus className="size-4" />Thêm vào giỏ</Button></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
