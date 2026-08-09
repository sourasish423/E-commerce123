// Static presentation metadata for each catalog category — background image
// and a short line of copy, used for the homepage category grid and the
// category banner shown when a category filter is active.
const categoryMeta = {
  Bags: {
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=1600&q=80",
    tagline: "Carry systems engineered for daily use.",
  },
  Apparel: {
    image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=1600&q=80",
    tagline: "Natural fibers, tailored for year-round wear.",
  },
  Home: {
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=1600&q=80",
    tagline: "Considered essentials for the kitchen and beyond.",
  },
  Footwear: {
    image: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=1600&q=80",
    tagline: "Full-grain leather, built to be resoled, not replaced.",
  },
  Stationery: {
    image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=1600&q=80",
    tagline: "Tools for correspondence, planning, and record-keeping.",
  },
};

export const getCategoryMeta = (category) =>
  categoryMeta[category] || {
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1600&q=80",
    tagline: "Curated goods from the FieldNote catalog.",
  };

export default categoryMeta;
