import React from 'react';

const products = [
  { id: 1, name: 'Men Round Neck Pure Cotton T-shirt', price: 80, image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500' },
  { id: 2, name: 'Men Full Formal Set', price: 72, image: 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=500' },
  { id: 3, name: 'Women Round Neck Cotton Top', price: 36, image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500' },
  { id: 4, name: 'Kids Casual Outfit', price: 32, image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=500' },
  { id: 5, name: 'Men Classic Black Formal Suit', price: 95, image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500' },
];

const LatestCollections = () => {
  return (
    <div className="my-10 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <div className="text-center py-8 text-3xl">
        <div className="inline-flex gap-2 items-center mb-3">
          <p className="text-gray-500 font-medium">LATEST <span className="text-gray-800 font-semibold">COLLECTIONS</span></p>
          <p className="w-8 sm:w-12 h-[1px] sm:h-[2px] bg-gray-700"></p>
        </div>
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
     Explore our new arrivals and find your perfect outfit today.
        </p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {products.map((item) => (
          <div key={item.id} className="text-gray-700 cursor-pointer">
            <div className="overflow-hidden bg-gray-100 rounded-sm">
              <img
                src={item.image}
                alt={item.name}
                className="hover:scale-110 transition ease-in-out duration-300 w-full h-64 object-cover"
              />
            </div>
            <p className="pt-3 pb-1 text-sm truncate">{item.name}</p>
            <p className="text-sm font-medium">${item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LatestCollections;