import { useState } from 'react'
import { ChevronDown } from 'lucide-react';
import { FAQS } from '../../utils/data.js';

const Faqs = () => {
    const [openFaqIndex, setOpenFaqIndex] = useState(null);

    const handleClick = (index) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    };

    return <section id="faq" className="py-20 lg:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl text-gray-900 font-extrabold mb-4">
                    Frequently Asked Questions
                </h2>
                <p className="text-xl max-w-3xl mx-auto text-gray-600 mb-4">
                    Everything you need to know about the product and billing.
                </p>
            </div>
            <div className="flex flex-col gap-4">
                {FAQS.map((faq, index) => (
                    <div key={index} className="border border-gray-200 rounded-xl px-6 py-4 hover:border-blue-200 hover:bg-gray-50 transition-all duration-200 cursor-pointer">
                        <button
                            onClick={() => handleClick(index)}
                            className="w-full flex justify-between items-center text-left focus:outline-none"
                        >
                            <span className={`text-lg font-medium pr-4 ${openFaqIndex === index ? 'text-black' : 'text-gray-900'}`}>
                                {faq.question}
                            </span>
                            <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${openFaqIndex === index ? 'rotate-180 text-black' : 'text-gray-400'}`} />
                        </button>
                        {openFaqIndex === index && (
                            <p className="mt-2 border-t border-gray-200 pt-4 pb-2 text-base text-gray-600 leading-relaxed animate-fade-in">
                                {faq.answer}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    </section>
}

export default Faqs
