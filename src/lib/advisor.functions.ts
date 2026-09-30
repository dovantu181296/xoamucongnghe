import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { allProducts, formatVnd, priceValue } from "./catalog";

const inputSchema = z.object({
  need: z.string().trim().min(3).max(800),
  budget: z.string().trim().max(100),
  purpose: z.string().trim().max(300),
});

export type Recommendation = { title: string; reason: string };

export const recommendProducts = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(
    async ({ data }): Promise<{ summary: string; items: Recommendation[]; error?: string }> => {
      const key = process.env["LOVABLE_API_KEY"];
      if (!key) return { summary: "", items: [], error: "Tính năng tư vấn chưa được cấu hình." };

      const catalog = allProducts
        .map(
          (p) =>
            `- ${p.title} | ${p.category} | ${p.free ? "Miễn phí" : formatVnd(priceValue(p))} | ${p.description}`,
        )
        .join("\n");

      const res = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
          "X-Lovable-AIG-SDK": "fetch",
        },
        body: JSON.stringify({
          model: "openai/gpt-6-astra",
          stream: true,
          store: false,
          reasoning: { effort: "low" },
          input: [
            {
              role: "system",
              content: `Bạn là chuyên viên tư vấn của KHO AI Studio. Chỉ đề xuất sản phẩm có trong danh mục dưới đây, dùng đúng tên sản phẩm. Chọn 1-3 sản phẩm phù hợp nhất với nhu cầu, tổng giá không vượt ngân sách nếu có. Viết tiếng Việt ngắn gọn, mỗi lý do dưới 40 từ.\n\nDanh mục:\n${catalog}`,
            },
            {
              role: "user",
              content: `Nhu cầu: ${data.need}\nNgân sách: ${data.budget || "không nêu"}\nMục đích sử dụng: ${data.purpose || "không nêu"}`,
            },
          ],
          text: {
            format: {
              type: "json_schema",
              name: "recommendation",
              strict: true,
              schema: {
                type: "object",
                additionalProperties: false,
                required: ["summary", "items"],
                properties: {
                  summary: { type: "string" },
                  items: {
                    type: "array",
                    items: {
                      type: "object",
                      additionalProperties: false,
                      required: ["title", "reason"],
                      properties: { title: { type: "string" }, reason: { type: "string" } },
                    },
                  },
                },
              },
            },
          },
        }),
      });

      if (!res.ok || !res.body) {
        const body = await res.text().catch(() => "");
        console.error(`AI gateway error [${res.status}]: ${body}`);
        const msg =
          res.status === 429
            ? "Hệ thống đang bận, vui lòng thử lại sau ít phút."
            : res.status === 402
              ? "Tính năng tư vấn tạm hết lượt sử dụng."
              : "Không thể tạo gợi ý lúc này.";
        return { summary: "", items: [], error: msg };
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let text = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data:")) continue;
          const payload = line.slice(5).trim();
          if (!payload || payload === "[DONE]") continue;
          try {
            const evt = JSON.parse(payload);
            if (evt.type === "response.output_text.delta") text += evt.delta;
          } catch {
            /* partial frame */
          }
        }
      }

      try {
        const parsed = JSON.parse(text) as { summary: string; items: Recommendation[] };
        const titles = new Set(allProducts.map((p) => p.title));
        return {
          summary: parsed.summary,
          items: parsed.items.filter((i) => titles.has(i.title)).slice(0, 3),
        };
      } catch {
        return { summary: "", items: [], error: "Không đọc được gợi ý, vui lòng thử lại." };
      }
    },
  );
