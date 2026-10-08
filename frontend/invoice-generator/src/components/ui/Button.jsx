import { Loader2 } from "lucide-react";

const Button = ({
    children,
    onClick,
    disabled,
    className,
    variant = "primary",
    size = "medium",
    isLoading = false,
    icon: Icon,
    ...props }) => {

    const baseStyle = "inline-flex items-center justify-center font-medium rounded-lg transition-acolors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

    const varientClasses = {
        primary: "bg-blue-900 hover:bg-blue-800 text-white",
        secondary: "border border-slate-200 bg-white hover:bg-slate-50 text-slate-700",
        ghost: "bg-transparent border-transparent hover:bg-slate-50 text-slate-700",
    };

    const sizeClasses = {
        small: "px-3 py-1.5 h-8 text-sm",
        medium: "px-4 py-2 h-10 text-sm",
        large: "px-6 py-3 h-12 text-base",
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled || isLoading}
            className={`${baseStyle} ${varientClasses[variant]} ${sizeClasses[size]} ${className || ""}`}
            {...props}
        >
            {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
                <>
                    {Icon && <Icon className="w-4 h-4 mr-2" />}
                    {children}
                </>
            )}
        </button>
    )
}

export default Button;