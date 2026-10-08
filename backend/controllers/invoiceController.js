const Invoice = require("../models/Invoice");

// @desc    Create new invoice
// @route   POST /api/invoices
// @access  Private
exports.createInvoice = async (req, res) => {
    try {
        const user = req.user;
        const {
            invoiceNumber,
            invoiceDate,
            dueDate,
            billFrom,
            billTo,
            items,
            notes,
            paymentTerms,
        } = req.body;

        // subtTotal calculation
        let subTotal = 0;
        let taxTotal = 0;

        if (items && items.length > 0) {
            items.forEach(item => {
                subTotal += item.unitPrice * item.quantity;
                taxTotal += ((item.unitPrice * item.quantity) * (item.taxPercent || 0)) / 100;
            });
        }

        const total = subTotal + taxTotal;

        const invoice = new Invoice({
            user,
            invoiceNumber,
            invoiceDate,
            dueDate,
            billFrom,
            billTo,
            items,
            notes,
            paymentTerms,
            subTotal,
            taxTotal,
            total
        });

        await invoice.save();
        res.status(201).json(invoice);
    } catch (error) {
        res.status(500).json({ message: "Error Creating Invoice: ", error: error.message });
    }
};

// @desc    Get all invoices of logged-in user
// @route   GET /api/invoices
// @access  Private
exports.getInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find({
            user: req.user.id,
            isDeleted: false,          // exclude soft-deleted invoices
        }).populate("user", "name email");
        res.status(200).json(invoices);
    } catch (error) {
        res.status(500).json({ message: "Error Getting Invoices: ", error: error.message });
    }
};

// @desc    Get single invoice by ID
// @route   GET /api/invoices/:id
// @access  Private
exports.getInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id).populate("user", "name email");
        if (!invoice || invoice.isDeleted) {
            return res.status(404).json({ message: "Invoice not found" });
        }

        // Check if the invoice belongs to the logged-in user
        if (invoice.user._id.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        res.status(200).json(invoice);
    } catch (error) {
        res.status(500).json({ message: "Error Getting Invoice: ", error: error.message });
    }
};

// @desc    Update invoice
// @route   PUT /api/invoices/:id
// @access  Private
exports.updateInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);
        if (!invoice || invoice.isDeleted) {
            return res.status(404).json({ message: "Invoice not found" });
        }

        const {
            invoiceNumber,
            invoiceDate,
            dueDate,
            billFrom,
            billTo,
            items,
            notes,
            paymentTerms,
            status,
        } = req.body;

        const safeInvoiceDate = invoiceDate || null;
        const safeDueDate = dueDate || null;
        // recalculated subTotal, taxTotal, total
        let subTotal = 0;
        let taxTotal = 0;

        if (items && items.length > 0) {
            items.forEach(item => {
                subTotal += item.unitPrice * item.quantity;
                taxTotal += ((item.unitPrice * item.quantity) * (item.taxPercent || 0)) / 100;
            });
        }

        const total = subTotal + taxTotal;

        const updatedInvoice = await Invoice.findByIdAndUpdate(
            req.params.id,
            {
                invoiceNumber,
                invoiceDate: safeInvoiceDate,
                dueDate: safeDueDate,
                billFrom,
                billTo,
                items,
                notes,
                paymentTerms,
                status,
                subTotal,
                taxTotal,
                total
            },
            { returnDocument: 'after' }
        );

        if (!updatedInvoice) {
            return res.status(404).json({ message: "Invoice not found" });
        }

        res.status(200).json(updatedInvoice);
    } catch (error) {
        res.status(500).json({ message: "Error Updating Invoice: ", error: error.message });
    }
};

// @desc    Delete invoice
// @route   DELETE /api/invoices/:id
// @access  Private
exports.deleteInvoice = async (req, res) => {
    try {
        // Soft delete: marks invoice as deleted, keeps it in the database
        const invoice = await Invoice.findByIdAndUpdate(
            req.params.id,
            { isDeleted: true },
            { returnDocument: 'after' }
        );
        if (!invoice) {
            return res.status(404).json({ message: "Invoice not found" });
        }
        res.status(200).json({ message: "Invoice removed successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error Deleting Invoice: ", error: error.message });
    }
};
