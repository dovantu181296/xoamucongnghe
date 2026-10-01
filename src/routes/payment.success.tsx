import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { verifyVideoAiPayment } from "@/lib/payment.functions";

const searchSchema = z.object({ order_id: z.string().optional() }).passthrough();

export const Route = createFileRoute("/payment/success")({
  validateSearch: searchSchema,
  component: PaymentSuccess,
});

function PaymentSuccess() {
  const { order_id: orderId } = Route.useSearch();
  const [result, setResult] = useState<
    | { loading: true }
    | { loading: false; paid: true; product: string; downloadUrl: string }
    | { loading: false; paid: false; message: string }
  >({ loading: true });

  useEffect(() => {
    if (!orderId) {
      setResult({ loading: false, paid: false, message: "Thiếu mã giao dịch." });
      return;
    }
    verifyVideoAiPayment({ data: { orderId } })
      .then((value) => setResult({ loading: false, ...value }))
      .catch(() =>
        setResult({ loading: false, paid: false, message: "Không thể xác minh thanh toán." }),
      );
  }, [orderId]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-secondary/45 px-4">
      <section className="w-full max-w-lg rounded-2xl border-2 border-primary bg-card p-8 text-center shadow-xl">
        {result.loading ? (
          <>
            <Loader2 className="mx-auto size-12 animate-spin text-primary" />
            <h1 className="mt-5 font-display text-2xl font-extrabold">Đang xác minh thanh toán</h1>
            <p className="mt-2 text-muted-foreground">Vui lòng chờ trong giây lát.</p>
          </>
        ) : result.paid ? (
          <>
            <CheckCircle2 className="mx-auto size-14 text-success" />
            <h1 className="mt-5 font-display text-2xl font-extrabold">Thanh toán thành công</h1>
            <p className="mt-2 text-muted-foreground">Bạn đã mở khóa {result.product}.</p>
            <Button className="mt-6 w-full" asChild>
              <a href={result.downloadUrl} target="_blank" rel="noopener noreferrer">
                Lấy sản phẩm ngay
              </a>
            </Button>
          </>
        ) : (
          <>
            <h1 className="font-display text-2xl font-extrabold">Chưa xác minh được thanh toán</h1>
            <p className="mt-3 text-muted-foreground">{result.message}</p>
          </>
        )}
        <Button className="mt-4" variant="outline" asChild>
          <Link to="/">Về cửa hàng</Link>
        </Button>
      </section>
    </main>
  );
}
