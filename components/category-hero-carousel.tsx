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
      className="relative h-[600px] flex items-center justify-center overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0">
        {/* Category Hero Images - Required: 1200x600px (2:1 ratio) - Auto-scrolling carousel */}
        <img 
          src={images[currentImageIndex] || "/placeholder.svg"} 
          alt={title} 
          className="h-full w-full object-cover transition-opacity duration-1000" 
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Navigation Arrows - Only show if multiple images */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100 z-20"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100 z-20"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          
          {/* Image Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
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
        <Badge variant="secondary" className="mb-4 capitalize bg-white/20 text-white border-white/30">
          {category}
        </Badge>
        <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-4">{title}</h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90">{description}</p>
      </div>
    </section>
  );
} 