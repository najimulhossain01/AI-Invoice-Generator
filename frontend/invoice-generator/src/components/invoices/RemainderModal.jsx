import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiousInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { Loader, Mail, Copy, Check } from 'lucide-react';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';
import TextareaField from '../ui/TextareaField';

const CreateRemainderModal = ({ isOpen, onClose, invoiceId }) => {

    const [remainderText, setRemainderText] = useState("");
    const [loading, setLoading] = useState(false);
    const [hasCopied, setHasCopied] = useState(false);

    useEffect(() => {
        if (isOpen && invoiceId) {
            const generateRemainder = async () => {
                setLoading(true);
                setRemainderText("");

                try {
                    const response = await axiosInstance.post(API_PATHS.AI.GENERATE_REMINDER, { invoiceId });
                    setRemainderText(response.data.remainderText);
                } catch (error) {
                    toast.error("Failed to generate remainder email.");
                    console.error("Failed to generate remainder:", error);
                    onClose();
                } finally {
                    setLoading(false);
                }
            }
            generateRemainder();
        }
    }, [isOpen, invoiceId, onClose]);

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(remainderText);
        setHasCopied(true);
        toast.success("Remainder Copied to clipboard");
        setTimeout(() => setHasCopied(false), 2000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className='flex min-h-screen items-center justify-center text-center px-4'>
                <div className='fixed inset-0 bg-black/50 bg-opacity-50 transition-opacity' onClick={onClose}></div>

                <div className='bg-white relative w-full max-w-lg p-6 text-left rounded-lg shadow-xl transform transition-all'>
                    <div className='flex justify-between items-center mb-4'>
                        <h3 className='flex items-center text-slate-900 text-lg font-semibold'>
                            <Mail className='w-5 h-5 mr-2 text-blue-900' />
                            AI-Generated Remainder
                        </h3>
                        <button onClick={onClose} className='text-slate-4 hover:text-slate-600 cursor-pointer text-2xl font-medium'>&times;</button>
                    </div>
                    {loading ? (
                        <div className='flex justify-center items-center h-48'>
                            <Loader className='w-8 h-8 text-blue-600 animate-spin' />
                        </div>
                    ) : (
                        <div className='space-y-4'>
                            <TextareaField
                                name="remainderText"
                                value={remainderText}
                                readOnly
                                rows={10}
                            />
                        </div>
                    )}

                    <div className='flex justify-end space-x-4 mt-6'>
                        <Button variant='secondary' onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleCopyToClipboard}
                            icon={hasCopied ? Check : Copy}
                            disabled={loading}
                        >
                            {hasCopied ? "Copied!" : "Copy Text"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateRemainderModal;