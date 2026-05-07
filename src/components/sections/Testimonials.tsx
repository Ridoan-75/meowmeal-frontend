import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Rahim Uddin",
    location: "Dhaka",
    rating: 5,
    comment:
      "MeowMeal is my go-to app for food delivery. The food always arrives hot and fresh. Amazing service!",
    avatar: "R",
  },
  {
    name: "Fatema Begum",
    location: "Chittagong",
    rating: 5,
    comment:
      "I love how easy it is to find restaurants and order food. The real-time tracking is a great feature.",
    avatar: "F",
  },
  {
    name: "Karim Hassan",
    location: "Sylhet",
    rating: 4,
    comment:
      "Great variety of restaurants. The AI recommendations helped me discover new dishes I love.",
    avatar: "K",
  },
  {
    name: "Nadia Islam",
    location: "Dhaka",
    rating: 5,
    comment:
      "Fast delivery and great food quality. MeowMeal has made my life so much easier!",
    avatar: "N",
  },
];

export function Testimonials() {
  return (
    <section className="py-16 bg-secondary/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Thousands of happy customers trust MeowMeal every day
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-4 hover:shadow-md transition-shadow"
            >
              {/* Stars */}
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < testimonial.rating
                        ? "fill-accent text-accent"
                        : "text-border"
                    }`}
                  />
                ))}
              </div>

              {/* Comment */}
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                {testimonial.comment}
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}