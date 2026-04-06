const nodemailer = require("nodemailer");
const { TableClient } = require("@azure/data-tables");

module.exports = async function (context, req) {

    try {
        const data = req.body;

        if (!data || !data.email) {
            context.res = {
                status: 400,
                body: "Invalid input"
            };
            return;
        }

        // 🧠 Connect to Azure Table Storage
        const tableClient = TableClient.fromConnectionString(
            process.env.AzureWebJobsStorage,
            "requests"
        );

        // 📦 Create entity (row)
        const entity = {
            partitionKey: "request",
            rowKey: Date.now().toString(),
            createdAt: new Date().toISOString(),
            status: "Pending",

            // Form data
            q1: data.q1,
            q2: data.q2,
            email: data.email,
            contact: data.contact,
            accountName: data.accountName,
            country: data.country,
            region: data.region,
            source: data.source,
            target: data.target,
            s500: data.s500,
            requestType: data.requestType,
            description: data.description,
            scenario: data.scenario
        };

        // 💾 Save to table
        await tableClient.createEntity(entity);

        context.log("Saved to Table Storage");

        // 📧 Email logic (your existing)
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "amal3689@gmail.com",
                pass: "nzhhyqqgevorqclh"
            }
        });

        const mailOptions = {
            from: "amal3689@gmail.com",
            to: [data.email, "amals3689@gmail.com"],
            subject: "Request Received",
            text: `Thank you for reaching out.

We will go through your request and get in touch shortly.

Account: ${data.accountName}
Request Type: ${data.requestType}
Country: ${data.country}`
        };

        await transporter.sendMail(mailOptions);

        context.res = {
            status: 200,
            body: "Saved + Email sent"
        };

    } catch (error) {
        context.log("Error:", error);

        context.res = {
            status: 500,
            body: "Something went wrong"
        };
    }
};
