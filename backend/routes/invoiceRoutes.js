const express = require("express");
const {
    createInvoice,
    getInvoices,
    getInvoice,
    updateInvoice,
    deleteInvoice,
} = require("../controllers/invoiceController.js");
const authMiddleware = require("../middlewares/authMiddlewares.js");

const router = express.Router();

router.route("/")
    .post(authMiddleware, createInvoice)
    .get(authMiddleware, getInvoices);

router.route("/:id")
    .get(authMiddleware, getInvoice)
    .put(authMiddleware, updateInvoice)
    .delete(authMiddleware, deleteInvoice);

module.exports = router;