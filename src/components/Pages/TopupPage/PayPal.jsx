import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { ArrowBigLeftIcon } from "lucide-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PaymentMessage from "./PaymentMessage";
import { setUser } from "@/store/userSlice";
import { useRouter } from "next/navigation";


export default function PayPal({ goBack, amount }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);

    const [paymentMessage, setPaymentMessage] = useState(null);
  const initialOptions = {
    clientId: `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}`,
    // "enable-funding": "venmo",
    // "disable-funding": "",
    // country: "US",
    currency: "EUR",
    // "data-page-type": "product-details",
    // components: "buttons",
    // "data-sdk-integration-source": "developer-studio",
  };
  return (
    paymentMessage === null ?
    <div className=" w-full md:w-[600px] relative md:h-full grid gap-6">
      <div
        className="absolute -top-12 cursor-pointer flex items-center hover:translate-x-[-12px] duration-500 "
        onClick={goBack}
      >
        <ArrowBigLeftIcon strokeWidth={1} /> <p>Go Back</p>
      </div>
      <div className="relative">
        <PayPalScriptProvider options={initialOptions}>
          {loading && (
            <div className=" absolute flex justify-center items-center w-full">
              <div className=" w-full grid gap-6">
                <div className="h-16 duration-1000 w-full bg-gray-300 animate-pulse rounded-lg" />

                <div className="h-16 duration-700 w-full bg-gray-300 animate-pulse rounded-lg" />
              </div>
            </div>
          )}
          <PayPalButtons
            onInit={() => setLoading(false)}
            style={{
              color: "blue",
              label: "pay",
            }}
            createOrder={async () => {
              try {
                const response = await fetch("/api/checkout/paypal/orders", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  // use the "body" param to optionally pass additional order information
                  // like product ids and quantities
                  body: JSON.stringify({
                    amount,
                    user,
                  }),
                });

                const orderData = await response.json();

                if (orderData.id) {
                  return orderData.id;
                } else {
                  const errorDetail = orderData?.details?.[0];
                  const errorMessage = errorDetail
                    ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
                    : JSON.stringify(orderData);

                  throw new Error(errorMessage);
                }
              } catch (error) {
                console.error(error);
                setPaymentMessage(`Could not initiate PayPal Checkout...${error}`);
              }
            }}
            onApprove={async (data, actions) => {
              try {
                const response = await fetch(
                  `/api/checkout/paypal/orders/${data.orderID}/capture`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                  }
                );

                const orderData = await response.json();
                // Three cases to handle:
                //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
                //   (2) Other non-recoverable errors -> Show a failure message
                //   (3) Successful transaction -> Show confirmation or thank you message

                const errorDetail = orderData?.details?.[0];

                if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
                  // (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
                  // recoverable state, per https://developer.paypal.com/docs/checkout/standard/customize/handle-funding-failures/
                  return actions.restart();
                } else if (errorDetail) {
                  // (2) Other non-recoverable errors -> Show a failure message
                  throw new Error(
                    `${errorDetail.description} (${orderData.debug_id})`
                  );
                } else {
                  // (3) Successful transaction -> Show confirmation or thank you message
                  // Or go to another URL:  actions.redirect('thank_you.html');
                  const transaction =
                    orderData.purchase_units[0].payments.captures[0];
                  setPaymentMessage({
                    status: transaction.status,
                    id: transaction.id,
                    payerName: `${orderData?.payer?.name?.given_name} ${orderData?.payer?.name?.surname}`,
                    updatedBalance: Number(user.balance) + Number(amount),
                    message: `Your payment was successfull.`
                  });
                  dispatch(setUser({
                    ...user,
                    balance: Number(user.balance) + Number(amount)
                  }))
                  console.log(
                    "Capture result",
                    orderData
                  );
                }
              } catch (error) {
                console.error(error);
                
                setPaymentMessage({
                  status: 'error',
                  message: `Sorry, your transaction could not be processed...${error}`
                });
              }
            }}
          />
        </PayPalScriptProvider>
      </div>
    </div>: 
    <PaymentMessage 
    isOpen={true}
    onClose={()=>{
      router.push('/');
      goBack(); // go back to topup page
    }}
    paymentStatus={paymentMessage?.status} // 'COMPLETED' | 'error'
    payerName={paymentMessage?.payerName}
    updatedBalance={paymentMessage?.updatedBalance}
    id={paymentMessage?.id}
    message={paymentMessage?.message} // both success message or error message
    /> 
  );
}
