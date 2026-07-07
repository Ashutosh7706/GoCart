import Razorpay from "razorpay";

const razorpay = new Razorpay({

    key_id: process.env.RAZORPAY_KEY_ID,

    key_secret: process.env.RAZORPAY_KEY_SECRET,

});

export async function createRefund({

    paymentId,

    amount,

}) {

    try {

        const refund = await razorpay.payments.refund(

            paymentId,

            {

                amount: Math.round(amount * 100),

                speed: "normal",

            }

        );

        return {

            success: true,

            refund,

        };

    }

    catch(error){

        console.error(error);

        return{

            success:false,

            error:error.message,

        };

    }

}