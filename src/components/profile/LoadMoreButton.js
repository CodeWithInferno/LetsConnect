// components/profile/LoadMoreButton.js
"use client";

export default function LoadMoreButton({ onClick }) {
  return (
    <button 
      className="col-span-1 md:col-span-2 p-4 border-2 border-dashed rounded-lg hover:border-primary/30 hover:bg-accent/10 transition-colors"
      onClick={onClick}
    >
      <div className="text-center text-muted-foreground text-sm">
        Load More
      </div>
    </button>
  );
}