import { type Category } from "./data";

export type DemoVideo = {
  id: string;
  title: string;
  creatorId: string;
  category: string;
  thumbnail: string;
  duration: string;
  views: string;
  published: string;
  caption?: string;
  description: string;
};
export const videoCategories = [
  "All",
  "Creator updates",
  "Behind the scenes",
  "Q&A",
  "Catalogue",
  "Community",
];
export const videos: DemoVideo[] = [
  {
    id: "v-1",
    title: "A look around the studio. Nothing fancy, just us.",
    creatorId: "milo",
    category: "Behind the scenes",
    thumbnail: "studio",
    duration: "8:42",
    views: "12.4K",
    published: "2 days ago",
    caption: "STUDIO TOUR",
    description:
      "A fictional creator update for this interface demo. The sample player uses a short, non-explicit flower clip to demonstrate playback.",
  },
  {
    id: "v-2",
    title: "Before you request anything: let’s talk boundaries",
    creatorId: "rae",
    category: "Q&A",
    thumbnail: "workspace",
    duration: "6:18",
    views: "8.1K",
    published: "1 day ago",
    caption: "LET’S TALK.",
    description:
      "Clear briefs, ongoing consent, and the right to decline. A non-explicit demo of an educational creator video.",
  },
  {
    id: "v-3",
    title: "The little camera setup behind the videos",
    creatorId: "jules",
    category: "Behind the scenes",
    thumbnail: "camera",
    duration: "11:05",
    views: "6.7K",
    published: "3 days ago",
    description:
      "A fictional behind-the-scenes video about making content. All channel statistics and comments are simulated.",
  },
  {
    id: "v-4",
    title: "Your questions. My completely unfiltered answers.",
    creatorId: "milo",
    category: "Q&A",
    thumbnail: "desk",
    duration: "14:32",
    views: "19.2K",
    published: "4 days ago",
    caption: "THE FAQ",
    description:
      "A fictional, non-explicit community Q&A. This page demonstrates a watch experience and predefined request options.",
  },
  {
    id: "v-5",
    title: "A quiet morning between filming days",
    creatorId: "rae",
    category: "Creator updates",
    thumbnail: "workspace",
    duration: "4:56",
    views: "4.3K",
    published: "5 days ago",
    description:
      "A fictional everyday creator update. Stock preview imagery and a short sample clip are used in the demo.",
  },
  {
    id: "v-6",
    title: "After hours: a check-in with the community",
    creatorId: "jules",
    category: "Community",
    thumbnail: "night",
    duration: "7:24",
    views: "10.8K",
    published: "1 week ago",
    caption: "AFTER HOURS",
    description:
      "An ordinary community check-in, presented as a fictional channel upload.",
  },
  {
    id: "v-7",
    title: "Why we keep requests inside a fixed catalogue",
    creatorId: "rae",
    category: "Catalogue",
    thumbnail: "plants",
    duration: "5:09",
    views: "7.2K",
    published: "1 week ago",
    caption: "WITHIN REASON.",
    description:
      "A non-explicit explanation of catalogue-only requests. Demonstration labels do not certify any real product.",
  },
  {
    id: "v-8",
    title: "What happens after you post a request?",
    creatorId: "milo",
    category: "Catalogue",
    thumbnail: "studio",
    duration: "3:48",
    views: "15.6K",
    published: "1 week ago",
    description:
      "A fictional walkthrough of request acceptance, private submission placeholders, review, and demo payouts.",
  },
  {
    id: "v-9",
    title: "The setup tour you kept asking for",
    creatorId: "jules",
    category: "Behind the scenes",
    thumbnail: "desk",
    duration: "9:16",
    views: "5.9K",
    published: "2 weeks ago",
    description:
      "A fictional channel video about a recording workspace. No actual creator upload is shown.",
  },
];
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
    title: "Catalogue overview video",
    productId: "soft-one",
    category: "Starter",
    reward: 35,
    brief:
      "A non-explicit overview of the fictional approved catalogue item, its packaging, and published information. No demonstration of sexual activity.",
    icon: "review",
  },
  {
    id: "qa",
    title: "Creator Q&A video",
    productId: "studio-two",
    category: "Standard",
    reward: 60,
    brief:
      "A non-explicit creator Q&A about catalogue choices, boundaries, and the request process. Questions stay within these topics.",
    icon: "question",
  },
  {
    id: "studio",
    title: "Behind-the-scenes video",
    productId: "full-circle",
    category: "Premium",
    reward: 100,
    brief:
      "An ordinary behind-the-scenes video about the creator’s filming setup and process. No explicit media or activity.",
    icon: "tour",
  },
];
