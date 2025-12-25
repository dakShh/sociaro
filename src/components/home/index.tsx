
import Header from './header';
import Footer from './footer';

import StatsSection from './stats-section';
import FeaturesSection from './features-section';
import HeroSection from './hero-section';
import BenefitsSection from './benefits-section';
import Testimonials from './testimonials';
import FaqSection from './faq-section';

import { Cta1 } from './ctas';
import { AnimatedBackground } from './animated-components';

// import Pricing from './pricing';

export default function Homepage() {
    return (
        <div className="min-h-screen bg-[#fafafa] text-gray-900 overflow-hidden">
            <AnimatedBackground />  {/* Animated Background Orbs */}
            <Header /> {/* Sticky Navigation */}
            <HeroSection /> {/* Hero Section */}
            <StatsSection />{/* Stats Section */}
            <FeaturesSection />{/* Features Section */}
            <BenefitsSection />{/* Benefits Section */}
            <Testimonials />{/* Testimonials */}
            <FaqSection /> {/* FAQ */}
            <Cta1 />    {/* Final CTA */}
            <Footer /> {/* Footer */}
            {/* <Pricing /> Pricing*/}
        </div>
    );
}