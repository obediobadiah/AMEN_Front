"use client";

import { motion } from "framer-motion";
import { images } from "@/lib/images";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslations } from 'next-intl';

export function Hero() {
  const t = useTranslations();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      image: images.heroHome,
      title: t('hero.slide1.title'),
      highlight: t('hero.slide1.highlight'),
      description: t('hero.slide1.description'),
      cta: t('hero.slide1.cta')
    },
    {
      id: 2,
      image: images.programNature,
      title: t('hero.slide2.title'),
      highlight: t('hero.slide2.highlight'),
      description: t('hero.slide2.description'),
      cta: t('hero.slide2.cta')
    },
    {
      id: 3,
      image: images.heroHome, // Replace with appropriate image
      title: t('hero.slide3.title'),
      highlight: t('hero.slide3.highlight'),
      description: t('hero.slide3.description'),
      cta: t('hero.slide3.cta')
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]); // Added dependency

  return (
    <section className="relative h-screen min-h-[700px] w-full overflow-hidden">
      {/* Slides */}
      <div className="absolute inset-0 flex transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
        {slides.map((slide, index) => (
          <div key={slide.id} className="w-full flex-shrink-0 h-full relative">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url("${slide.image}")`,
                backgroundPosition: 'center center',
                backgroundSize: 'cover'
              }}
            />
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50" />
          </div>
        ))}
      </div>

      {/* Side Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white transition-all group"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6 group-hover:scale-110 transition-transform" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white transition-all group"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6 group-hover:scale-110 transition-transform" />
      </button>

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <motion.span
                className="inline-block py-2.5 px-6 rounded-full bg-primary/20 text-primary border border-primary/30 text-sm font-medium uppercase tracking-wider backdrop-blur-sm mb-6"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                {t('hero.badge')}
              </motion.span>

              <motion.h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-7xl font-heading font-bold leading-tight text-white"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                {slides[currentSlide].title}{' '}
                <motion.span
                  className="text-white italic"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                >
                  {slides[currentSlide].highlight}
                </motion.span>
              </motion.h1>

              <motion.p
                className="text-lg md:text-xl text-white leading-relaxed max-w-2xl mx-auto mt-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                {slides[currentSlide].description}
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <Button
                  size="lg"
                  className="rounded-full text-base px-8 h-14 bg-primary hover:bg-primary/90 border-none shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group"
                >
                  {slides[currentSlide].cta}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full text-base px-8 h-14 border-white/30 text-white hover:bg-white/10 hover:border-white/50 bg-white/5 backdrop-blur-sm group"
                >
                  <Play className="mr-2 h-5 w-5 fill-current group-hover:scale-110 transition-transform" />
                  {t('hero.watchVideo')}
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom Slide Indicators */}
      <div className="absolute bottom-8 left-0 right-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div className="flex gap-3 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${currentSlide === index
                    ? 'bg-primary w-8'
                    : 'bg-white/50 w-3 hover:bg-white/70'
                    }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}