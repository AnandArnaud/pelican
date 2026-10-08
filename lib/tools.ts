// Tools the assistant can call. In-memory data stands in for the shop's systems.
const ORDERS: Record<string, { status: string; items: string[]; eta: string }> = {
  "PK-1042": { status: "shipped", items: ["Ridge Tent 2P"], eta: "Thursday" },
  "PK-1043": { status: "processing", items: ["Trail Stove", "Fuel x2"], eta: "next Monday" },
};
const STOCK: Record<string, number> = { "Ridge Tent 2P": 4, "Trail Stove": 0, "Summit Pack 45": 12 };

export const toolDefinitions = [
  {
    type: "function" as const,
    function: {
      name: "lookup_order",
      description: "Look up an order by its number, e.g. PK-1042",
      parameters: { type: "object", properties: { order_number: { type: "string" } }, required: ["order_number"] },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "check_stock",
      description: "Check how many units of a product are in stock",
      parameters: { type: "object", properties: { product: { type: "string" } }, required: ["product"] },
    },
  },
];

export function runTool(name: string, args: Record<string, string>): string {
  if (name === "lookup_order") {
    const o = ORDERS[args.order_number?.toUpperCase()];
    return o ? JSON.stringify(o) : JSON.stringify({ error: "order not found" });
  }
  if (name === "check_stock") {
    const n = STOCK[args.product];
    return JSON.stringify(n === undefined ? { error: "unknown product" } : { product: args.product, in_stock: n });
  }
  return JSON.stringify({ error: "unknown tool" });
}
