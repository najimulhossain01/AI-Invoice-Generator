import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../utils/axiousInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import { Plus, Trash, Trash2 } from "lucide-react";
import moment from "moment";
import { useAuth } from "../../context/AuthContext";

import InputField from "../../components/ui/InputField";
import TextareaField from "../../components/ui/TextareaField";
import SelectField from "../../components/ui/SelectField";
import Button from "../../components/ui/Button";

const CreateInvoice = ({ existingInvoice, onSave }) => {

  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [formData, setFormData] = useState(
    existingInvoice || {
      invoiceNumber: "",
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: "",
      billFrom: {
        businessName: "",
        email: "",
        address: "",
        phone: "",
      },
      billTo: {
        clientName: "",
        email: "",
        address: "",
        phone: "",
      },
      items: [
        {
          name: "",
          quantity: 1,
          unitPrice: 0,
          taxPercent: 0,
        },
      ],
      notes: "",
      paymentTerms: "Net 15",
    }
  );

  const [loading, setLoading] = useState(false);
  const [isGeneratingNumber, setIsGeneratingNumber] = useState(!existingInvoice);

  useEffect(() => {

    const aiData = location.state?.aiData;

    if (aiData) {
      setFormData((prev) => ({
        ...prev,
        billTo: {
          clientName: aiData.clientName || "",
          email: aiData.email || "",
          address: aiData.address || "",
          phone: ""
        },
        items: aiData.items || [
          {
            name: "",
            quantity: 1,
            unitPrice: 0,
            taxPercent: 0,
          },
        ],
      }));
    }

    if (existingInvoice) {
      setFormData({
        ...existingInvoice,
        invoiceDate: existingInvoice.invoiceDate ? moment(existingInvoice.invoiceDate).format("YYYY-MM-DD") : "",
        dueDate: existingInvoice.dueDate ? moment(existingInvoice.dueDate).format("YYYY-MM-DD") : ""
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        billFrom: {
          businessName: user?.businessName || "",
          email: user?.email || "",
          address: user?.address || "",
          phone: user?.phone || "",
        },
      }));

      const generateNewInvoiceNumber = async () => {
        setIsGeneratingNumber(true);
        try {
          const response = await axiosInstance.get(API_PATHS.INVOICE.GET_ALL_INVOICES);
          const invoices = response.data;
          let maxNum = 0;
          invoices.forEach((inv) => {
            const num = parseInt(inv.invoiceNumber.split("-")[1]);
            if (!isNaN(num) && num > maxNum) {
              maxNum = num;
            }
          });
          const newInvoiceNumber = `INV-${String(maxNum + 1).padStart(3, "0")}`;
          setFormData((prev) => ({
            ...prev,
            invoiceNumber: newInvoiceNumber
          }));
        } catch (error) {
          console.error("Failed to generate invoice number:", error);
          setFormData((prev) => ({
            ...prev,
            invoiceNumber: `INV-${Date.now().toString().slice(-5)}`
          }));
        } finally {
          setIsGeneratingNumber(false);
        }
      };

      generateNewInvoiceNumber();
    }


  }, [existingInvoice, user]);

  const handleInputChange = (e, section, index) => {
    const { name, value } = e.target;

    if (section) {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [name]: value,
        },
      }));
    }
    else if (index !== undefined) {
      const newItems = [...formData.items];
      newItems[index] = {
        ...newItems[index],
        [name]: value,
      };
      setFormData((prev) => ({
        ...prev,
        items: newItems,
      }));
    }
    else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, {
        name: "",
        quantity: 1,
        unitPrice: 0,
        taxPercent: 0,
      }],
    });
  };

  const handleRemoveItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      items: newItems,
    });
  };

  const { subtotal, taxAmount, total } = (() => {
    let subtotal = 0, taxAmount = 0;
    formData.items.forEach((item) => {
      const itemTotal = (item.quantity || 0) * (item.unitPrice || 0);
      subtotal += itemTotal;
      taxAmount += itemTotal * ((item.taxPercent || 0) / 100);
    });
    const total = subtotal + taxAmount;
    return { subtotal, taxAmount, total };
  })();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const itemsWithTotal = formData.items.map(item => ({
      ...item,
      total: (item.quantity || 0) * (item.unitPrice || 0) * (1 + ((item.taxPercent || 0) / 100)) || 0,
    }));

    const finalFormData = {
      ...formData,
      items: itemsWithTotal,
      subtotal,
      taxAmount,
      total
    };

    if (onSave) {
      await onSave(finalFormData);
    } else {
      try {
        await axiosInstance.post(API_PATHS.INVOICE.CREATE, finalFormData);
        toast.success("Invoice created successfully");
        navigate("/invoices");
      } catch (error) {
        toast.error("Failed to create invoice");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">
          {existingInvoice ? "Edit Invoice" : "Create New Invoice"}
        </h2>
        <Button
          type="submit"
          isLoading={loading || isGeneratingNumber}
        >
          {existingInvoice ? "Save Changes" : "Save Invoice"}
        </Button>
      </div>


      <div className="bg-white p-6 shadow-sm shadow-gray-100 border border-slate-200 rounded-lg mt-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InputField
            label="Invoice Number"
            name="invoiceNumber"
            value={formData.invoiceNumber}
            placeholder={isGeneratingNumber ? "Generating..." : ""}
            disabled
          />
          <InputField
            label="Invoice Date"
            type="date"
            name="invoiceDate"
            value={formData.invoiceDate}
            onChange={handleInputChange}
          />
          <InputField
            label="Due Date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleInputChange}
            type="date"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-6 shadow-sm shadow-gray-100 border border-slate-200 rounded-lg space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Bill From</h3>
          <InputField
            label="Business Name"
            name="businessName"
            value={formData.billFrom.businessName}
            onChange={(e) => handleInputChange(e, "billFrom")}
          />
          <InputField
            label="Email"
            type="email"
            name="email"
            value={formData.billFrom.email}
            onChange={(e) => handleInputChange(e, "billFrom")}
          />
          <TextareaField
            label="Address"
            name="address"
            value={formData.billFrom.address}
            onChange={(e) => handleInputChange(e, "billFrom")}
          />
          <InputField
            label="Phone"
            name="phone"
            value={formData.billFrom.phone}
            onChange={(e) => handleInputChange(e, "billFrom")}
          />
        </div>
        <div className="bg-white p-6 shadow-sm shadow-gray-100 border border-slate-200 rounded-lg space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Bill To</h3>
          <InputField
            label="Client Name"
            name="clientName"
            value={formData.billTo.clientName}
            onChange={(e) => handleInputChange(e, "billTo")}
          />
          <InputField
            label="Client Email"
            type="email"
            name="email"
            value={formData.billTo.email}
            onChange={(e) => handleInputChange(e, "billTo")}
          />
          <TextareaField
            label="Client Address"
            name="address"
            value={formData.billTo.address}
            onChange={(e) => handleInputChange(e, "billTo")}
          />
          <InputField
            label="Client Phone"
            name="phone"
            value={formData.billTo.phone}
            onChange={(e) => handleInputChange(e, "billTo")}
          />
        </div>
      </div>

      <div className="bg-white shadow-sm shadow-gray-100 border overflow-y-hidden border-slate-200 rounded-lg">
        <div className="p-4 sm:border-b border-slate-200 bg-slate-50">
          <h3 className="text-lg font-semibold text-slate-900">Items</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-2 sm:px-6 py-3 text-xs text-slate-500 font-medium uppercase tracking-wider">Item</th>
                <th className="px-2 sm:px-6 py-3 text-xs text-slate-500 font-medium uppercase tracking-wider">Qty</th>
                <th className="px-2 sm:px-6 py-3 text-xs text-slate-500 font-medium uppercase tracking-wider">Price</th>
                <th className="px-2 sm:px-6 py-3 text-xs text-slate-500 font-medium uppercase tracking-wider">Tax (%)</th>
                <th className="px-2 sm:px-6 py-3 text-xs text-slate-500 font-medium uppercase tracking-wider">Total</th>
                <th className="px-2 sm:px-6 py-3 text-xs text-slate-500 font-medium uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {formData.items.map((item, index) => (
                <tr key={index} className="hover:bg-slate-50">
                  <td className="px-2 sm:px-6 py-4">
                    <input
                      type="text"
                      name="name"
                      value={item.name}
                      onChange={(e) => handleInputChange(e, null, index)}
                      className="w-full h-10 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus-outline-none px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Item Name"
                    />
                  </td>
                  <td className="p-2 sm:p-6 py-4">
                    <input
                      type="number"
                      name="quantity"
                      value={item.quantity}
                      onChange={(e) => handleInputChange(e, null, index)}
                      className="w-full h-10 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus-outline-none px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="1"
                    />
                  </td>
                  <td className="p-2 sm:p-6 py-4">
                    <input
                      type="number"
                      name="unitPrice"
                      value={item.unitPrice}
                      onChange={(e) => handleInputChange(e, null, index)}
                      className="w-full h-10 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus-outline-none px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </td>
                  <td className="p-2 sm:p-6 py-4">
                    <input
                      type="number"
                      name="taxPercent"
                      value={item.taxPercent}
                      onChange={(e) => handleInputChange(e, null, index)}
                      className="w-full h-10 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus-outline-none px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </td>
                  <td className="p-2 sm:p-6 py-4">
                    ${((item.quantity || 0) * (item.unitPrice || 0) * (1 + (item.taxPercent || 0) / 100)).toFixed(2)}
                  </td>
                  <td className="p-2 sm:p-6 py-4">
                    <Button
                      type="button"
                      size="small"
                      onClick={() => handleRemoveItem(index)}
                      variant="ghost"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 sm:p-6  border-b border-slate-200">
          <Button
            type="button"
            icon={Plus}
            onClick={handleAddItem}
            variant="secondary"
          >
            Add Item
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 shadow-sm shadow-gray-100 border border-slate-200 rounded-lg space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 mb-3">Notes & Terms</h3>
          <TextareaField
            label="Notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
          />
          <SelectField
            label="Payment Terms"
            name="paymentTerms"
            value={formData.paymentTerms}
            onChange={handleInputChange}
            options={["Net 15", "Net 30", "Net 45", "Net 60", "Due on Receipt"]}
          />
        </div>
        <div className="bg-white p-6 shadow-sm shadow-gray-100 border border-slate-200 rounded-lg flex flex-col justify-center">
          <div className="space-y-4">
            <div className="flex justify-between text-sm font-medium text-slate-600"><p>Subtotal:</p><p>${subtotal.toFixed(2)}</p></div>
            <div className="flex justify-between text-sm font-medium text-slate-600"><p>Tax:</p><p>${taxAmount.toFixed(2)}</p></div>
            <div className="flex justify-between border-t border-slate-200 text-slate-800 font-medium text-lg pt-4 mt-4"><p>Total:</p><p>${total.toFixed(2)}</p></div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CreateInvoice;
