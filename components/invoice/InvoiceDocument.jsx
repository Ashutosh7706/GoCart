import React from "react";
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({

    page: {

        padding: 40,

        fontSize: 11,

        fontFamily: "Helvetica",

        color: "#333",

    },

    header: {

        marginBottom: 25,

        borderBottomWidth: 1,

        borderBottomColor: "#e5e7eb",

        paddingBottom: 15,

    },

    companyName: {

        fontSize: 26,

        fontWeight: "bold",

        color: "#16a34a",

    },

    invoiceTitle: {

        fontSize: 18,

        marginTop: 8,

        fontWeight: "bold",

    },

    section: {

        marginTop: 20,

    },

    heading: {

        fontSize: 13,

        marginBottom: 8,

        fontWeight: "bold",

    },

    row: {

        flexDirection: "row",

        justifyContent: "space-between",

        marginBottom: 4,

    },

    table: {

        marginTop: 20,

        borderWidth: 1,

        borderColor: "#ddd",

    },

    tableHeader: {

        flexDirection: "row",

        backgroundColor: "#f3f4f6",

        borderBottomWidth: 1,

        borderBottomColor: "#ddd",

        padding: 8,

        fontWeight: "bold",

    },

    tableRow: {

        flexDirection: "row",

        borderBottomWidth: 1,

        borderBottomColor: "#eee",

        padding: 8,

    },

    product: {

        flex: 3,

    },

    qty: {

        flex: 1,

        textAlign: "center",

    },

    price: {

        flex: 1,

        textAlign: "right",

    },

    total: {

        flex: 1,

        textAlign: "right",

    },

    summary: {

        marginTop: 25,

        alignSelf: "flex-end",

        width: 220,

    },

    summaryRow: {

        flexDirection: "row",

        justifyContent: "space-between",

        marginBottom: 6,

    },

    grandTotal: {

        marginTop: 10,

        borderTopWidth: 1,

        borderTopColor: "#000",

        paddingTop: 10,

        fontSize: 13,

        fontWeight: "bold",

    },

    footer: {

        marginTop: 45,

        textAlign: "center",

        fontSize: 10,

        color: "#777",

    },

});

export default function InvoiceDocument({ order }) {

    const currency =
        process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "₹";

    return (

        <Document>

            <Page size="A4" style={styles.page}>

                {/* Header */}

                <View style={styles.header}>

                    <Text style={styles.companyName}>

                        GoCart

                    </Text>

                    <Text style={styles.invoiceTitle}>

                        TAX INVOICE

                    </Text>

                </View>

                {/* Invoice Details */}

                <View style={styles.section}>

                    <Text style={styles.heading}>

                        Invoice Details

                    </Text>

                    <Text>

                        Invoice #: {order.id}

                    </Text>

                    <Text>

                        Date: {new Date(order.createdAt).toLocaleDateString()}

                    </Text>

                </View>

                {/* Customer */}

                <View style={styles.section}>

                    <Text style={styles.heading}>

                        Customer Details

                    </Text>

                    <Text>{order.address.name}</Text>

                    <Text>{order.address.email}</Text>

                    <Text>{order.address.phone}</Text>

                    <Text>

                        {order.address.street}

                    </Text>

                    <Text>

                        {order.address.city},{" "}
                        {order.address.state}

                    </Text>

                    <Text>

                        {order.address.country} -{" "}
                        {order.address.zip}

                    </Text>

                </View>

                {/* Products */}

                <View style={styles.table}>

                    <View style={styles.tableHeader}>

                        <Text style={styles.product}>
                            Product
                        </Text>

                        <Text style={styles.qty}>
                            Qty
                        </Text>

                        <Text style={styles.price}>
                            Price
                        </Text>

                        <Text style={styles.total}>
                            Total
                        </Text>

                    </View>

                    {order.orderItems.map((item) => (

                        <View
                            key={item.productId}
                            style={styles.tableRow}
                        >

                            <Text style={styles.product}>
                                {item.product.name}
                            </Text>

                            <Text style={styles.qty}>
                                {item.quantity}
                            </Text>

                            <Text style={styles.price}>
                                {currency}
                                {item.price}
                            </Text>

                            <Text style={styles.total}>
                                {currency}
                                {(
                                    item.price *
                                    item.quantity
                                ).toFixed(2)}
                            </Text>

                        </View>

                    ))}

                </View>

                {/* Summary */}

                <View style={styles.summary}>

                    <View style={styles.summaryRow}>

                        <Text>

                            Subtotal

                        </Text>

                        <Text>

                            {currency}
                            {order.subTotal}

                        </Text>

                    </View>

                    <View style={styles.summaryRow}>

                        <Text>

                            Shipping

                        </Text>

                        <Text>

                            {currency}
                            {order.shippingCharge}

                        </Text>

                    </View>

                    <View style={styles.summaryRow}>

                        <Text>

                            Tax

                        </Text>

                        <Text>

                            {currency}
                            {order.tax}

                        </Text>

                    </View>

                    <View
                        style={[
                            styles.summaryRow,
                            styles.grandTotal,
                        ]}
                    >

                        <Text>

                            Grand Total

                        </Text>

                        <Text>

                            {currency}
                            {order.total}

                        </Text>

                    </View>

                </View>

                {/* Payment */}

                <View style={styles.section}>

                    <Text style={styles.heading}>

                        Payment Information

                    </Text>

                    <Text>

                        Method: {order.paymentMethod}

                    </Text>

                    <Text>

                        Status: {order.payment?.status}

                    </Text>

                    <Text>

                        Transaction ID:{" "}
                        {order.payment?.transactionId || "N/A"}

                    </Text>

                </View>

                {/* Footer */}

                <Text style={styles.footer}>

                    Thank you for shopping with GoCart.

                </Text>

            </Page>

        </Document>

    );

}