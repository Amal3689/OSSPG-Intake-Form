const nodemailer = require("nodemailer");

module.exports = async function (context, req) {

    const data = req.body;

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
        body: "Email sent"
    };
};
