export function returnRequestEmail(name, orderId) {

    return `
    <div style="font-family:Arial;padding:30px;background:#f8fafc">

        <div style="max-width:650px;margin:auto;background:white;padding:40px;border-radius:12px">

            <h1 style="color:#16a34a">

                Return Request Received

            </h1>

            <p>Hello <b>${name}</b>,</p>

            <p>

                We've received your return request for

                <b>Order #${orderId}</b>.

            </p>

            <p>

                Our seller will review it shortly.

            </p>

            <hr>

            <p style="color:#64748b">

                Thank you for shopping with GoCart ❤️

            </p>

        </div>

    </div>
    `;

}

export function returnApprovedEmail(name, orderId) {

    return `
    <div style="font-family:Arial;padding:30px;background:#f8fafc">

        <div style="max-width:650px;margin:auto;background:white;padding:40px;border-radius:12px">

            <h1 style="color:#2563eb">

                Return Approved

            </h1>

            <p>Hello <b>${name}</b>,</p>

            <p>

                Your return request for

                <b>Order #${orderId}</b>

                has been approved.

            </p>

            <p>

                Refund processing has started.

            </p>

        </div>

    </div>
    `;

}

export function returnRejectedEmail(name, orderId) {

    return `
    <div style="font-family:Arial;padding:30px;background:#f8fafc">

        <div style="max-width:650px;margin:auto;background:white;padding:40px;border-radius:12px">

            <h1 style="color:#dc2626">

                Return Rejected

            </h1>

            <p>Hello <b>${name}</b>,</p>

            <p>

                Unfortunately,

                your return request for

                <b>Order #${orderId}</b>

                was rejected.

            </p>

            <p>

                Please contact support if you need assistance.

            </p>

        </div>

    </div>
    `;

}

export function refundCompletedEmail(

    name,

    orderId,

    amount

) {

    return `
    <div style="font-family:Arial;padding:30px;background:#f8fafc">

        <div style="max-width:650px;margin:auto;background:white;padding:40px;border-radius:12px">

            <h1 style="color:#16a34a">

                Refund Completed

            </h1>

            <p>Hello <b>${name}</b>,</p>

            <p>

                Your refund for

                <b>Order #${orderId}</b>

                has been processed successfully.

            </p>

            <h2>

                ₹${amount}

            </h2>

            <p>

                It may take 3–7 business days to reflect in your account, depending on your bank or payment provider.

            </p>

        </div>

    </div>
    `;

}