export const emailTemplates = {

    welcome(name) {

        return `
            <h2>Welcome ${name} 👋</h2>

            <p>
                Thank you for joining GoCart.
            </p>
        `;

    },

    orderPlaced(order) {

        return `
            <h2>Order Confirmed 🎉</h2>

            <p>
                Your order <b>${order.id}</b> has been placed successfully.
            </p>

            <h3>Total : ₹${order.total}</h3>
        `;

    },

    paymentSuccess(order) {

        return `
            <h2>Payment Successful ✅</h2>

            <p>
                Payment received for Order
                <b>${order.id}</b>.
            </p>
        `;

    },

    orderStatus(order) {

        return `
            <h2>Your Order has been ${order.status} 🚚</h2>

            <p>
                Order
                <b>${order.id}</b>
                is on the way.
            </p>
        `;

    },

    storeApproved(store) {

        return `
            <h2>Store Approved 🎉</h2>

            <p>
                ${store.name}
                is now live on GoCart.
            </p>
        `;

    },

};