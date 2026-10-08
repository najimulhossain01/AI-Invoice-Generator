import { Icon } from "lucide-react";


const InputField = ({ icon: Icon, label, name, ...props }) => {
    return (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1">
                {label}
            </label>
            <div className="relative">
                {Icon && <div className="absolute left-0 inset-y-0 flex items-center pl-3 pointer-events-none">
                    <Icon className="w-5 h-5 text-slate-400" />
                </div>}
                <input
                    id={name}
                    name={name}
                    {...props}
                    className={`w-full h-10 pr-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-transparent ${Icon ? "pl-10" : "pl-3"}`}
                />
            </div>
        </div>
    );
};

export default InputField;