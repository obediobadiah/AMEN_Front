import { HandHeart, Leaf, Users, Droplets, Globe, Heart, ShieldCheck, Newspaper } from "lucide-react";
import { images } from "./images";

export const programs = [
  {
    id: 1,
    title: "Accueil humanitaire et services sociaux de base",
    description: "Fourniture d'une assistance humanitaire et de services sociaux essentiels aux communautés vulnérables.",
    image: images.programWomen,
    category: "Humanitaire",
    raised: 18000,
    goal: 30000,
    icon: HandHeart
  },
  {
    id: 2,
    title: "Agriculture durable et conservation de la nature",
    description: "Promotion de pratiques agricoles durables et protection de l'environnement pour un avenir plus vert.",
    image: images.programNature,
    category: "Environnement",
    raised: 12000,
    goal: 35000,
    icon: Leaf
  },
  {
    id: 3,
    title: "Logistique, commerce équitable et chaînes de valeur",
    description: "Développement de chaînes d'approvisionnement équitables et durables pour les producteurs locaux.",
    image: images.programWater,
    category: "Développement",
    raised: 25000,
    goal: 50000,
    icon: Globe
  },
  {
    id: 4,
    title: "Leadership féminin et participation citoyenne",
    description: "Renforcement du leadership des femmes et de leur participation active dans la vie communautaire.",
    image: images.news1,
    category: "Égalité",
    raised: 15000,
    goal: 40000,
    icon: Users
  },
  {
    id: 5,
    title: "Protection et défense de la personne humaine",
    description: "Défense des droits humains et protection des personnes vulnérables dans nos communautés.",
    image: images.news2,
    category: "Droits Humains",
    raised: 30000,
    goal: 60000,
    icon: ShieldCheck
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
