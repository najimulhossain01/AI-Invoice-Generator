import React, { useState, useEffect, useMemo } from "react";
import axiosInstance from "../../utils/axiousInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { Loader2, Edit, FileText, AlertCircle, Plus, Trash2, Search, Sparkles, Mail } from "lucide-react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import CreateWithAIModal from "../../components/invoices/CreateWithAIModal";
import RemainderModal from "../../components/invoices/RemainderModal";

const AllInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusChangeLoading, setStatusChangeLoading] = useState(null);
  const [SearchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isRemailderModelOpen, setIsRemailderModelOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.INVOICE.GET_ALL_INVOICES);
        setInvoices(response.data.sort((a, b) => new Date(b.invoiceDate) - new Date(a.invoiceDate)));
      } catch (error) {
        setError("Failed to fetch invoices")
      } finally {
        setLoading(false)
      }
    };
    fetchInvoices();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      try {
        await axiosInstance.delete(API_PATHS.INVOICE.DELETE_INVOICE(id));
        setInvoices(invoices.filter((invoice) => invoice._id !== id));
      } catch (error) {
        setError("Failed to delete invoice");
        console.error("Error deleting invoice:", error);
      }
    }
  };

  const handleStatusChange = async (invoice) => {
    setStatusChangeLoading(invoice._id);
    try {
      const newStatus = invoice.status === "Paid" ? "Unpaid" : "Paid";
      const updateInvoice = {
        ...invoice,
        status: newStatus,
      };
      const response = await axiosInstance.put(API_PATHS.INVOICE.UPDATE_INVOICE(invoice._id), updateInvoice);
      setInvoices(invoices.map((inv) => inv._id === invoice._id ? response.data : inv));
    }
    catch (error) {
      setError("Failed to update invoice status.");
      console.error("Error updating invoice status:", error);
    }
    finally {
      setStatusChangeLoading(null);
    }
  };

  const handleOpenRemainderModal = (invoiceId) => {
    setSelectedInvoiceId(invoiceId);
    setIsRemailderModelOpen(true);
  };

  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      const matchesStatus = statusFilter === "All" || invoice.status === statusFilter;
      const matchesSearch = (invoice.invoiceNumber || "").toLowerCase().includes(SearchTerm.toLowerCase()) || (invoice.billTo.clientName || "").toLowerCase().includes(SearchTerm.toLowerCase());
      return matchesSearch && matchesStatus;
    });
  }, [invoices, SearchTerm, statusFilter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }



  return (
    <div className="space-y-6">
      <CreateWithAIModal isOpen={isAiModalOpen} onClose={() => (setIsAiModalOpen(false))} />
      <RemainderModal isOpen={isRemailderModelOpen} onClose={() => (setIsRemailderModelOpen(false))} invoiceId={selectedInvoiceId} />
      <div className="flex flex-col sm:flex-row sm:items-center item-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">All Invoices</h1>
          <p className="text-sm text-slate-600 mt-1">Manage all your invoices in one place.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => (setIsAiModalOpen(true))} icon={Sparkles}>
            Create with AI
          </Button>
          <Button onClick={() => (navigate("/invoices/new"))} icon={Plus}>
            Create Invoice
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <div className="flex items-start">
            <AlertCircle className="w-5 h- text-red-600 mt-0.5 mr-3" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-800 mb-1">Error</h3>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="p-4 sm:p-6 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute left-0 inset-y-0 pl-3 flex items-center pointer-events-none "><Search className="w-5 h-5 text-slate-400" /></div>
              <input
                type="text"
                placeholder="Search by invoice # or client..."
                value={SearchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 pr-4 py-2 border border-slate-300 rounded-lg bg-white w-full focus:outline-none text-slate-900 placeholder:slate-400 focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="flex-shrink-0">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-auto h-10 px-4 py-2 border border-slate-200 rounded-lg bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="All">All Statuses</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Unpaid">Unpaid</option>
              </select>
            </div>
          </div>
        </div>
        {filteredInvoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full mb-4 flex items-center justify-center">
              <FileText className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No Invoices Found</h3>
            <p className="text-slate-600 mb-6 max-w-md">Your search or filter criteria did not match any invoices. Try adjusting your search.</p>
            {invoices.length === 0 && (
              <Button variant="outline" onClick={() => (navigate("/invoices/new"))} icon={Plus} className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                Create Invoice
              </Button>
            )}
          </div>
        ) : (
          <div className="w-full overflow-x-auto custom-scrollbar">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap">Invoice #</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap">Due Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice._id} className="hover:bg-slate-50">
                    <td onClick={() => (navigate(`/invoice/${invoice._id}`))} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 cursor-pointer">
                      {invoice.invoiceNumber}
                    </td>
                    <td onClick={() => (navigate(`/invoice/${invoice._id}`))} className="px-4 py-4 cursor-pointer">
                      {invoice.billTo.clientName}
                    </td>
                    <td onClick={() => (navigate(`/invoice/${invoice._id}`))} className="px-4 py-4 cursor-pointer">
                      $ {(invoice.total).toFixed(2)}
                    </td>
                    <td onClick={() => (navigate(`/invoice/${invoice._id}`))} className="px-4 py-4 cursor-pointer">
                      {moment(invoice.dueDate).format("MMM D, YYYY")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2.5 py-0.5 inline-flex items-center text-xs font-medium rounded-full ${invoice.status === "Paid" ? "bg-green-100 text-green-800" :
                          invoice.status === "Pending" ? "bg-amber-100 text-amber-800" :
                            "bg-rose-100 text-rose-800"
                          }`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        <Button
                          size="small"
                          variant="secondary"
                          isLoading={statusChangeLoading === invoice._id}
                          onClick={() => handleStatusChange(invoice)}
                        >
                          {invoice.status == "Paid" ? "Mark as Unpaid" : "Mark as Paid"}
                        </Button>
                        <Button
                          size="small"
                          variant="ghost"
                          onClick={() => navigate(`/invoice/${invoice._id}`)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="small"
                          variant="ghost"
                          onClick={() => handleDelete(invoice._id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                        {invoice.status !== "Paid" && (
                          <Button
                            size="small"
                            variant="ghost"
                            onClick={() => handleOpenRemainderModal(invoice._id)}
                            title="Generate Reminder"
                          >
                            <Mail className="w-4 h-4 text-blue-500" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
};

export default AllInvoices;
