import Header from "../../components/landing/Header.jsx";
import Hero from "../../components/landing/Hero.jsx";
import Features from "../../components/landing/Features.jsx";
import Testimonials from "../../components/landing/Testimonials.jsx";
import Faqs from "../../components/landing/Faqs.jsx";
import Footer from "../../components/landing/Footer.jsx";

const LandingPage = () => {
  return (
    <div className='bg-[#ffffff] text-gray-600'>
      <Header />
      <main>
        <Hero />
        <Features />
        <Testimonials />
        <Faqs />
        <Footer />
      </main>

    </div>
  )
};

export default LandingPage;
