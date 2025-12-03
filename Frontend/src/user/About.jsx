import React, { useRef, useEffect, useState } from 'react';
import { ChefHat, Leaf, HeartHandshake, X, MapPin, Package } from 'lucide-react';

const useFadeIn = (ref) => {
  useEffect(() => {
    const node = ref.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1, 
      }
    );

    if (node) {
      observer.observe(node);
    }

    return () => {
      if (node) {
        observer.unobserve(node);
      }
    };
  }, [ref]);
};

// Skeleton Loader Component
const SkeletonLoader = ({ count = 1, className = '' }) => {
  return (
    <>
      {[...Array(count)].map((_, index) => (
        <div key={index} className={`animate-pulse bg-gray-200 rounded-lg ${className}`}></div>
      ))}
    </>
  );
};

// Main AboutUs component
function About() {
  const introRef = useRef(null);
  const philosophyRef = useRef(null);
  const locationsRef = useRef(null);
  const closingRef = useRef(null);

  // State to control the visibility of the menu, booking, and delivery modals
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);

  // State for loading and data
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({
    menu: { appetizers: [], mains: [], desserts: [] },
    locations: []
  });

 


  // Simulate data fetching
  useEffect(() => {
    // Simulate a network delay
    const fetchData = setTimeout(() => {
      setData({
        menu: {
          appetizers: [
            { name: "Bruschetta", description: "Toasted bread with fresh tomatoes, garlic, basil, and olive oil.", price: "$12.00" },
            { name: "Caprese Skewers", description: "Cherry tomatoes, mozzarella, and basil drizzled with balsamic glaze.", price: "$10.50" },
          ],
          mains: [
            { name: "Pesto Pasta", description: "Handmade pasta with creamy basil pesto and parmesan cheese.", price: "$22.00" },
            { name: "Seared Salmon", description: "Pan-seared salmon with a lemon-dill sauce and roasted asparagus.", price: "$28.00" },
            { name: "Mushroom Risotto", description: "Creamy arborio rice with wild mushrooms and truffle oil.", price: "$24.00" },
          ],
          desserts: [
            { name: "Tiramisu", description: "Classic Italian dessert with coffee-soaked ladyfingers and mascarpone cream.", price: "$9.00" },
            { name: "Chocolate Lava Cake", description: "Warm chocolate cake with a molten center, served with vanilla ice cream.", price: "$11.00" },
          ],
        },
        locations: [
          { id: 1, name: "Downtown Bistro", address: "123 Main Street, Cityville", phone: "(555) 123-4567" },
          { id: 2, name: "Uptown Terrace", address: "456 Park Avenue, Metropolis", phone: "(555) 987-6543" },
          { id: 3, name: "Coastal Cafe", address: "789 Ocean Drive, Seaside", phone: "(555) 246-8109" },
        ],
      });
      setIsLoading(false);
    }, 2000); // 2-second loading delay

    return () => clearTimeout(fetchData);
  }, []);



  useFadeIn(introRef);
  useFadeIn(philosophyRef);
  useFadeIn(locationsRef);
  useFadeIn(closingRef);

  return (
    <section
      id="about"
      className="min-h-screen bg-white text-gray-800 font-lato pt-2 px-4 md:pt-4 md:px-10 lg:pt-6 lg:px-20"
    >
      <div className="container mx-auto">
        {/* Main hero section with image and text */}
        <div
          ref={introRef}
          className="bg-white rounded-2xl border-2 border-pink-200 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center p-6 md:p-10">
            {/* Image section */}
            <div className="order-2 lg:order-1">
              {isLoading ? (
                <SkeletonLoader className="w-full h-96" />
              ) : (
                <img
                  src="https://www.franciscosegarra.com/wp-content/uploads/2022/03/restaurant-decoration.jpg"
                  alt="A cozy, elegantly set bistro interior"
                  className="w-full h-[420px] object-cover rounded-xl border border-pink-100"
                />
              )}
            </div>

            {/* Text content section */}
            <div className="order-1 lg:order-2 text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-pink-700 mb-4 tracking-tight leading-tight">
                {isLoading ? (
                  <SkeletonLoader className="h-10 w-full mb-4" />
                ) : (
                  "Where Culinary Passion Meets Perfection"
                )}
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                {isLoading ? (
                  <SkeletonLoader count={2} className="h-4 w-full mb-2" />
                ) : (
                  "At Bistrofy, we're dedicated to crafting unforgettable dining experiences. Whether you're joining us at one of our welcoming locations or enjoying our culinary creations delivered to your door, our commitment to fresh, locally sourced ingredients and exceptional flavors remains the same."
                )}
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                {isLoading ? (
                  <SkeletonLoader count={2} className="h-4 w-full mb-2" />
                ) : (
                  "Our menu is a celebration of global influences and local traditions, designed to delight every palate. From our family-friendly bistro settings to our seamless online ordering, we ensure every interaction is warm, convenient, and truly special."
                )}
              </p>
            </div>
          </div>
        </div>


        <div ref={philosophyRef} className="mt-10 text-center">
          <h2 className="text-3xl font-bold text-pink-700 mb-8">Our Philosophy</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Mission Card */}
            <div className="bg-white p-6 rounded-xl border-2 border-pink-200">
              {isLoading ? (
                <>
                  <SkeletonLoader className="h-12 w-12 mx-auto mb-4" />
                  <SkeletonLoader className="h-6 w-3/4 mx-auto mb-2" />
                  <SkeletonLoader count={3} className="h-4 w-full mb-2" />
                </>
              ) : (
                <>
                  <div className="flex items-center justify-center text-pink-600 mb-4">
                    <ChefHat size={48} />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">Our Mission</h3>
                  <p className="text-gray-600 text-base leading-relaxed">
                    To consistently deliver fresh, delicious meals with outstanding service, creating an unforgettable dining experience for every guest, no matter where they are.
                  </p>
                </>
              )}
            </div>

            {/* Vision Card */}
            <div className="bg-white p-6 rounded-xl border-2 border-pink-200">
              {isLoading ? (
                <>
                  <SkeletonLoader className="h-12 w-12 mx-auto mb-4" />
                  <SkeletonLoader className="h-6 w-3/4 mx-auto mb-2" />
                  <SkeletonLoader count={3} className="h-4 w-full mb-2" />
                </>
              ) : (
                <>
                  <div className="flex items-center justify-center text-pink-600 mb-4">
                    <Leaf size={48} />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">Our Vision</h3>
                  <p className="text-gray-600 text-base leading-relaxed">
                    To create a space where people can connect over exceptional food, fostering memories that last a lifetime. We aim to be the city's favorite gathering spot.
                  </p>
                </>
              )}
            </div>

            {/* Commitment Card */}
            <div className="bg-white p-6 rounded-xl border-2 border-pink-200">
              {isLoading ? (
                <>
                  <SkeletonLoader className="h-12 w-12 mx-auto mb-4" />
                  <SkeletonLoader className="h-6 w-3/4 mx-auto mb-2" />
                  <SkeletonLoader count={3} className="h-4 w-full mb-2" />
                </>
              ) : (
                <>
                  <div className="flex items-center justify-center text-pink-600 mb-4">
                    <HeartHandshake size={48} />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">Our Commitment</h3>
                  <p className="text-gray-600 text-base leading-relaxed">
                    We are committed to sustainability and ethical sourcing, working closely with local farmers to reduce our environmental footprint and ensure quality.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Locations section */}
        <div
          ref={locationsRef}
          className="mt-10 text-center">
          <h2 className="text-3xl font-bold text-pink-700 mb-8">Our Locations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              [...Array(3)].map((_, index) => (
                <div key={index} className="bg-white p-6 rounded-xl border-2 border-pink-200">
                  <SkeletonLoader className="h-12 w-12 mx-auto mb-4" />
                  <SkeletonLoader className="h-6 w-3/4 mx-auto mb-2" />
                  <SkeletonLoader count={2} className="h-4 w-full mb-2" />
                </div>
              ))
            ) : (
              data.locations.map((location) => (
                <div key={location.id} className="bg-white p-6 rounded-xl border-2 border-pink-200">
                  <div className="flex items-center justify-center text-pink-600 mb-4">
                    <MapPin size={48} />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">{location.name}</h3>
                  <p className="text-gray-600 text-base leading-relaxed">{location.address}</p>
                  <p className="text-gray-600 text-base leading-relaxed mt-2 font-bold">{location.phone}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Closing section with call-to-action buttons */}
        <div
          ref={closingRef}
          className="mt-10 text-center">
          {isLoading ? (
            <>
              <SkeletonLoader className="h-6 w-2/3 mx-auto mb-8" />
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <SkeletonLoader className="h-12 w-48" />
                <SkeletonLoader className="h-12 w-48" />
                <SkeletonLoader className="h-12 w-48" />
              </div>
            </>
          ) : (
            <>
              <p className="text-lg text-gray-600 leading-relaxed mb-6 max-w-2xl mx-auto">
                Come experience the art of dining at Bistrofy — where every meal is crafted with care and served with a smile. We look forward to welcoming you at one of our locations or delivering to your door.
              </p>
              {/* Removed Show Menu and Order Now buttons as requested */}
            </>
          )}
        </div>
      </div>

      {/* Menu Modal */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-75">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white p-8 rounded-3xl shadow-2xl animate-fade-in-up"
            style={{
              scrollbarWidth: 'none',
              '-ms-overflow-style': 'none',
              '::-webkit-scrollbar': { width: '0' }
            }}
          >
            <button
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-pink-600 transition-colors duration-200">
              <X size={28} />
            </button>
            <h2 className="text-4xl font-extrabold text-pink-600 text-center mb-8">Our Menu</h2>

            {/* Appetizers section */}
            <div className="mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-pink-200">Appetizers</h3>
              {data.menu.appetizers.map((item, index) => (
                <div key={index} className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-xl font-semibold">{item.name}</h4>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </div>
                  <span className="font-bold text-pink-600 ml-4">{item.price}</span>
                </div>
              ))}
            </div>

            {/* Main Courses section */}
            <div className="mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-pink-200">Main Courses</h3>
              {data.menu.mains.map((item, index) => (
                <div key={index} className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-xl font-semibold">{item.name}</h4>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </div>
                  <span className="font-bold text-pink-600 ml-4">{item.price}</span>
                </div>
              ))}
            </div>

            {/* Desserts section */}
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-pink-200">Desserts</h3>
              {data.menu.desserts.map((item, index) => (
                <div key={index} className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-xl font-semibold">{item.name}</h4>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </div>
                  <span className="font-bold text-pink-600 ml-4">{item.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
    

      {/* Delivery Modal */}
      {isDeliveryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-75">
          <div className="relative w-full max-w-lg max-h-[90vh] bg-white p-8 rounded-3xl shadow-2xl text-center animate-fade-in-up"
            style={{
              scrollbarWidth: 'none',
              '-ms-overflow-style': 'none',
              '::-webkit-scrollbar': { width: '0' }
            }}
          >
            <button
              onClick={() => setIsDeliveryModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-pink-600 transition-colors duration-200">
              <X size={28} />
            </button>
            <div className="flex items-center justify-center text-pink-600 mb-6">
              <Package size={64} />
            </div>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Delivery Service</h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              We offer fast and reliable delivery directly to your door! While this is just a demo, you can easily integrate a real ordering system here.
            </p>
            <p className="text-base text-gray-500">
              (This is a placeholder for your ordering portal)
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

export default About;