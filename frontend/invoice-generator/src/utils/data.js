import { BarChart2, FileText, LayoutDashboard, Mail, Plus, Sparkles, Users } from "lucide-react";
import JD_IMG from "../assets/jd-img.png";
import JS_IMG from "../assets/js-img.png";
import PJ_IMG from "../assets/pj-img.png";

export const FEATURES = [
    {
        icon: Sparkles,
        title: "AI Invoice Creation",
        description: "Paste any text, email, or document to let our AI instantly generate complete, professional invoices for you.",
    },
    {
        icon: BarChart2,
        title: "AI-Powered Dashboard",
        description: "Get smart, actionable insights about your business finance, generate automaticaly by our AI analytics.",
    },
    {
        icon: Mail,
        title: "Smart Reminders",
        description: "Automatically generate polite and effective payment remainder emails for overdue invoices with a single click.",
    },
    {
        icon: FileText,
        title: "Easy Invoice Management",
        description: "Easily manage all your invoices, track payments, and send reminders for overdue payments from a single intuitive dashboard.",
    },

];

export const TESTIMONIALS = [
    {
        quote: "This app save me hours of works. I can now create invoices in minutes.",
        author: "John Doe",
        title: "Freelance Designer",
        avatar: JD_IMG,
    },
    {
        quote: "The best invoice app I ever used. Simple, instutive, and very fast and also powerful.",
        author: "Jane Smith",
        title: "Small Business Owner",
        avatar: JS_IMG,
    },
    {
        quote: "I love the dashboard and reporting features. It helps me to manage my finance easily.",
        author: "Peter Jones",
        title: "Consultant",
        avatar: PJ_IMG,
    },
];

// FAQ questions and answer will be updated later remind it.....

export const FAQS = [
    {
        question: "How does the AI Invoice creation works?",
        answer: "Simply paste any text that contains invoice details-like email, service description, and client information - and our AI will instantly generate a complete, professional invoice for you.",
    },
    {
        question: "Is there any free trial available?",
        answer: "Yes! We offer a free trial for 14 days. You can create up to 10 invoices and 5 payment reminders during the free trial.",
    },
    {
        question: "Can I change my plan later?",
        answer: "Yes! You can change your plan at any time. Simply go to the billing section and select the plan that best suits your needs.",
    },
    {
        question: "What is your cancellation policy?",
        answer: "You can cancel your subscription at any time. Simply go to the billing section and click on the cancel subscription button.",
    },
    {
        question: "Can other info be added to an invoice?",
        answer: "Yes! You can add other information to an invoice by editing the invoice after it has been generated. Simply go to the invoices section and click on the edit button to add or remove any information you need.",
    },
    {
        question: "How does billing work?",
        answer: "We accept Visa, Mastercard, American Express, Discover, JCB, and PayPal. All payments are processed securely through Stripe.",
    },
    {
        question: "How do I change my account email?",
        answer: "You can change your email from your profile setting page.",
    }
];

// Navigation items configuration

export const NAVIGATION_MENU = [
    {
        id: "dashboard",
        name: "Dashboard",
        icon: LayoutDashboard
    },
    {
        id: "invoices",
        name: "Invoices",
        icon: FileText
    },
    {
        id: "invoices/new",
        name: "Create Invoice",
        icon: Plus,
    },
    {
        id: "profile",
        name: "Profile",
        icon: Users,
    }
];