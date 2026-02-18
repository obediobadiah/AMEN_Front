import { HandHeart, Leaf, Users, Droplets, Globe, Heart, ShieldCheck, Newspaper } from "lucide-react";
import { images } from "./images";

export const programs = [
  {
    id: 1,
    title: "Women Empowerment",
    description: "Supporting women through vocational training and micro-finance initiatives to build sustainable livelihoods.",
    image: images.programWomen,
    category: "Community",
    raised: 15000,
    goal: 25000,
    icon: Users
  },
  {
    id: 2,
    title: "Environmental Protection",
    description: "Reforestation projects and sustainable agriculture workshops to combat climate change and preserve biodiversity.",
    image: images.programNature,
    category: "Nature",
    raised: 8000,
    goal: 20000,
    icon: Leaf
  },
  {
    id: 3,
    title: "Clean Water Access",
    description: "Installing wells and water purification systems in remote villages to ensure access to safe drinking water.",
    image: images.programWater,
    category: "Health",
    raised: 32000,
    goal: 40000,
    icon: Droplets
  }
];

export const stats = [
  { label: "projectsCompleted", value: "90+", icon: ShieldCheck },
  { label: "happyBeneficiaries", value: "15k+", icon: HandHeart },
  { label: "volunteers", value: "350", icon: Users },
  { label: "yearsActive", value: "12", icon: Globe },
];

export const news = [
  {
    id: 1,
    title: "The Dignity of Human Beings to Work",
    excerpt: "Exploring how dignity in labor transforms communities and builds self-reliance.",
    date: "Aug 25, 2025",
    author: "Admin",
    image: images.programWomen
  },
  {
    id: 2,
    title: "The Power of People Against Poverty",
    excerpt: "Community-led initiatives are showing remarkable results in the fight against extreme poverty.",
    date: "Aug 20, 2025",
    author: "Sarah J.",
    image: images.programWater
  },
  {
    id: 3,
    title: "Driving Force Out of Poverty",
    excerpt: "Education remains the single most effective tool for breaking the cycle of poverty.",
    date: "Aug 15, 2025",
    author: "Mike T.",
    image: images.programNature
  }
];

export type NavItem = {
  name: string;
  href?: string;
  children?: NavItem[];
};

export const navLinks: NavItem[] = [
  // Home
  {
    name: "Home",
    href: "/"
  },

  // About
  {
    name: "About",
    href: "/about",
    children: [
      { name: "History", href: "/about#history" },
      { name: "Vision and Mission", href: "/about#vision-mission" },
      { name: "Objectives", href: "/about#objectives" },
      {
        name: "Governance & Organization",
        href: "/about#governance"
      },
      {
        name: "Orientations stratégiques",
        href: "/about#strategic-orientations"
      }
    ]
  },

  // Activities
  {
    name: "Activities",
    href: "/activities",
    children: [
      {
        name: "Programs",
        href: "/activities/programs",
      },
      {
        name: "Projects & Initiatives",
        href: "/activities/projects"
      },
      {
        name: "Resources",
        href: "/activities/resources"
      }
    ]
  },

  // Get Involved
  {
    name: "Get Involved",
    href: "/get-involved"
  },

  // News
  {
    name: "News",
    href: "/news",
    children: [
      { name: "Actualités", href: "/news/actualites" },
      { name: "Publications", href: "/news/publications" },
      { name: "Multimedia", href: "/news/multimedia" },
      { name: "Events", href: "/news/events" }
    ]
  },

  // Contact
  {
    name: "Contact",
    href: "/contact"
  }
];
