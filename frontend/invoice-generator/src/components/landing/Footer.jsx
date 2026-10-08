import { Link } from "react-router-dom"
import { FaXTwitter, FaGithub, FaLinkedinIn } from 'react-icons/fa6';
import { FileText } from 'lucide-react';

const FooterLink = ({ href, to, children }) => {
    const className = "block text-gray-400 hover:text-white transition-colors duration-200 py-1";
    if (to) {
        return <Link to={to} className={className}>{children}</Link>;
    }
    return <a href={href} className={className}>{children}</a>;
};

const SocialLink = ({ href, children }) => {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-900 text-white hover:bg-gray-700 transition-colors duration-300 w-10 h-10 flex items-center justify-center rounded-lg"
        >
            {children}
        </a>
    );
};

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Top grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="flex flex-col gap-4">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-900 rounded-lg flex items-center justify-center">
                                <FileText className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-lg font-bold text-white">AI Invoice App</span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            The simplest way to create and send professional invoices.
                        </p>
                    </div>

                    {/* Product */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Product</h3>
                        <ul className="flex flex-col gap-2">
                            <li><FooterLink to="/features">Features</FooterLink></li>
                            <li><FooterLink to="/testimonials">Testimonials</FooterLink></li>
                            <li><FooterLink to="/faq">FAQ</FooterLink></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Company</h3>
                        <ul className="flex flex-col gap-2">
                            <li><FooterLink to="/about">About Us</FooterLink></li>
                            <li><FooterLink to="/contact">Contact</FooterLink></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Legal</h3>
                        <ul className="flex flex-col gap-2">
                            <li><FooterLink to="/privacy">Privacy Policy</FooterLink></li>
                            <li><FooterLink to="/terms">Terms of Service</FooterLink></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-gray-400 text-sm">
                        &copy; 2026 AI Invoice App. All rights reserved.
                    </p>
                    <div className="flex items-center gap-3">
                        <SocialLink href="https://x.com/najimulhossaain">
                            <FaXTwitter className="w-4 h-4" />
                        </SocialLink>
                        <SocialLink href="https://github.com/najimulhossain01">
                            <FaGithub className="w-4 h-4" />
                        </SocialLink>
                        <SocialLink href="https://www.linkedin.com/in/sk-najimul-hossain-461703416/">
                            <FaLinkedinIn className="w-4 h-4" />
                        </SocialLink>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer