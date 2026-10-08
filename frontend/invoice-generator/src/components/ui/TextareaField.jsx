import React from 'react'

const TextareaField = ({ icon: Icon, label, name, ...props }) => {
    return (
        <div>
            <label
                htmlFor={name}
                className="block text-sm font-medium text-slate-700 mb-1"
            >
                {label}
            </label>
            <div className="relative">
                {Icon && <div className="absolute top-3 left-0 flex items-center pl-3 pointer-events-none">
                    <Icon className="w-5 h-5 text-slate-400" />
                </div>}
                <textarea
                    id={name}
                    name={name}
                    rows={3}
                    {...props}
                    className={`w-full min-h-[100px] px-3 py-2 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 resize-vertical focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${Icon ? 'pl-10' : 'pl-3'}`}
                />
            </div>
        </div>
    );
};

export default TextareaField;