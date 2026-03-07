'use client';

export default function imageLoader({ src, width, quality }) {
  // If it's already a full URL, return it as-is without Next.js optimization
  if (src.startsWith('http')) {
    return src;
  }
  
  // For relative paths, use the default Next.js loader
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality || 75}`;
}
