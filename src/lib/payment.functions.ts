import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const SITE_URL = "https://xoamucongnghe.lovable.app";
const VIDEO_AI_PRICE = 449_000;
const VIDEO_AI_LINK =
  "https://docs.google.com/spreadsheets/d/182Syal0twy38lngo9JNzdNOIuF7OfkGGv5xgpXpei9E/edit?gid=332211572#gid=332211572";

const customerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+ ]{9,15}$/),
  qty: z.number().int().min(1).max(10),
});

const verifySchema = z.object({ orderId: z.string().trim().min(5).max(100) });

type CheckoutFields = Record<string, string>;

const requiredEnv = (name: "SEPAY_MERCHANT_ID" | "SEPAY_SECRET_KEY") => {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Thiếu cấu hình ${name}`);
  return value;
};

async function signFields(fields: CheckoutFields, secret: string) {
  const order = [
    "order_amount",
    "merchant",
    "currency",
    "operation",
    "order_description",
    "order_invoice_number",
    "customer_id",
    "payment_method",
    "success_url",
    "error_url",
    "cancel_url",
  ];
  const signed = order
    .filter((key) => fields[key] !== undefined)
    .map((key) => `${key}=${fields[key]}`)
    .join(",");
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(signed));
  return btoa(String.fromCharCode(...new Uint8Array(signature)));
}

export const createVideoAiCheckout = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => customerSchema.parse(data))
  .handler(async ({ data }) => {
    const merchant = requiredEnv("SEPAY_MERCHANT_ID");
    const secret = requiredEnv("SEPAY_SECRET_KEY");
    const amount = VIDEO_AI_PRICE * data.qty;
    const invoice = `TMVAI-${amount}-${Date.now()}`;
    const fields: CheckoutFields = {
      order_amount: String(amount),
      merchant,
      currency: "VND",
      operation: "PURCHASE",
      order_description: `Video AI da nganh x${data.qty}`,
      order_invoice_number: invoice,
      customer_id: data.phone.replace(/\D/g, ""),
      payment_method: "BANK_TRANSFER",
      success_url: `${SITE_URL}/payment/success`,
      error_url: `${SITE_URL}/payment/error`,
      cancel_url: `${SITE_URL}/payment/cancel`,
    };
    return {
      action: "https://pay.sepay.vn/v1/checkout/init",
      fields: { ...fields, signature: await signFields(fields, secret) },
    };
  });

export const verifyVideoAiPayment = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => verifySchema.parse(data))
  .handler(async ({ data }) => {
    const merchant = requiredEnv("SEPAY_MERCHANT_ID");
    const secret = requiredEnv("SEPAY_SECRET_KEY");
    const auth = btoa(`${merchant}:${secret}`);
    const response = await fetch(
      `https://pgapi.sepay.vn/v1/order/detail/${encodeURIComponent(data.orderId)}`,
      { headers: { Authorization: `Basic ${auth}` } },
    );
    if (!response.ok) return { paid: false as const, message: "Chưa xác minh được giao dịch." };

    const payload = (await response.json()) as {
      data?: {
        order_status?: string;
        order_amount?: string;
        order_invoice_number?: string;
      };
    };
    const order = payload.data;
    const invoice = order?.order_invoice_number ?? "";
    const match = /^TMVAI-(\d+)-\d+$/.exec(invoice);
    const expectedAmount = match ? Number(match[1]) : 0;
    const actualAmount = Number(order?.order_amount ?? 0);
    const valid =
      order?.order_status === "CAPTURED" &&
      expectedAmount >= VIDEO_AI_PRICE &&
      actualAmount === expectedAmount;

    return valid
      ? { paid: true as const, product: "Video AI đa ngành", downloadUrl: VIDEO_AI_LINK }
      : { paid: false as const, message: "Thanh toán chưa hoàn tất hoặc số tiền chưa đúng." };
  });
