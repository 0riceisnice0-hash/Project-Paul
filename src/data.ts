export type Status =
  "OPEN" | "ACCEPTED" | "SUBMITTED" | "VERIFIED" | "PAID" | "DECLINED";
export type Category = "Starter" | "Standard" | "Premium";
export type RequestItem = {
  id: string;
  templateId?: string;
  productId: string;
  category: Category;
  reward: number;
  status: Status;
  creatorId: string;
  notes: string;
  claimant?: string;
  proof?: string;
  flagged?: boolean;
  createdAt: string;
};
export type Transaction = {
  id: string;
  label: string;
  amount: number;
  status: "Completed" | "Reserved";
  date: string;
  requestId?: string;
};
export type DemoState = {
  requests: RequestItem[];
  transactions: Transaction[];
  balance: number;
  adult: boolean;
};
export const catalogue = [
  {
    id: "soft-one",
    name: "Soft One",
    line: "Adult silicone toy",
    category: "Starter" as Category,
    tone: "lime",
    code: "CAT–001",
    description:
      "An illustrative adult anal-toy catalogue item. Demo approval only; no real product safety certification.",
  },
  {
    id: "studio-two",
    name: "Studio Two",
    line: "Adult silicone toy",
    category: "Standard" as Category,
    tone: "purple",
    code: "CAT–002",
    description:
      "An illustrative adult anal-toy catalogue item. Demo approval only; no real product safety certification.",
  },
  {
    id: "full-circle",
    name: "Full Circle",
    line: "Adult toy collection",
    category: "Premium" as Category,
    tone: "pink",
    code: "CAT–003",
    description:
      "An illustrative adult anal-toy catalogue item. Demo approval only; no real product safety certification.",
  },
];
export const creators = [
  {
    id: "milo",
    name: "Milo",
    handle: "@miloafterdark",
    initials: "MI",
    tone: "purple",
    rating: "4.9",
    reviews: 28,
    completed: 34,
    bio: "Excellent taste. Terrible jokes. Clear briefs and a big believer in boundaries.",
  },
  {
    id: "jules",
    name: "Jules",
    handle: "@julesrules",
    initials: "JU",
    tone: "lime",
    rating: "4.8",
    reviews: 19,
    completed: 23,
    bio: "Here for the good vibes. Always read the brief. Always respect the answer.",
  },
  {
    id: "rae",
    name: "Rae",
    handle: "@raeday",
    initials: "RA",
    tone: "pink",
    rating: "5.0",
    reviews: 16,
    completed: 21,
    bio: "A little chaos, a lot of care. Consent comes before everything.",
  },
  {
    id: "you",
    name: "You",
    handle: "@demo_you",
    initials: "YO",
    tone: "lime",
    rating: "New",
    reviews: 0,
    completed: 0,
    bio: "Your demo profile. Everything you do here is simulated and stays in this browser.",
  },
];
export const seed: DemoState = {
  adult: false,
  balance: 240,
  requests: [
    {
      id: "rq-1035",
      productId: "soft-one",
      templateId: "overview",
      category: "Starter",
      reward: 35,
      status: "OPEN",
      creatorId: "milo",
      notes:
        "Keep it within your comfort zone. The agreed brief and boundaries are what count.",
      createdAt: "2026-10-06",
    },
    {
      id: "rq-1060",
      productId: "studio-two",
      templateId: "qa",
      category: "Standard",
      reward: 60,
      status: "OPEN",
      creatorId: "jules",
      notes:
        "An approved catalogue request. You can decline or stop at any point.",
      createdAt: "2026-10-06",
    },
    {
      id: "rq-1100",
      productId: "full-circle",
      templateId: "studio",
      category: "Premium",
      reward: 100,
      status: "OPEN",
      creatorId: "rae",
      notes:
        "A premium catalogue request with a clear brief, private review, and no pressure.",
      createdAt: "2026-10-05",
    },
    {
      id: "rq-1075",
      productId: "studio-two",
      templateId: "qa",
      category: "Standard",
      reward: 75,
      status: "SUBMITTED",
      creatorId: "milo",
      claimant: "you",
      proof: "Demo evidence placeholder. No actual media has been uploaded.",
      notes:
        "Catalogue-only request. The performer agreed to the boundaries before accepting.",
      createdAt: "2026-10-05",
    },
    {
      id: "rq-1045",
      productId: "soft-one",
      templateId: "overview",
      category: "Starter",
      reward: 45,
      status: "ACCEPTED",
      creatorId: "rae",
      claimant: "you",
      notes:
        "Take your time. No obligation to continue if you change your mind.",
      createdAt: "2026-10-05",
    },
    {
      id: "rq-1120",
      productId: "full-circle",
      templateId: "studio",
      category: "Premium",
      reward: 120,
      status: "PAID",
      creatorId: "jules",
      claimant: "you",
      proof: "Demo evidence placeholder.",
      notes: "Completed demo request. Fictional approval and payout.",
      createdAt: "2026-10-04",
    },
  ],
  transactions: [
    {
      id: "demo-tx-104",
      label: "Demo wallet top-up",
      amount: 120,
      status: "Completed",
      date: "2026-10-06",
    },
    {
      id: "demo-tx-103",
      label: "Premium request payout",
      amount: 120,
      status: "Completed",
      date: "2026-10-04",
      requestId: "rq-1120",
    },
    {
      id: "demo-tx-102",
      label: "Standard reward pending review",
      amount: 75,
      status: "Reserved",
      date: "2026-10-05",
      requestId: "rq-1075",
    },
  ],
};
export const forbidden =
  /\b(fire\s*extinguisher|candle|bottle|knife|knives|aerosol|pressuri[sz]ed|household\s*object|sharp\s*object|fire|drugs?|coerci(?:on|ve)|minors?|underage|glass)\b/i;
export function validateNotes(value: string) {
  return forbidden.test(value)
    ? "That item or activity is outside the permitted catalogue. Remove it to continue."
    : "";
}
export function readState(): DemoState {
  try {
    const saved = JSON.parse(localStorage.getItem("paul-demo-v2") || "null");
    if (
      saved &&
      Array.isArray(saved.requests) &&
      Array.isArray(saved.transactions) &&
      typeof saved.balance === "number"
    ) {
      // Preserve earlier demo balances and progress when updating the video UI.
      const templates: Record<string, string> = {
        "soft-one": "overview",
        "studio-two": "qa",
        "full-circle": "studio",
      };
      saved.requests = saved.requests.map((request: RequestItem) => ({
        ...request,
        templateId: request.templateId || templates[request.productId],
        // Replace the earlier generic video briefs without dropping user notes.
        notes:
          /^(A non-explicit overview|A non-explicit creator Q&A|An ordinary behind-the-scenes video)/.test(
            request.notes,
          )
            ? `An adult catalogue request for ${catalogue.find((p) => p.id === request.productId)?.name}. The accepting adult chooses their boundaries and records themselves for private review only. Demo item and submission only.` +
              (request.notes.includes(" Additional note: ")
                ? " Additional note: " +
                  request.notes
                    .split(" Additional note: ")
                    .slice(1)
                    .join(" Additional note: ")
                : "")
            : request.notes,
      }));
      return saved;
    }
  } catch {
    /* A fresh demo is safe when storage is unavailable. */
  }
  return structuredClone(seed);
}
export const money = (amount: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(amount);
