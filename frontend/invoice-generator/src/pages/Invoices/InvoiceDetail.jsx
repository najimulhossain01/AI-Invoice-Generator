import react, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiousInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { Loader2, Printer, AlertCircle, Edit, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import CreateInvoice from './CreateInvoice';
import Button from '../../components/ui/Button';
import RemainderModal from '../../components/invoices/RemainderModal';

const InvoiceDetail = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isRemainderModalOpen, setIsRemainderModalOpen] = useState(false);
  const invoiceRef = useRef();

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.INVOICE.GET_INVOICE_BY_ID(id));
        setInvoice(response.data);
      } catch (error) {
        toast.error('Failed to fetch invoice');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [id]);

  const handleUpdate = async (formData) => {
    try {
      const response = await axiosInstance.put(API_PATHS.INVOICE.UPDATE_INVOICE(id), formData);
      toast.success('Invoice updated successfully!');
      setIsEditing(false);
      setInvoice(response.data);
    } catch (error) {
      toast.error('Failed to update invoice');
      console.error(error);
    }
  };

  const handlePrint = async () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex flex-col items-center py-12 text-center bg-slate-50 rounded-lg">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-2">Invoice Not Found</h3>
        <p className="text-slate-500 mb-6 max-w-md mx-auto">The invoice you are looking for does not exist or could not be loaded.</p>
        <Button
          onClick={() => navigate("/invoices")}
        >
          Back to All Invoices
        </Button>
      </div>
    );
  }

  if (isEditing) {
    return <CreateInvoice
      existingInvoice={invoice}
      onSave={handleUpdate}
    />
  }

  return (
    <>
      <RemainderModal
        isOpen={isRemainderModalOpen}
        onClose={() => setIsRemainderModalOpen(false)}
        invoiceId={id}
      />
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 print:hidden'>
        <h1 className='text-2xl font-semibold text-slate-900 mb-4 sm:mb-0'>
          Invoice <span className='font-mono text-slate-600'>{invoice.invoiceNumber}</span>
        </h1>
        <div className="flex items-center gap-2">
          {invoice.status !== "Paid" && (
            <Button variant="secondary" onClick={() => setIsRemainderModalOpen(true)} icon={Mail}>
              Generate Reminder
            </Button>
          )}
          <Button variant="secondary" onClick={() => setIsEditing(true)} icon={Edit}>
            Edit
          </Button>
          <Button variant="primary" icon={Printer} onClick={() => handlePrint()}>
            Print
          </Button>
        </div>
      </div>

      <div id='invoice-content-wrapper'>
        <div
          ref={invoiceRef}
          id='invoice-preview'
          className='bg-white p-6 sm:p-8 shadow-md border border-slate-200 rounded-lg md:p-12'
        >

          <div className='flex flex-col sm:flex-row items-start justify-between pb-8 border-b border-slate-200'>
            <div>
              <h2 className='text-2xl font-bold text-slate-900 mb-2'>INVOICE</h2>
              <p className='text-sm text-slate-600 mt-2'># {invoice.invoiceNumber}</p>
            </div>
            <div className='text-left sm:text-right mt-4 sm:mt-0 flex items-center gap-2'>
              <p className='text-sm font-semibold text-slate-900'>Status:</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${invoice.status === 'Paid' ? 'bg-green-100 text-green-800' :
                invoice.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                }`}>
                {invoice.status}
              </span>
            </div>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-8 my-8 print:my-4'>
            <div>
              <h3 className='text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3'>Bill From</h3>
              <p className='font-semibold text-slate-900'>{invoice.billFrom?.businessName}</p>
              <p className='text-slate-600'>{invoice.billFrom?.address}</p>
              <p className='text-slate-600'>{invoice.billFrom?.email}</p>
              <p className='text-slate-600'>{invoice.billFrom?.phone}</p>
            </div>
            <div className='sm:text-right'>
              <h3 className='text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3'>Bill To</h3>
              <p className='font-semibold text-slate-900'>{invoice.billTo.clientName}</p>
              <p className='text-slate-600'>{invoice.billTo.address}</p>
              <p className='text-slate-600'>{invoice.billTo.email}</p>
              <p className='text-slate-600'>{invoice.billTo.phone}</p>
            </div>

          </div>

          <div className='grid grid-cols-1 sm:grid-cols-3 gap-8 my-8 print:my-4'>
            <div>
              <h3 className='text-sm font-semibold text-slate-600 uppercase tracking-wider mb-2'>Invoice Date</h3>
              <p className='font-medium text-slate-800'>{new Date(invoice.invoiceDate).toLocaleDateString()}</p>
            </div>
            <div>
              <h3 className='text-sm font-semibold text-slate-600 uppercase tracking-wider mb-2'>Due Date</h3>
              <p className='font-medium text-slate-800'>{new Date(invoice.dueDate).toLocaleDateString()}</p>
            </div>
            <div>
              <h3 className='text-sm font-semibold text-slate-600 uppercase tracking-wider mb-2'>Payment Terms</h3>
              <p className='font-medium text-slate-800'>{invoice.paymentTerms}</p>
            </div>
          </div>

          <div className='bg-white border border-slate-200 rounded-lg overflow-hidden'>
            <table className='w-full divide-y divide-slate-200'>
              <thead className='bg-slate-100'>
                <tr>
                  <th className='py-3 px-4 sm:px-6 print:px-2 print:text-xs text-left font-medium text-slate-600 uppercase tracking-wider'>Item</th>
                  <th className='py-3 px-4 sm:px-6 print:px-2 print:text-xs text-center font-medium text-slate-600 uppercase tracking-wider'>Qty</th>
                  <th className='py-3 px-4 sm:px-6 print:px-2 print:text-xs text-right font-medium text-slate-600 uppercase tracking-wider'>Price</th>
                  <th className='py-3 px-4 sm:px-6 print:px-2 print:text-xs text-right font-medium text-slate-600 uppercase tracking-wider'>Total</th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-slate-100'>
                {invoice.items.map((item, index) => (
                  <tr key={index}>
                    <td className='py-4 px-4 sm:px-6 print:py-2 print:px-2 print:text-sm font-medium text-slate-900 break-words max-w-[200px] sm:max-w-none'>{item.name}</td>
                    <td className='text-center py-4 px-4 sm:px-6 print:py-2 print:px-2 print:text-sm font-medium text-slate-600'>{item.quantity}</td>
                    <td className='text-right py-4 px-4 sm:px-6 print:py-2 print:px-2 print:text-sm font-medium text-slate-600'>${item.unitPrice.toFixed(2)}</td>
                    <td className='text-right py-4 px-4 sm:px-6 print:py-2 print:px-2 print:text-sm font-medium text-slate-900'>${item.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className='flex justify-end mt-8 print:mt-4'>
            <div className='w-full max-w-sm space-y-3'>
              <div className='flex justify-between font-medium text-sm text-slate-600'>
                <span>Subtotal</span>
                <span>${(invoice.subTotal).toFixed(2)}</span>
              </div>
              <div className='flex justify-between font-medium text-sm text-slate-600'>
                <span>Tax</span>
                <span>${(invoice.taxTotal).toFixed(2)}</span>
              </div>
              <div className='flex justify-between font-semibold text-lg text-slate-900 pt-3 mt-3 border-t border-slate-400'>
                <span>Total</span>
                <span>${invoice.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {invoice.notes && (
            <div className='mt-8 pt-8 print:mt-4 print:pt-4 border-t border-slate-300'>
              <h3 className='text-sm font-semibold text-slate-600 uppercase tracking-wider mb-3'>Notes</h3>
              <p className='text-sm text-slate-700'>{invoice.notes}</p>
            </div>
          )}

        </div>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #invoice-content-wrapper, #invoice-content-wrapper * {
            visibility: visible;
          }
          #invoice-content-wrapper {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          #invoice-preview {
            box-shadow: none;
            border: none;
            border-radius: 0;
            padding: 0;
          }
        }
      `}</style>
    </>
  )
};

export default InvoiceDetail;
