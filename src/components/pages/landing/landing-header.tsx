import { CvDownloadButton } from "@/components/pages/landing/cv-download";

interface NavItem {
  href: string;
  label: string;
}

export function LandingHeader({ navItems }: { navItems: NavItem[] }) {
  return (
    <header className="bg-card/85 sticky top-0 z-20 -mx-5 px-5 py-4 font-mono backdrop-blur sm:px-8 md:px-10 xl:-mx-10">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <div className="text-primary rounded-full text-lg font-bold tracking-wider uppercase">{"<DB/>"}</div>
          <span className="text-primary hidden text-xs tracking-[0.2em] uppercase sm:block">Full-Stack Developer</span>
        </div>
        <nav className="text-foreground hidden items-center gap-3 md:flex lg:gap-5">
          {navItems.map((item, index) => (
            <a
              key={item.href}
              href={item.href}
              className="hover:text-primary text-muted-foreground text-xs transition-colors lg:text-sm"
            >
              <span className="text-primary">{(index + 1).toString().padStart(2, "0")}.</span>{" "}
              <span className="block whitespace-nowrap lg:inline">{item.label}</span>
            </a>
          ))}
          <CvDownloadButton label="Curriculum" variant="outline" />
        </nav>
        <CvDownloadButton
          label="CV"
          className="border-primary/50 bg-primary/10 text-primary hover:border-primary hover:bg-primary/20 inline-flex items-center gap-2 rounded-full border px-4 py-2 transition-colors md:hidden"
        />
      </div>
    </header>
  );
}
