import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/payment/cancel")({ component: PaymentCancel });

function PaymentCancel() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-secondary/45 px-4">
      <section className="w-full max-w-lg rounded-2xl border bg-card p-8 text-center shadow-xl">
        <h1 className="font-display text-2xl font-extrabold">Bạn đã hủy thanh toán</h1>
        <p className="mt-3 text-muted-foreground">Giỏ hàng không bị tính tiền.</p>
        <Button className="mt-6" asChild>
          <Link to="/">Về cửa hàng</Link>
        </Button>
      </section>
    </main>
  );
}
