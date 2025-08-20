// utils/loadRazorpay.js
import axiosInstance from "./axiosInstance";
 
export const loadRazorpay = ({ amountInPaise , user , navigate} ) => {
  const options = {
    key: "rzp_test_JmBCRfTmwicMor", // Test API Key
    amount: amountInPaise, // ₹100 in paise
    currency: "INR",
    name: user?.username || "Guest",
    description: "Fuel Station Booking Payment",
    image: "https://your-logo-url.com/logo.png", // Optional
    
    // handler: async function (response) {
    //   alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);
    //     const { razorpay_payment_id  } = response;

    //   console.log("Payment ID:", razorpay_payment_id);
    //   try
    //   {
    //     const response = await axiosInstance.post({
    //       userid: user?._id , 
    //       paymentid : razorpay_payment_id
    //     })
    //     console.log("Payment stored:", response.data);
    //   }
    //  catch (error) {
    //     console.error("Failed to store payment:", error);
    //     alert("Payment success, but failed to store it.");
    //   }
     
    // },
    
    handler: async function (response) {
  const { razorpay_payment_id } = response;
  alert("Payment Successful! Payment ID: " + razorpay_payment_id);
  console.log("Payment ID:", razorpay_payment_id);
   navigate("/mainpage"); 

  try {
    const res = await axiosInstance.post('/api/payments/paymentdetail', {
      paymentid: razorpay_payment_id
    });
    console.log("Payment stored:", res.data);
  } catch (error) {
    console.error("Failed to store payment:", error);
    alert("Payment success, but failed to store it.");
  }
}
,
    prefill: {
      name: user?.username || "Guest",
      email: user?.email || "guest@example.com",
      contact: user?.phonenumber || "9999999999",
    },
    notes: {
      address: "Fuel Flux Corporate Office",
    },
    theme: {
      color: "#F97316",
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};
