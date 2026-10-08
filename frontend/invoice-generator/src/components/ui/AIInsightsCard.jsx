import { useState, useEffect } from "react";
import { Lightbulb } from "lucide-react";
import axiosInstance from "../../utils/axiousInstance.js";
import { API_PATHS } from "../../utils/apiPaths";
const AIInsightsCard = () => {

    const [insights, setInsights] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInsights = async () => {
            try {
                const response = await axiosInstance.get(API_PATHS.AI.GET_DASHBOARD_SUMMARY);
                setInsights(response.data.insights || []);
            } catch (error) {
                console.error("Failed to fetch AI insights:", error);
                setInsights([]); // set empty array to avoid crash on rendering if API fails
            } finally {
                setLoading(false);
            }
        };
        fetchInsights();
    }, []);

    return (
        <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-sm shadow-gray-100">
            <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-5 h-5 text-yellow-500 mr-1" />
                <h3 className="text-lg font-semibold text-slate-800">AI Insights</h3>
            </div>
            {loading ? (
                <div className="mt-2 space-y-3">
                    <div className="h-4 bg-slate-200 rounded"></div>
                    <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                    <div className="h-4 bg-slate-200 rounded w-4/5"></div>
                </div>
            ) : (
                <ul className="ml-2 list-disc list-inside text-slate-700 space-y-3">
                    {insights.map((insight, index) => (
                        <li key={index} className="text-sm font-medium">{insight}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AIInsightsCard;