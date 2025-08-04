"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CategoryHeroCarouselProps {
  images: string[];
  title: string;
  description: string;
  category: string;
}

export function CategoryHeroCarousel({ images, title, description, category }: CategoryHeroCarouselProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-scroll functionality
  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      if (!isHovered) {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [images.length, isHovered]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <section 
      className="relative h-[400px] sm:h-[500px] md:h-[600px] lg:h-[600px] flex items-center justify-center overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0">
        {/* Category Hero Images - Responsive sizing for different devices */}
        <img 
          src={images[currentImageIndex] || "/placeholder.svg"} 
          alt={title} 
          className="h-full w-full object-cover transition-opacity duration-1000" 
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
          style={{
            objectPosition: 'center center',
            minHeight: '100%',
            minWidth: '100%'
          }}
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Navigation Arrows - Only show if multiple images */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-1 sm:p-2 hover:bg-black/70 transition-all opacity-100 z-20"
          >
            <ChevronLeft className="h-3 w-3 sm:h-6 sm:w-6" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-1 sm:p-2 hover:bg-black/70 transition-all opacity-100 z-20"
          >
            <ChevronRight className="h-3 w-3 sm:h-6 sm:w-6" />
          </button>
          
          {/* Image Dots Indicator */}
          <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1 sm:space-x-2 z-20">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${
                  index === currentImageIndex 
                    ? 'bg-white' 
                    : 'bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>
        </>
      )}

      <div className="relative z-10 text-center text-white px-4">
        <h1 className="font-playfair text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4">{title}</h1>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl mx-auto opacity-90">{description}</p>
      </div>
    </section>
  );
} 