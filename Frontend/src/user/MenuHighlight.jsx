import React, { useState, useEffect } from 'react';

export default function MenuHighlight() {
  const foodImages = [
    {
      src: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2670&auto=format&fit=crop",
      alt: "A delicious hot and spicy pizza",
      caption: "Hot & Spicy Pizza"
    },
    {
      src: "https://images.stockcake.com/public/f/5/9/f59506e2-bd79-4839-a3f9-b90cdeac2273_large/sushi-roll-closeup-stockcake.jpg",
      alt: "Freshly made sushi rolls on a plate",
      caption: "Freshly Made Sushi"
    },
    {
      src: "https://img.freepik.com/premium-zdjecie/latajacy-hamburger-na-czarnym-tle-koncepcja-fast-food_798986-532.jpg",
      alt: "A gourmet burger with all the fixings",
      caption: "Gourmet Burger"
    },
    {
      src: "https://www.lifesambrosia.com/wp-content/uploads/Spaghetti-Pasta-Carbonara-Recipe-09.jpg",
      alt: "A plate of classic pasta carbonara",
      caption: "Creamy Pasta Carbonara"
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex =>
        (prevIndex + 1) % foodImages.length
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [foodImages.length]);

  const goToNext = () => {
    setCurrentIndex(prevIndex =>
      (prevIndex + 1) % foodImages.length
    );
  };

  const goToPrevious = () => {
    setCurrentIndex(prevIndex =>
      (prevIndex - 1 + foodImages.length) % foodImages.length
    );
  };

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };

  const currentImage = foodImages[currentIndex];

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-black p-4 font-inter">
      <h1 className="text-4xl md:text-5xl text-gray-800 mb-4 text-center drop-shadow-lg">
        Menu Highlights
      </h1>

      <div className="relative w-full max-w-3xl mx-auto rounded-3xl  overflow-hidden ">
        <div className="relative w-full h-[250px] md:h-[450px]">
          <img
            key={currentIndex}
            src={currentImage.src}
            alt={currentImage.alt}
            className="w-full h-full object-cover animate-fade-in-slide"
          />
          <div className="absolute inset-x-0 bottom-0 bg-black/50 backdrop-blur-md text-white p-4 text-center rounded-b-3xl">
            <p className="text-xl md:text-2xl font-bold tracking-wide drop-shadow-md">
              {currentImage.caption}
            </p>
          </div>
        </div>

        {/* Prev button */}
        <button
          onClick={goToPrevious}
          className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/40 transition-all duration-300 transform scale-95 hover:scale-100 focus:outline-none focus:ring-4 focus:ring-white/50 z-10"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Next button */}
        <button
          onClick={goToNext}
          className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/40 transition-all duration-300 transform scale-95 hover:scale-100 focus:outline-none focus:ring-4 focus:ring-white/50 z-10"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Navigation dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
          {foodImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-3 w-3 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
