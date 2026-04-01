import { Heart } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface LogoProps {
  className?: string;
  iconSize?: number;
  textSize?: string;
}

export default function Logo({ className, iconSize = 18, textSize = "text-xl" }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="w-8 h-8 bg-radiant-pink rounded-lg flex items-center justify-center text-white">
        <Heart size={iconSize} fill="currentColor" />
      </div>
      <span className={cn("font-serif font-bold tracking-tight", textSize)}>
        Radi<Heart className="inline-block mx-0.5 text-radiant-accent" size={iconSize - 2} fill="currentColor" />ntNess
      </span>
    </div>
  );
}
