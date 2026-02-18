"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PageHeroProps {
    title: string;
    subtitle?: string;
    image?: string;
    className?: string;
}

export function PageHero({ title, subtitle, image, className }: PageHeroProps) {
    return (
        <div className={cn("relative min-h-[70vh] flex items-center justify-center overflow-hidden", className)}>
            {/* Background Image with Parallax effect */}
            <div className="absolute inset-0 z-0">
                {image && (
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed transform scale-105"
                        style={{ backgroundImage: `url(${image})` }}
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-background" />
            </div>

            {/* Content */}
            <div className="container relative z-10 px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-4xl mx-auto space-y-6"
                >
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-white tracking-tight drop-shadow-lg">
                        {title}
                    </h1>
                    {subtitle && (
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="text-lg md:text-2xl text-white/90 font-light leading-relaxed max-w-2xl mx-auto drop-shadow-md"
                        >
                            {subtitle}
                        </motion.p>
                    )}

                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="w-24 h-1 bg-primary mx-auto rounded-full mt-8"
                    />
                </motion.div>
            </div>

            {/* Scroll indicator maybe? Or decorative element */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        </div>
    );
}
