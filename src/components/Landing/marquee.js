import { cn } from "@/lib/utils";
import { Marquee } from "@/components/marquee";

const reviews = [
  {
    name: "Jack",
    username: "@jack",
    body: "This platform has completely changed the way I collaborate. Amazing!",
    img: "https://avatar.vercel.sh/jack",
  },
  {
    name: "Jill",
    username: "@jill",
    body: "I've met some of the best developers here. Truly an incredible experience.",
    img: "https://avatar.vercel.sh/jill",
  },
  {
    name: "John",
    username: "@john",
    body: "A game-changer for open-source contributions. Highly recommended!",
    img: "https://avatar.vercel.sh/john",
  },
  {
    name: "Jane",
    username: "@jane",
    body: "Love how seamless and intuitive the platform is. Great job!",
    img: "https://avatar.vercel.sh/jane",
  },
  {
    name: "Jenny",
    username: "@jenny",
    body: "This is where I found my first real project. Life-changing!",
    img: "https://avatar.vercel.sh/jenny",
  },
  {
    name: "James",
    username: "@james",
    body: "Finally, a platform that connects contributors and project managers the right way!",
    img: "https://avatar.vercel.sh/james",
  },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({ img, name, username, body }) => {
  return (
    <figure
      className={cn(
        "relative w-72 h-40 cursor-pointer overflow-hidden rounded-xl border p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg",
        // Light mode styles
        "border-gray-200 bg-white/10 hover:bg-white",
        // Dark mode styles
        "dark:border-gray-800 dark:bg-gray-900/90 dark:hover:bg-gray-900 dark:hover:border-gray-700"
      )}
    >
      <div className="flex items-center gap-4">
        <img
          className="rounded-full w-12 h-12 ring-2 ring-gray-100 text-white dark:ring-gray-800"
          alt={`${name}'s avatar`}
          src={img}
        />
        <div className="flex flex-col">
          <figcaption className="text-sm font-semibold text-gray-900 dark:text-gray-200">
            {name}
          </figcaption>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {username}
          </p>
        </div>
      </div>
      <blockquote className="mt-4 text-sm leading-relaxed text-gray-700 dark:text-gray-300 line-clamp-2 overflow-hidden">
        {body}
      </blockquote>
    </figure>
  );
};

export function MarqueeDemo() {
  return (
    <div className="relative flex flex-col gap-6 items-center justify-center w-full overflow-hidden py-8">
      {/* First Row (Left to Right) */}
      <Marquee pauseOnHover className="[--duration:40s] h-40">
        {firstRow.map((review) => (
          <div key={review.username} className="mx-2">
            <ReviewCard {...review} />
          </div>
        ))}
      </Marquee>
      {/* Second Row (Right to Left) */}
      <Marquee reverse pauseOnHover className="[--duration:40s] h-40">
        {secondRow.map((review) => (
          <div key={review.username} className="mx-2">
            <ReviewCard {...review} />
          </div>
        ))}
      </Marquee>
      {/* Fading Gradient Effect for Smooth Scroll */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-transparent"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-transparent"></div>
    </div>
  );
}