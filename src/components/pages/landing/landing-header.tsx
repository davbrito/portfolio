import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface NavItem {
  href: string;
  label: string;
}

export function LandingHeader({ navItems }: { navItems: NavItem[] }) {
  return (
    <header className="bg-card/85 sticky top-0 z-20 -mx-5 px-5 py-4 font-mono backdrop-blur sm:-mx-8 sm:px-8 md:-mx-10 md:px-10">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-primary rounded-full text-lg font-bold tracking-wider uppercase">
            {"<DB/>"}
          </div>
          <span className="text-primary hidden text-xs tracking-[0.2em] uppercase sm:block">
            Full-Stack Developer
          </span>
        </div>
        <nav className="text-foreground hidden items-center gap-5 md:flex">
          {navItems.map((item, index) => (
            <a
              key={item.href}
              href={item.href}
              className="hover:text-primary text-muted-foreground text-sm transition-colors"
            >
              <span className="text-primary">
                {(index + 1).toString().padStart(2, "0")}.
              </span>{" "}
              {item.label}
            </a>
          ))}
          <Button asChild variant="outline">
            <a href="/curriculum.pdf">
              <Download className="h-4 w-4" />
              Curriculum
            </a>
          </Button>
        </nav>
        <Button
          asChild
          className="border-primary/50 bg-primary/10 text-primary hover:border-primary hover:bg-primary/20 inline-flex items-center gap-2 rounded-full border px-4 py-2 transition-colors md:hidden"
        >
          <a href="/curriculum.pdf">
            <Download className="h-4 w-4" />
            CV
          </a>
        </Button>
      </div>
    </header>
  );
}
