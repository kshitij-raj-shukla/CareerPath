"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { isLoggedIn, logout } = useAppContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const links = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/profile", label: "Profile" },
    { href: "/assessment", label: "Assessment" },
    { href: "/prediction", label: "Prediction" },
    { href: "/roadmap", label: "Roadmap" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between gap-3">
          <div className="flex items-center gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold inline-block">CareerAI</span>
            </Link>

            {isLoggedIn && (
              <div className="hidden md:flex gap-6">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-medium transition-colors hover:text-foreground/80 ${
                      pathname === link.href ? "text-foreground" : "text-foreground/60"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <ThemeToggle />

            {isLoggedIn ? (
              <>
                <Button variant="ghost" onClick={logout} className="hidden md:inline-flex">
                  Logout
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                  aria-expanded={isMobileMenuOpen}
                  aria-controls="mobile-nav-menu"
                  onClick={() => setIsMobileMenuOpen((open) => !open)}
                >
                  {isMobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button>Login</Button>
              </Link>
            )}
          </div>
        </div>

        {isLoggedIn && isMobileMenuOpen && (
          <div id="mobile-nav-menu" className="md:hidden border-t border-border/50 pb-4 pt-3">
            <div className="flex flex-col gap-1.5">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? "bg-accent text-accent-foreground"
                      : "text-foreground/70 hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Button
                variant="ghost"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  logout();
                }}
                className="mt-1 justify-start px-3"
              >
                Logout
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
