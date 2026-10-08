import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfileDropdown = ({
    isOpen,
    onToggle,
    avatar,
    companyName,
    email,
    onLogout,
}) => {

    const navigate = useNavigate();

    return (
        <div className="relative">
            <button
                onClick={onToggle}
                className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 transition-colors duration-200"
            >
                {avatar ? (
                    <img
                        src={avatar}
                        alt="Avatar"
                        className="h-9 w-9 object-cover rounded-xl"
                    />
                ) : (
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                            {companyName?.charAt(0)?.toUpperCase()}
                        </span>
                    </div>
                )}
                <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-900">{companyName}</p>
                    <p className="text-xs text-gray-500">{email}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border-gray-100 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{companyName}</p>
                        <p className="text-xs text-gray-500">{email}</p>
                    </div>

                    <a
                        onClick={() => navigate('/profile')}
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                        View Profile
                    </a>
                    <div className="border-t border-gray-100 mt-2 pt-2">
                        <a
                            onClick={onLogout}
                            className="block px-4 py-3 text-sm text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                            Signout
                        </a>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ProfileDropdown;