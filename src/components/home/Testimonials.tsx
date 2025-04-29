
import React from 'react';

// Mock testimonial data
const testimonials = [
  {
    id: 1,
    quote: "The team at Prevost Marketplace made selling my H3-45 VIP an absolute breeze. Professional photography, targeted marketing, and a seamless transaction process. I couldn't be happier with the service.",
    author: "James Wilson",
    role: "Previous Owner, 2020 Prevost H3-45",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070"
  },
  {
    id: 2,
    quote: "After searching for months for the perfect entertainer coach, I found exactly what I needed on Prevost Marketplace. The detailed listings, high-quality photos, and transparent information made my decision easy.",
    author: "Sarah Johnson",
    role: "Purchased 2021 Marathon Show Coach",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2070"
  },
  {
    id: 3,
    quote: "As a touring musician, finding the right entertainer coach was crucial. The Prevost Marketplace team understood my specific needs and helped me find a coach that perfectly suited my touring requirements.",
    author: "Michael Rodriguez",
    role: "Professional Musician",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2070"
  }
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-dark to-black">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-playfair font-bold text-center mb-6">
          What Our Clients <span className="text-gold">Say</span>
        </h2>
        <p className="text-white/70 text-center max-w-2xl mx-auto mb-16">
          Don't just take our word for it. Here's what our clients have to say about their experience with Prevost Marketplace.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id}
              className="flex flex-col h-full bg-gradient-to-b from-white/5 to-transparent backdrop-blur-sm p-8 rounded-lg border border-white/10 hover:border-gold/50 transition-all"
            >
              <div className="mb-6">
                {/* Quote SVG */}
                <svg className="h-8 w-8 text-gold opacity-50" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                </svg>
              </div>
              <p className="flex-1 text-white/90 italic mb-6">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.author}
                  className="h-12 w-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-medium">{testimonial.author}</h4>
                  <p className="text-sm text-white/70">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
