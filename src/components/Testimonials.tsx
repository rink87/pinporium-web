import React from "react";
import Image from "next/image";
import { testimonials } from "@/data/testimonials";

const Testimonials: React.FC = () => {
  return (
    <div className="grid gap-14 max-w-lg w-full mx-auto lg:gap-10 lg:grid-cols-3 lg:max-w-full">
      {testimonials.map((testimonial, index) => (
        <div
          key={index}
          className="bg-white/70 border border-gold-deco/20 rounded-deco p-6 shadow-card"
        >
          <div className="flex items-center mb-4 w-full justify-center lg:justify-start">
            <Image
              src={testimonial.avatar}
              alt=""
              width={50}
              height={50}
              className="rounded-full shadow-deco border border-gold-deco/25 object-cover"
            />
            <div className="ml-4 text-left">
              <h3 className="text-lg font-display font-semibold text-navy">
                {testimonial.name}
              </h3>
              <p className="text-sm text-foreground-accent font-body">
                {testimonial.role}
              </p>
            </div>
          </div>
          <p className="text-foreground-accent text-center lg:text-left font-body leading-relaxed">
            &ldquo;{testimonial.message}&rdquo;
          </p>
        </div>
      ))}
    </div>
  );
};

export default Testimonials;
