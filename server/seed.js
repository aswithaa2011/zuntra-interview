import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "./model/User.js";
import Post from "./model/Post.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://aswithaavijay_db_user:C389pUUgHy7uSVks@cluster0.8hhxoku.mongodb.net/pinterestweb";

const seedData = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected successfully!");

    // 1. Clean existing posts
    console.log("Cleaning old posts...");
    await Post.deleteMany({});

    // 2. Setup Curator User
    let curator = await User.findOne({ email: "curator@pinvault.com" });
    if (!curator) {
      console.log("Creating curator account...");
      const hashedPassword = await bcrypt.hash("curator123", 10);
      curator = await User.create({
        username: "aesthetic_curator",
        email: "curator@pinvault.com",
        password: hashedPassword,
        avatar: "/assets/palo_santo_design_section_3.png",
        bio: "Curating premium visual design, minimalist architecture, and natural aesthetics. Welcome to the collection.",
        savedPosts: []
      });
    }

    const curatorId = curator._id;

    // 3. Define high-quality visual pins
    const pins = [
      // --- LOCAL ARCHITECTURE ASSETS ---
      {
        title: "Concrete Geometric Lines",
        description: "Minimalist concrete structure demonstrating perfect geometry and striking light/shadow interplay.",
        imageUrl: "/assets/architecture/1.jpg",
        category: "Architecture",
        tags: ["minimalism", "concrete", "brutalism"],
        author: curatorId,
      },
      {
        title: "Staircase Shadows",
        description: "A beautiful view of a minimalist concrete staircase captured during golden hour.",
        imageUrl: "/assets/architecture/2.jpg",
        category: "Architecture",
        tags: ["staircase", "shadows", "architectural"],
        author: curatorId,
      },
      {
        title: "Modern Facade",
        description: "Brutalist residential exterior focusing on texture, repeating shapes, and negative space.",
        imageUrl: "/assets/architecture/3.jpg",
        category: "Architecture",
        tags: ["brutalist", "facade", "design"],
        author: curatorId,
      },
      {
        title: "Monolithic Arches",
        description: "Elegant modern arches blending architectural engineering with organic interior curves.",
        imageUrl: "/assets/architecture/4.jpg",
        category: "Architecture",
        tags: ["arches", "monolith", "interiors"],
        author: curatorId,
      },
      {
        title: "Urban Angularity",
        description: "A high-angle architectural study of sharp lines and materials in modern urban construction.",
        imageUrl: "/assets/architecture/5.jpg",
        category: "Architecture",
        tags: ["urban", "angular", "steel"],
        author: curatorId,
      },
      {
        title: "Canal Village Artwork",
        description: "A beautiful artistic render showing a quiet boat ride down a serene canal village filled with abstract architecture.",
        imageUrl: "/assets/architecture/6.jpg",
        category: "Architecture",
        tags: ["canal", "painting", "aesthetic", "scenery"],
        author: curatorId,
      },
      {
        title: "Futuristic Concrete Geometry",
        description: "A striking modernist building highlighting futuristic concrete geometric curves and dynamic architecture.",
        imageUrl: "/assets/architecture/7.jpg",
        category: "Architecture",
        tags: ["futuristic", "concrete", "geometry", "curves"],
        author: curatorId,
      },

      // --- LOCAL NATURE ASSETS ---
      {
        title: "Misty Pine Valley",
        description: "Evergreen pines covered in dense morning fog deep within a silent mountain valley.",
        imageUrl: "/assets/nature/1.jpg",
        category: "Nature",
        tags: ["misty", "pines", "valley", "wilderness"],
        author: curatorId,
      },
      {
        title: "Lakeside Reflection",
        description: "Crystal clear mountain lake reflecting the majestic forest and calm early skies.",
        imageUrl: "/assets/nature/2.jpg",
        category: "Nature",
        tags: ["reflection", "lake", "serenity"],
        author: curatorId,
      },
      {
        title: "Rocky Heights",
        description: "Dramatic mountain peaks raising above the treeline, showcasing rugged raw nature.",
        imageUrl: "/assets/nature/3jpg.jpg", // matching the user's specific file name
        category: "Nature",
        tags: ["peaks", "rocks", "mountains"],
        author: curatorId,
      },
      {
        title: "Forest Pathways",
        description: "A sun-dappled walking trail meandering through a tall forest of mossy trees.",
        imageUrl: "/assets/nature/4.jpg",
        category: "Nature",
        tags: ["trail", "forest", "hiking"],
        author: curatorId,
      },
      {
        title: "Silent Wilderness",
        description: "Atmospheric landscape highlighting natural textures, stones, and sparse winter greens.",
        imageUrl: "/assets/nature/5.jpg",
        category: "Nature",
        tags: ["wilderness", "textures", "landscape"],
        author: curatorId,
      },
      {
        title: "Deep Woodland",
        description: "Looking up into the dense canopy of ancient redwood trees during a peaceful hike.",
        imageUrl: "/assets/nature/6.jpg",
        category: "Nature",
        tags: ["woodland", "canopy", "redwoods"],
        author: curatorId,
      },
      {
        title: "Lavender Dreams",
        description: "An ethereal golden hour moment captured in an endless blooming lavender field in Provence, France.",
        imageUrl: "/assets/nature/7.png",
        category: "Nature",
        tags: ["lavender", "golden hour", "aesthetic", "provence"],
        author: curatorId,
      },
      {
        title: "Morning Ritual Flatlay",
        description: "A curated aesthetic flat lay featuring a vintage camera, dried botanicals, coffee, and handwritten journaling on warm linen.",
        imageUrl: "/assets/nature/8.png",
        category: "Art",
        tags: ["flatlay", "aesthetic", "vintage", "lifestyle"],
        author: curatorId,
      },
      {
        title: "Minimalist Skincare Curation",
        description: "Premium visual design representing clean cosmetics with natural, neutral styling.",
        imageUrl: "/assets/minimalist_skincare_section_1.png",
        category: "Fashion",
        tags: ["skincare", "cosmetics", "branding"],
        author: curatorId,
      },
      {
        title: "Organic Textures & Glass",
        description: "Elegant glass bottles resting on textured stones with subtle water droplets.",
        imageUrl: "/assets/minimalist_skincare_section_3.png",
        category: "Art",
        tags: ["aesthetic", "branding", "textures"],
        author: curatorId,
      },
      {
        title: "Palo Santo Styling",
        description: "Curated Palo Santo incense styling, showcasing raw wood textures and soft warm neutral palettes.",
        imageUrl: "/assets/palo_santo_design_section_2.png",
        category: "Art",
        tags: ["palosanto", "incense", "meditation"],
        author: curatorId,
      },
      {
        title: "Earthy Warm Tones",
        description: "A gorgeous layout highlighting natural design elements, clay pottery, and dried botanicals.",
        imageUrl: "/assets/palo_santo_design_section_5.png",
        category: "Interiors",
        tags: ["interiors", "pottery", "earthy"],
        author: curatorId,
      },

      // --- CURATED PREMIUM UNSPLASH ASSETS MATCHING PINTEREST INSPIRATIONS ---
      {
        title: "Concrete Curvatures",
        description: "Sophisticated modern architecture with smooth concrete curves and clean blue sky background.",
        imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
        category: "Architecture",
        tags: ["curves", "modernist", "concrete"],
        author: curatorId,
      },
      {
        title: "Classical Art & Space",
        description: "An elegant museum corridor featuring classical sculptures, high ceilings, and beautiful lighting.",
        imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=800&q=80",
        category: "Art",
        tags: ["museum", "sculptures", "classical"],
        author: curatorId,
      },
      {
        title: "Linen Minimalist Apparel",
        description: "Beige aesthetic linens and natural fibers highlighting premium fashion and sustainable lifestyle.",
        imageUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80",
        category: "Fashion",
        tags: ["fashion", "linen", "sustainability"],
        author: curatorId,
      },
      {
        title: "Warm Scandi Bedroom",
        description: "A light-filled bedroom with beige accents, neutral wooden furniture, and cozy organic textures.",
        imageUrl: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80",
        category: "Interiors",
        tags: ["scandinavian", "bedroom", "warmth"],
        author: curatorId,
      },
      {
        title: "Amalfi Coast Cliffside",
        description: "Breathtaking views of historic cliffside pastel buildings in Positano, looking down at the turquoise sea.",
        imageUrl: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80",
        category: "Travel",
        tags: ["italy", "positano", "travel", "ocean"],
        author: curatorId,
      },
      {
        title: "Minimal Studio Workspace",
        description: "Sleek aesthetic home office workspace featuring clean desk lines, plants, and high-end tech accessories.",
        imageUrl: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=800&q=80",
        category: "Technology",
        tags: ["workspace", "macbook", "minimaloffice"],
        author: curatorId,
      },
      {
        title: "Rustic Sourdough Bakery",
        description: "Freshly baked homemade sourdough bread dusted with flour under warm morning bakery lighting.",
        imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
        category: "Food",
        tags: ["sourdough", "baking", "rustic", "breakfast"],
        author: curatorId,
      },
      {
        title: "Golden Hour Yoga Flow",
        description: "Finding peace and mental clarity with a sunrise yoga session on a high coastal cliff.",
        imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80",
        category: "Fitness",
        tags: ["yoga", "wellness", "meditation", "sunrise"],
        author: curatorId,
      }
    ];

    console.log("Seeding posts database...");
    const createdPosts = await Post.create(pins);
    console.log(`Successfully seeded ${createdPosts.length} post pins!`);

    // 4. Add some initial interactive mock likes & comments to showcase features
    console.log("Adding likes and comments to posts...");
    for (let i = 0; i < createdPosts.length; i++) {
      const post = createdPosts[i];
      // Add like from curator
      post.likes.push(curatorId);
      
      // Add a couple of aesthetic comments
      if (i % 2 === 0) {
        post.comments.push({
          user: curatorId,
          text: "Absolutely stunning! This visual matches my aesthetic board perfectly."
        });
      } else {
        post.comments.push({
          user: curatorId,
          text: "Love the lighting and textures here. Added to my inspiration folder!"
        });
      }
      await post.save();
    }

    console.log("Seeding process completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedData();
