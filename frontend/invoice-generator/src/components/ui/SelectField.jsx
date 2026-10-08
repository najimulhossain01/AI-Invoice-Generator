

const SelectField = ({ label, name, options, ...props }) => {
    return (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1">
                {label}
            </label>
            <select
                id={name}
                name={name}
                {...props}
                className={`w-full h-10 pr-3 py-2 rounded-lg border bg-white border-slate-200 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-transparent`}
            >
                {options.map((option) => (
                    <option key={option.value || option} value={option.value || option}>
                        {option.label || option}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SelectField;