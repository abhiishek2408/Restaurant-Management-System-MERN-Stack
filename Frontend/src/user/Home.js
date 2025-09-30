import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FeaturedMenu from "./FeaturedMenu";
import ChefSpecialMenu from "./ChefSpecialMenu";
import ContactInfo from "./ContactInfo";
import AIChat from "./AIChat";

import Appetizerb from "../image/appetizerb.png";
import DrinkMenurb from "../image/drinkmenurb.png";
import PastaImg from "../image/pastarb.png";
import RiceGrain from "../image/ricegrainrb.png";
import MeatDishesImg from "../image/meatdishesrb.png";
import SeafoodDishesImg from "../image/seafoodrb.png";
import CurryDishesImg from "../image/curryfoodrb.png";
import PizzaFlatbreadsImg from "../image/Pizzarb.png";
import BurgerSandwichesImg from "../image/burgersSandwichesrb.png";
import GrilledBBQ from "../image/grilledBBQrb.png";
import AsianDishesImg from "../image/asianDishesrb.png";
import VegetarianVegans from "../image/vegeterianVeganrb.png";
import MexicanDishesImg from "../image/mexicanDishesrb.png";

const categories = [
  { src: Appetizerb, label: "Appetizers", menu: "appetizers" },
  { src: Appetizerb, label: "Seasonal Menu", menu: "Seasonal Menu" },
  { src: DrinkMenurb, label: "Drinks Menu", menu: "drinks" },
  { src: PastaImg, label: "Pasta", menu: "pasta" },
  { src: RiceGrain, label: "Rice & Grains", menu: "rice" },
  { src: MeatDishesImg, label: "Meat Dishes", menu: "meat" },
  { src: SeafoodDishesImg, label: "Seafood Dishes", menu: "seafood" },
  { src: CurryDishesImg, label: "Curry Dishes", menu: "curry" },
  { src: PizzaFlatbreadsImg, label: "Pizza & Flatbreads", menu: "pizza" },
  { src: BurgerSandwichesImg, label: "Burgers & Sandwiches", menu: "burgers" },
  { src: GrilledBBQ, label: "Grilled & BBQ", menu: "grilled" },
  { src: AsianDishesImg, label: "Asian Dishes", menu: "asian" },
  { src: VegetarianVegans, label: "Vegetarian & Vegan", menu: "vegetarian" },
  { src: MexicanDishesImg, label: "Mexican Dishes", menu: "mexican" },
];

const SkeletonCard = () => (
  <div className="w-[100px] h-[130px] rounded-xl bg-gray-300 animate-pulse" />
);

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Simulate loading delay for demonstration
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-10 px-5 sm:px-10">
      {/* Banner */}
      <div className="bg-gradient-to-br from-pink-400 via-pink-300 to-pink-200 text-white p-4 sm:p-8 rounded-3xl shadow-2xl backdrop-blur-sm flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-8 md:gap-0">
  {/* Left Text */}
  <div className="max-w-lg space-y-2 sm:space-y-4 text-center md:text-left">
    <h1 className="text-3xl sm:text-6xl font-extrabold tracking-tight drop-shadow-lg">
      Delicious Bites
    </h1>
    <p className="text-sm sm:text-xl text-white/90 font-light">
      Your favourite restaurant is now online
    </p>
    <button
      onClick={() => navigate("/user/cart")}
      className="bg-white text-pink-600 font-semibold py-2 px-6 sm:py-3 sm:px-8 rounded-full shadow-lg hover:bg-pink-100 hover:text-pink-700 transition duration-300"
    >
      Order Now
    </button>
  </div>

  {/* Right Images */}
  <div className="flex flex-wrap justify-center gap-2 sm:space-x-4 mt-4 md:mt-0">
    {[Appetizerb, DrinkMenurb, PastaImg, RiceGrain, MeatDishesImg].map(
      (imgSrc, i) => (
        <img
          key={i}
          src={imgSrc}
          alt={`Category ${i}`}
          className="h-[60px] w-[60px] sm:h-[100px] sm:w-[100px] object-contain rounded-xl drop-shadow-md"
        />
      )
    )}
  </div>
</div>

      {/* Categories Grid */}
      <section className="mt-14">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800">Explore Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6">
          {loading
            ? // Show 8 skeleton cards while loading
              Array(8)
                .fill(0)
                .map((_, i) => <SkeletonCard key={i} />)
            : categories.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => navigate(`/user/menu/${item.menu}`)}
                  className="flex flex-col items-center justify-center space-y-2 p-3 rounded-xl shadow-md border border-transparent hover:border-pink-400 hover:shadow-lg transition duration-300 focus:outline-none focus:ring-4 focus:ring-pink-300"
                  type="button"
                >
                  <img
                    src={item.src}
                    alt={item.label}
                    className="w-16 h-16 object-contain rounded-lg"
                    loading="lazy"
                  />
                  <span className="text-sm font-light text-gray-700">{item.label}</span>
                </button>
              ))}
        </div>
      </section>

<FeaturedMenu/>
<ChefSpecialMenu/>
<ContactInfo/>
      <AIChat />

      {/* Footer */}

    </div>
  );
};

export default Home;
