const { GoogleGenAI } = require("@google/genai");
const Invoice = require("../models/Invoice");

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

const parseInvoiceFromText = async (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ message: "Text is required" });
    }

    try {
        const prompt = `
        You are an expert invoice data extracting AI. Analyze the following text and extract the relevant information to create an invoice.
        The output MUST be a valid JSON object with NO trailing commas.

        The JSON object should have the following structure:
        {
            "clientName": "string",
            "email": "string",
            "address": "string",
            "items": [
                {
                    "name": "string",
                    "quantity": "number",
                    "unitPrice": "number"
                }
            ]
        }

        Here is the text to parse:
        --- TEXT START ---
        ${text}
        --- TEXT END ---

        Extract the data and provide only the raw JSON object. Do NOT wrap it in markdown code blocks.
    `;

        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash-lite",
            contents: prompt,
        });

        const responseText = response.text.trim();

        const cleanedJson = responseText
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const parsedData = JSON.parse(cleanedJson);
        res.status(200).json(parsedData);

    } catch (error) {
        console.error("Error Parsing Invoice with AI: ", error);
        res.status(500).json({ message: "Failed to Parse Invoice data from text: ", error: error.message });
    }
};


const generateRemainderEmails = async (req, res) => {

    const { invoiceId } = req.body;

    if (!invoiceId) {
        return res.status(400).json({ message: "Invoice ID is required" });
    }

    try {
        const invoice = await Invoice.findById(invoiceId);
        if (!invoice) {
            return res.status(404).json({ message: "Invoice not found" });
        }

        const prompt = `
        You are a professional and polite accounting assistant. Write a friendly and gentle reminder email to the client for an overdue or upcoming invoice payment.

        Use the following details to personalize the email:
        Client Name: ${invoice.clientName}
        Invoice Number: ${invoice.invoiceNumber}
        Amount Due: $${invoice.total.toFixed(2)} (USD)
        dueDate: ${new Date(invoice.dueDate).toLocaleDateString()}

        The tone should be friendly but clear. Keep it concise. Start the email with "Subject:"
    `;

        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash-lite",
            contents: prompt,
        });

        res.status(200).json({ remainderText: response.text });

    } catch (error) {
        console.error("Error Generating Remainder Emails with AI: ", error);
        res.status(500).json({ message: "Failed to Generate Remainder Emails: ", error: error.message });
    }
};

const getDashboardSummary = async (req, res) => {
    try {
        const invoices = await Invoice.find({ user: req.user.id });

        if (invoices.length === 0) {
            // New user — ask AI for onboarding tips
            const onboardingPrompt = `
            You are a friendly financial advisor for a small business owner who just signed up for an invoice management app.
            They have no invoices yet. Give them exactly 2-3 short, practical, and encouraging tips to help them get started.
            Topics can include: creating their first invoice, setting due dates, following up on payments, staying organized, etc.

            Return ONLY a valid JSON object with a single key "insights" which is an array of 2-3 strings. No extra text.
            Example: { "insights": ["Start by creating your first invoice to get paid faster!", "Always set a clear due date to avoid late payments."] }
            `;

            const onboardingResponse = await ai.models.generateContent({
                model: "gemini-3.5-flash-lite",
                contents: onboardingPrompt,
            });

            const cleanedOnboarding = onboardingResponse.text.replace(/```json/g, "").replace(/```/g, "").trim();
            const onboardingData = JSON.parse(cleanedOnboarding);
            return res.status(200).json(onboardingData);
        }

        // Process and summarize data
        const totalInvoices = invoices.length;
        const paidInvoices = invoices.filter(inv => inv.status === "Paid");
        const unpaidInvoices = invoices.filter(inv => inv.status === "Unpaid" || inv.status === "Pending");
        const totalRevenue = paidInvoices.reduce((acc, inv) => acc + inv.total, 0);
        const totalOutstanding = unpaidInvoices.reduce((acc, inv) => acc + inv.total, 0);

        const dataSummary = `
            - Total number of invoices: ${totalInvoices}
            - Total paid invoices: ${paidInvoices.length}
            - Total unpaid/pending invoices: ${unpaidInvoices.length}
            - Total revenue from paid invoices: $${totalRevenue.toFixed(2)}
            - Total outstanding amount from unpaid/pending invoices: $${totalOutstanding.toFixed(2)}
            - Recent invoices (last 5): ${invoices.slice(0, 5).map(inv => `Invoice number ${inv.invoiceNumber} for $${inv.total.toFixed(2)} with status ${inv.status}`).join(', ')}
        `;

        const prompt = `
        You are a friendly and insightful financial analyst for a small business owner.
        Based on the following summary of their invoice data, provide 2-3 concise and actionable insights.
        Each insight should be a short string in json array.
        The insights should be encouraging and helpful. Do not just repeat the data.
        For example, if there is a high outstanding amount, suggest sending remainders. If revenue is high, be encouraging.
            
        DATA SUMMARY:
        ${dataSummary}

        return your response as a valid JSON object with a single key "insights" which is an array of strings.
        Example format: { "insights": ["Your revenue is looking strong this month!", "You have 5 overdue invoices. "Consider sending remainders to get paid faster." ]} 
        `;


        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash-lite",
            contents: prompt
        });

        const responseText = response.text;
        const cleanedJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsedData = JSON.parse(cleanedJson);

        res.status(200).json(parsedData);

    } catch (error) {
        console.error("Error Getting Dashboard Summary with AI: ", error);
        res.status(500).json({ message: "Failed to Get Dashboard Summary: ", error: error.message });
    }
};

module.exports = { parseInvoiceFromText, generateRemainderEmails, getDashboardSummary };