import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FileText, Menu, X } from "lucide-react";
import ProfileDropdown from "../layout/ProfileDropdown.jsx";
import Button from "../ui/Button.jsx";
import { useAuth } from "../../context/AuthContext.jsx";


const Header = () => {

    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

    const { isAuthenticated, user, logout } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            const scrolled = window.scrollY > 10;
            setIsScrolled(scrolled);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);


    return (
        <header
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-white/95 backdrop-blur-sm shadow-lg" : "bg-white/0"}`}
        >

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 lg:h-20">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-900 rounded-md flex items-center justify-center">
                            <FileText className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-xl font-semibold text-gray-900">
                            AI Invoice App
                        </span>
                    </div>
                    <div className="hidden lg:flex lg:items-center lg:space-x-8">
                        <a
                            href="#features"
                            className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-black after:transition-all hover:after:w-full"
                        >Features</a>
                        <a
                            href="#testimonials"
                            className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-black after:transition-all hover:after:w-full"
                        >Testimonials</a>
                        <a
                            href="#faq"
                            className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-black after:transition-all hover:after:w-full"
                        >FAQ</a>
                    </div>
                    <div className="hidden lg:flex items-center space-x-4">
                        {isAuthenticated ? (
                            <ProfileDropdown
                                isOpen={profileDropdownOpen}
                                onToggle={(e) => {
                                    e.stopPropagation();
                                    setProfileDropdownOpen(!profileDropdownOpen);
                                }}
                                avatar={user?.avatar || ""}
                                companyName={user?.name || ""}
                                email={user?.email || ""}
                                onLogout={logout}
                            />
                        ) : (
                            <><Link to="/login" className="text-black hover:text-gray-900 font-medium transition-colors duration-200">
                                Login
                            </Link>
                                <Link to="/signup" className="bg-gradient-to-r from-blue-950 to-blue-900 hover:bg-gray-800 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg">
                                    Signup
                                </Link>
                            </>
                        )}
                    </div>
                    <div className="lg:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
                        >
                            {isMenuOpen ? (<X className="w-6 h-6" />) : (<Menu className="w-6 h-6" />)}
                        </button>
                    </div>
                </div>
            </div>

            {/* mobile menu */}
            {
                isMenuOpen && (
                    <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-lg lg:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-2 sm:px-4">
                            <a
                                href="#features"
                                className="block px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium transition-colors duration-200"
                            >
                                Features
                            </a>
                            <a
                                href="#testimonials"
                                className="block px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium transition-colors duration-200"
                            >
                                Testimonials
                            </a>
                            <a
                                href="#faq"
                                className="block px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium transition-colors duration-200"
                            >
                                FAQ
                            </a>
                            <div className="border-t border-gray-200 my-2"></div>
                            {isAuthenticated ? (
                                <div className="p-4">
                                    <Button
                                        onClick={() => navigate('/dashboard')}
                                        className="w-full"
                                    >
                                        Go to Dashboard
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="block px-4 py-3 text-gray-600 hover:bg-gray-50 font-medium transition-colors duration-200"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="block w-full text-left bg-gray-900 hover:bg-gray-800 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200"
                                    >
                                        Signup
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )
            }

        </header>
    )
}

export default Header