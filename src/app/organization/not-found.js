'use client';

import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Globe } from "@/components/ui/globe";

export default function NotFound() {
  const pathname = usePathname();
  const attemptedRoute = pathname.split('/').pop();

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center gap-6 overflow-hidden">
      {/* Background Globe */}
      <div className="absolute inset-0 flex items-start justify-center opacity-60 dark:opacity-40 -translate-y-[30%]">
        <Globe className="scale-[2] animate-float" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.8),rgba(255,255,255,0))] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.5),rgba(0,0,0,0))]" />
      </div>

      {/* Content */}
      <div className="relative z-10 space-y-8 text-center px-4">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-7xl md:text-9xl font-bold bg-gradient-to-b from-foreground via-70% via-primary/90 to-muted-foreground bg-clip-text text-transparent animate-gradient-shift">
            404
          </h1>
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Onboarding Not Found
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground backdrop-blur-sm">
            Couldn't find onboarding path{attemptedRoute && `: ${attemptedRoute}`}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            asChild 
            size="lg" 
            className="gap-2 hover:scale-[1.02] transition-all hover:shadow-lg"
          >
            <Link href="/" className="group">
              <span className="group-hover:-translate-x-1 transition-transform">←</span>
              Return Home
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </Button>
          <Button 
            variant="outline" 
            asChild 
            size="lg"
            className="hover:scale-[1.02] transition-all hover:shadow-lg"
          >
            <Link href="/dashboard" className="flex items-center gap-2 group">
              Go to Dashboard
              <span className="group-hover:translate-x-1 transition-transform">→</span>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-l from-transparent via-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(120,120,120,0.1),transparent_70%)] dark:bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.05),transparent_70%)]" />
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary/50 animate-ping" />
    </div>
  );
}