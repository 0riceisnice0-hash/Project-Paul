import {
  catalogue,
  type Category,
  type RequestItem,
  type Status,
} from "./data";

export type DemoVideo = {
  id: string;
  title: string;
  creatorId: string;
  category: string;
  published: string;
  description: string;
  productId: string;
  requestId: string;
  reward: number;
  status: Status;
};
export const videoCategories = ["All", "Soft One", "Studio Two", "Full Circle"];
export type RequestTemplate = {
  id: string;
  title: string;
  productId: string;
  category: Category;
  reward: number;
  brief: string;
  icon: "review" | "question" | "tour";
};
export const requestTemplates: RequestTemplate[] = [
  {
    id: "overview",
    title: "Soft One private request",
    productId: "soft-one",
    category: "Starter",
    reward: 35,
    brief:
      "An adult catalogue request for Soft One. The accepting adult sets the boundaries, records their own submission, and permits private review only. No public sharing or in-person contact. Demo item and submission only.",
    icon: "review",
  },
  {
    id: "qa",
    title: "Studio Two private request",
    productId: "studio-two",
    category: "Standard",
    reward: 60,
    brief:
      "An adult catalogue request for Studio Two. The accepting adult sets the boundaries, records their own submission, and permits private review only. Consent can be withdrawn; the reward never overrides that choice. Demo item and submission only.",
    icon: "question",
  },
  {
    id: "studio",
    title: "Full Circle private request",
    productId: "full-circle",
    category: "Premium",
    reward: 100,
    brief:
      "An adult catalogue request for Full Circle. The accepting adult sets the boundaries and records their own private submission. Only the fixed catalogue item is permitted. No third-party filming, public sharing, or in-person contact. Demo item and submission only.",
    icon: "tour",
  },
];
// Keep existing saved/history links while changing the presentation.
const existingIds: Record<string, string> = {
  "rq-1035": "v-1",
  "rq-1060": "v-2",
  "rq-1100": "v-3",
  "rq-1075": "v-4",
  "rq-1045": "v-5",
  "rq-1120": "v-6",
};
export function getRequestVideos(requests: RequestItem[]): DemoVideo[] {
  return requests.map((request) => {
    const product = catalogue.find((p) => p.id === request.productId)!;
    return {
      id: existingIds[request.id] || "submission-" + request.id,
      title: `${product.name} · £${request.reward} private request`,
      creatorId: request.creatorId,
      category: product.name,
      published: new Date(request.createdAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      }),
      description: request.notes,
      productId: request.productId,
      requestId: request.id,
      reward: request.reward,
      status: request.status,
    };
  });
}
