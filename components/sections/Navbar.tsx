"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Cupping", href: "#cupping" },
    { label: "Services", href: "#services" },
    { label: "Availability", href: "#availability" },
    { label: "FAQ", href: "#faq" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl h-20 items-center justify-between px-6 md:px-12">
        {/* Brand Logo */}
        <a href="#home" className="flex flex-col select-none">
          <span className="font-serif text-2xl font-bold tracking-tight text-deep-olive dark:text-soft-sage">
            Hijama by Shanu
          </span>
          <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-sans font-medium">
            Traditional Care • Personal Attention
          </span>
        </a>

        {/* Navigation Toggle (all screens) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2.5 text-deep-olive dark:text-soft-sage hover:bg-muted/50 rounded-full transition-colors cursor-pointer"
          aria-label={isOpen ? "Close Menu" : "Open Menu"}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Dynamic Dropdown Menu Panel (all screens) */}
      {isOpen && (
        <div className="absolute top-20 right-6 md:right-12 w-72 rounded-3xl border border-border bg-background p-6 shadow-xl flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-200">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-base font-medium text-foreground/80 hover:text-deep-olive transition-colors py-1.5 border-b border-border/20 last:border-0"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <a 
            href="#availability" 
            onClick={() => setIsOpen(false)}
            className="group/button inline-flex shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/80 h-11 px-6 text-sm font-semibold whitespace-nowrap transition-all outline-none select-none cursor-pointer w-full text-center"
          >
            Book Appointment
          </a>
        </div>
      )}
    </header>
  );
}
