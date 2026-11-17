export type Media = { src: string; type: "image" | "video"; poster?: string };
export type Project = {
  id: string;
  category: string;
  year: number;
  concept: boolean;
  demo: boolean;
  art: string;
  media: Media[];
};
export type Product = {
  id: string;
  category: string;
  price: number;
  formats: string[];
  featured: boolean;
  art: string;
  checkoutUrl: string;
  media: Media[];
};
