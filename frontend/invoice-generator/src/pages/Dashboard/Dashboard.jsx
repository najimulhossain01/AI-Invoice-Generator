import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiousInstance.js";
import { API_PATHS } from "../../utils/apiPaths";
import { Loader2, FileText, DollarSign, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import Button from "../../components/ui/Button";
import AIInsightsCard from "../../components/ui/AIInsightsCard";

const Dashboard = () => {

  const [stats, setStats] = useState({
    totalInvoices: 0,
    totalPaid: 0,
    totalUnpaid: 0,
  });
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.INVOICE.GET_ALL_INVOICES);
        const invoices = response.data;

        const totalInvoices = invoices.length;
        // Field is "total" in the Invoice model, NOT "amount"
        const totalPaid = invoices
          .filter((inv) => inv.status === "Paid")
          .reduce((acc, inv) => acc + (inv.total || 0), 0);
        const totalUnpaid = invoices
          .filter((inv) => inv.status === "Unpaid")
          .reduce((acc, inv) => acc + (inv.total || 0), 0);

        setStats({ totalInvoices, totalPaid, totalUnpaid });

        // Schema uses "dueDate" (camelCase), not "due_date"
        setRecentInvoices(
          [...invoices]
            .sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate))
            .slice(0, 5)
        );
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // colorClasses maps each color key → Tailwind bg and text classes
  const colorClasses = {
    blue: { bg: "bg-blue-100", text: "text-blue-600" },
    green: { bg: "bg-green-100", text: "text-green-600" },
    red: { bg: "bg-red-100", text: "text-red-600" },
  };

  const startData = [
    { icon: FileText, label: "Total Invoices", value: stats.totalInvoices, color: "blue" },
    { icon: DollarSign, label: "Total Paid", value: `$${stats.totalPaid.toFixed(2)}`, color: "green" },
    { icon: DollarSign, label: "Total Unpaid", value: `$${stats.totalUnpaid.toFixed(2)}`, color: "red" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Page heading */}
      <div>
        <h2 className="text-xl font-semibold text-slate-800">Dashboard</h2>
        <p className="text-slate-600 mt-1">A quick overview of your business finances.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {startData.map((stat, index) => (
          <div key={index} className="bg-white p-4 border border-slate-200 shadow-lg shadow-gray-100 rounded-xl">
            <div className="flex items-center">
              <div className={`flex-shrink-0 w-12 h-12 ${colorClasses[stat.color].bg} rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${colorClasses[stat.color].text}`} />
              </div>
              <div className="ml-4 min-w-0">
                <div className="text-sm font-medium text-slate-500 truncate">{stat.label}</div>
                <div className="text-2xl font-bold text-slate-900 break-words">{stat.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Insights */}
      <AIInsightsCard />

      {/* Recent Invoices */}
      <div className="w-full bg-white border border-slate-200 rounded-lg shadow-sm shadow-gray-100 overflow-hidden">
        <div className="px-4 sm:px-6 py-4 flex items-center justify-between border-b border-slate-200 bg-salte-50">
          <h3 className="text-lg font-semibold text-slate-900">Recent Invoices</h3>
          <Button variant="ghost" onClick={() => navigate("/invoices")}>View All</Button>
        </div>

        {recentInvoices.length > 0 ? (
          <div className="overflow-x-auto bg-white border border-slate-200 rounded-xl shadow-lg shadow-gray-100">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Due Date</th>
                </tr>
              </thead>
              <tbody className="">
                {recentInvoices.map((invoice) => (
                  <tr key={invoice._id}
                    className="border-t border-slate-200 hover:bg-slate-50 cursor-pointer"
                    onClick={() => navigate(`/invoice/${invoice._id}`)}>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">{invoice.billTo.clientName}</div>
                      <div className="text-xs text-slate-500">{invoice.invoiceNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                      <div className="text-sm text-slate-900">{`$${invoice.total.toFixed(2)}`}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${invoice.status === "Paid" ? "bg-green-100 text-green-800" : invoice.status === "Pending" ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800"}`}>{invoice.status}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {moment(invoice.dueDate).format("MMM D, YYYY")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-12">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
              <FileText className="w-8 h-8 text-salte-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-800 mb-2">No invoices yet</h3>
            <p className="text-slate-500 mb-4 max-w-mb">You haven't created any invoices yet. Get started by creating your first invoice.</p>
            <Button onClick={() => navigate("/invoices/new")} icon={Plus} >Create Invoice</Button>
          </div>
        )}
      </div>
    </div >
  )
};

export default Dashboard;