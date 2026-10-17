import React from "react";
import { GovernmentBanner } from "@/components/layout/GovernmentBanner";
import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeatureSection } from "@/components/landing/FeatureSection";
import { BenefitsSection } from "@/components/landing/BenefitsSection";
import { StatisticsSection } from "@/components/landing/StatisticsSection";
import { AboutSection } from "@/components/landing/AboutSection";
import { ContactSection } from "@/components/landing/ContactSection";
import { Footer } from "@/components/layout/Footer";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <GovernmentBanner />
      <Navbar />
      <main id="main-content" className="flex-1">
        <HeroSection />
        <FeatureSection />
        <BenefitsSection />
        <StatisticsSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
