export interface Review {
  name: string;
  location: string;
  date: string;
  rating: number;
  body: string;
}

export const reviews: Review[] = [
  {
    name: "Carlos M.",
    location: "Houston, TX",
    date: "2026-06-09",
    rating: 5,
    body: "Outstanding sublimation quality on our corporate mugs and jerseys! The colors are incredibly vibrant, sharp, and durable. Israel and his team delivered ahead of schedule for our annual company kickoff.",
  },
  {
    name: "Jessica R.",
    location: "Cypress, TX 77433",
    date: "2026-06-08",
    rating: 5,
    body: "We ordered 150 custom DTF printed hoodies and embroidered caps for our sports team. The print feel is super soft, does not crack after washing, and the turnaround time was lightning fast. Best print shop in Houston!",
  },
  {
    name: "David K.",
    location: "The Heights, Houston, TX",
    date: "2026-06-04",
    rating: 5,
    body: "Ordered large outdoor vinyl banners and full-color yard signs for our grand opening. Top-tier materials, weather-resistant finish, and reasonable prices. Highly recommended!",
  },
  {
    name: "Eduardo B.",
    location: "Houston, TX 77019",
    date: "2026-04-12",
    rating: 5,
    body: "Great experience from start to finish. They helped us refine our vector artwork, sampled the sublimation colors, and delivered premium promotional merchandise with flawless precision.",
  },
];
