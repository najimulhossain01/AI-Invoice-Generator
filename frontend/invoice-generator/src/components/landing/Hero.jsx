import { Link } from "react-router-dom";
import HERO_IMG from "../../assets/hero-img.png";
import { useAuth } from "../../context/AuthContext";

const Hero = () => {
    const { isAuthenticated } = useAuth();

    return <section className="relative bg-[#fbfbfb] overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
            <div className="text-center max-w-4xl mx-auto">
                <h1 className="text-3xl sm:text-6xl md:text-6xl font-extrabold leading-tight text-blue-950 mb-6">
                    AI-Powered Invoicing , Made Effortless
                </h1>
                <p className="text-base sm:text-xl leading-relaxed max-w-3xl mx-auto text-gray-700 mb-8">
                    Let our AI create invoice from simple text , generate payment reminders , and provide smart insights to help you manage your finance.
                </p>
                <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
                    {isAuthenticated ? (
                        <Link to="/dashboard" className="bg-gradient-to-r from-blue-950 to-blue-900 text-white px-8 py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-blue-900 transition-all duration-200 hover:scale-105 hover:shadow-2xl transform">
                            Go to Dashboard
                        </Link>
                    ) : (

                        <Link to="/signup" className="bg-gradient-to-r from-blue-950 to-blue-900 text-white px-8 py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-gray-800 transition-all duration-200 hover:scale-105 hover:shadow-2xl transform">
                            Get Started for Free
                        </Link>
                    )}
                    <a href="#features" className="border-2 border-black text-black px-8 py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-white/10 hover:text-black transition-all duration-200 hover:scale-105">
                        Learn More
                    </a>
                </div>
                <div className="mt-12 sm:mt-16 relative max-w-5xl mx-auto">
                    <img src={HERO_IMG} alt="AI Invoice Generator" className="rounded-3xl shadow-2xl shadow-gray-300 border-4 border-gray-200/20" />
                </div>
            </div>
        </div>
    </section>
};

export default Hero;