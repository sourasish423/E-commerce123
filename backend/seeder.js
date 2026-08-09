// Seeds the database with a demo admin user and a generated catalog of
// 55+ products per category (Bags, Apparel, Home, Footwear, Stationery).
// Run: npm run seed   |   Destroy: npm run seed:destroy
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import Product from "./models/Product.js";
import Order from "./models/Order.js";

dotenv.config();
connectDB();

const slugify = (name) =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randPrice = (min, max) => Number((Math.random() * (max - min) + min).toFixed(2));
const pick = (arr, i) => arr[i % arr.length];

const users = [
  { name: "Admin User", email: "admin@example.com", password: "admin123", isAdmin: true },
  { name: "Jane Shopper", email: "jane@example.com", password: "password123", isAdmin: false },
];

// Shared pool of descriptive adjectives, cycled with each category's nouns
// to produce distinct, plausible product names without hand-writing 275+ entries.
const adjectives = [
  "Classic",
  "Heritage",
  "Ridge",
  "Summit",
  "Trail",
  "Harbor",
  "Union",
  "Timber",
  "Cedar",
  "Prairie",
  "Northfield",
  "Overland",
];

const CATEGORIES = {
  Bags: {
    nouns: ["Tote", "Backpack", "Duffel", "Messenger Bag", "Weekender", "Crossbody Bag"],
    priceRange: [25, 180],
    skuPrefix: "BAG",
    images: [
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800",
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800",
      "https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?w=800",
    ],
    describe: (name) =>
      `${name} built for daily carry — heavyweight canvas or full-grain leather, reinforced seams, and hardware made to outlast the bag itself.`,
  },
  Apparel: {
    nouns: ["Sweater", "Jacket", "Flannel Shirt", "Chino Pant", "Henley", "Work Vest"],
    priceRange: [30, 160],
    skuPrefix: "APP",
    images: [
      "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800",
      "https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?w=800",
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800",
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800",
    ],
    describe: (name) =>
      `${name} cut from natural fibers and finished for everyday wear. Pre-washed, reinforced at every stress point, and built to soften with age.`,
  },
  Home: {
    nouns: ["Mug", "Cast Iron Skillet", "Apron", "Candle", "Cutting Board", "Wool Blanket"],
    priceRange: [12, 90],
    skuPrefix: "HOM",
    images: [
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800",
      "https://images.unsplash.com/photo-1585515320310-259814833e62?w=800",
      "https://images.unsplash.com/photo-1517705008128-361805f42e86?w=800",
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800",
      "https://images.unsplash.com/photo-1584589167171-541ce45f1eea?w=800",
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800",
    ],
    describe: (name) =>
      `${name} made for a kitchen or living room that gets used. Simple materials, no unnecessary parts, built to be handed down.`,
  },
  Footwear: {
    nouns: ["Leather Boots", "Canvas Sneakers", "Suede Loafers", "Trail Shoes", "Chukka Boots", "Camp Sandals"],
    priceRange: [60, 220],
    skuPrefix: "FTW",
    images: [
      "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800",
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800",
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800",
    ],
    describe: (name) =>
      `${name} with a lugged rubber sole and a construction meant to be resoled, not replaced. Broken in fast, built to last for years.`,
  },
  Stationery: {
    nouns: ["Notebook", "Pen Set", "Desk Organizer", "Weekly Planner", "Letterpress Card Set", "Pencil Case"],
    priceRange: [8, 45],
    skuPrefix: "STA",
    images: [
      "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800",
      "https://images.unsplash.com/photo-1519222970733-f546218fa6d7?w=800",
      "https://images.unsplash.com/photo-1517842645767-c639042777db?w=800",
      "https://images.unsplash.com/photo-1583485088034-697b5bc36b9d?w=800",
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800",
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800",
    ],
    describe: (name) =>
      `${name} for people who still write things down. Stitch-bound or machined for daily use, with a finish that improves with wear.`,
  },
};

const PRODUCTS_PER_CATEGORY = 55;

// Generates `count` distinct products for a category by pairing adjectives
// with the category's noun list (adjectives.length * nouns.length must be >= count).
const generateCategoryProducts = (category, { nouns, priceRange, skuPrefix, images, describe }, count) => {
  const products = [];
  let i = 0;
  outer: for (const noun of nouns) {
    for (const adj of adjectives) {
      if (i >= count) break outer;
      const name = `${adj} ${noun}`;
      products.push({
        name,
        category,
        brand: "FieldNote",
        price: randPrice(priceRange[0], priceRange[1]),
        countInStock: randInt(0, 60),
        image: pick(images, i),
        description: describe(name),
        skuBase: skuPrefix,
      });
      i++;
    }
  }
  return products;
};

const buildCatalog = () => {
  let catalog = [];
  for (const [category, config] of Object.entries(CATEGORIES)) {
    catalog = catalog.concat(generateCategoryProducts(category, config, PRODUCTS_PER_CATEGORY));
  }
  return catalog;
};

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers.find((u) => u.isAdmin)._id;

    const rawProducts = buildCatalog();

    const products = rawProducts.map((p, idx) => ({
      user: adminUser,
      name: p.name,
      slug: `${slugify(p.name)}-${idx}-${Math.random().toString(36).slice(2, 6)}`,
      image: p.image,
      brand: p.brand,
      category: p.category,
      description: p.description,
      price: p.price,
      countInStock: p.countInStock,
      sku: `${p.skuBase}-${(idx + 1).toString().padStart(4, "0")}`,
    }));

    await Product.insertMany(products);

    const perCategoryCounts = Object.entries(
      products.reduce((acc, p) => {
        acc[p.category] = (acc[p.category] || 0) + 1;
        return acc;
      }, {})
    );

    console.log(`Data imported! ${products.length} products total.`);
    perCategoryCounts.forEach(([cat, n]) => console.log(`  ${cat}: ${n}`));
    console.log("Admin login: admin@example.com / admin123");
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    console.log("Data destroyed!");
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
