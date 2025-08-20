// // import React from "react";

// // const PaymentMethods = () => {
// //   return (
// //     <div className="flex flex-col md:flex-row gap-6 p-4 md:p-8 bg-white rounded-xl border border-gray-300 max-w-4xl mx-auto">
// //       {/* Payment Methods Section */}
// //       <div className="flex-1 border border-gray-300 rounded-xl p-6 bg-white">
// //         <h2 className="text-xl font-bold mb-4">Payment Methods</h2>
// //         <div>
// //           <div className="mb-6">
// //             <p className="text-sm text-gray-600 mb-2">Default Payment Method</p>
// //             <div className="flex items-center gap-4 bg-orange-50 border border-orange-200 rounded-lg p-4">
// //               <div className="flex items-center justify-center w-14 h-10 bg-gray-200 rounded shadow-inner">
// //                 <span className="text-lg font-semibold text-gray-700">Visa</span>
// //               </div>
// //               <div>
// //                 <div className="text-gray-800 font-medium tracking-wider">XXX XXX XXX 456</div>
// //                 <div className="text-xs text-gray-500">Expires 12/27</div>
// //               </div>
// //             </div>
// //           </div>
// //           <div>
// //             <p className="text-sm text-gray-600 mb-2">Other Payment Methods</p>
// //             <div className="flex flex-col gap-2">
// //               <div className="border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition">
// //                 UPI &gt;&gt;
// //               </div>
// //               <div className="border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition">
// //                 Other ..
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Transaction History Section */}
// //       <div className="flex-1 border border-gray-300 rounded-xl p-6 bg-white">
// //         <div className="flex items-center justify-between mb-2">
// //           <h2 className="text-xl font-bold">Transaction History</h2>
// //           <span className="text-orange-500 text-sm font-medium cursor-pointer">View All</span>
// //         </div>
// //         <div className="divide-y divide-gray-200">
// //           <div className="py-3 flex justify-between items-start">
// //             <div>
// //               <div className="font-medium text-gray-800">HP Fuel Station</div>
// //               <div className="text-xs text-gray-500">Apr 26, 2025. Diesel</div>
// //             </div>
// //             <div className="font-semibold text-gray-800">₹650.00</div>
// //           </div>
// //           <div className="py-3 flex justify-between items-start">
// //             <div>
// //               <div className="font-medium text-gray-800">Indian Oil</div>
// //               <div className="text-xs text-gray-500">Apr 26, 2025. Petrol</div>
// //             </div>
// //             <div className="font-semibold text-gray-800">₹1,200.00</div>
// //           </div>
// //           <div className="py-3 flex justify-between items-start">
// //             <div>
// //               <div className="font-medium text-gray-800">Bharat Petroleum</div>
// //               <div className="text-xs text-gray-500">Apr 26, 2025. Petrol</div>
// //             </div>
// //             <div className="font-semibold text-gray-800">₹850.00</div>
// //           </div>
// //           <div className="py-3 flex justify-between items-start">
// //             <div>
// //               <div className="font-medium text-gray-800">Reliance Pump</div>
// //               <div className="text-xs text-gray-500">Apr 26, 2025. CNG</div>
// //             </div>
// //             <div className="font-semibold text-gray-800">₹400.00</div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default PaymentMethods;

// // import React from "react";
// // import { useState } from "react";

// // const PaymentMethods = () => {

// //   const [user , setUser] = useState('');

// //   const handleuser = async()=>{
// //     try
// //     {
// //       const token = localStorage.getItem('token');
// //       if(!navigate)
// //       {
// //         alert("Please Login First ! ")  
// //         navigate("/login");
// //         return ;
// //       }
// //        const response = await await axiosInstance.get('/api/users/getregister' , {

// //         headers:{Authorization : `Bearer ${token}`} ,
// //        });
// //        if(response.data)
// //        {
// //         setUser(response) ;
// //        }
// //     }
// //     catch (error) {
// //       if (error.response?.status === 401) {
// //         localStorage.clear();
// //         navigate("/login");
// //       }
// //   }
// //   }


// //   const loadRazorpay = () => {
// //     const options = {
// //       key: "rzp_test_JmBCRfTmwicMor", // Test API Key
// //       amount: 10000, // in paise = ₹100
// //       currency: "INR",
// //       name: "Fuel Flux",
// //       description: "Fuel Station Booking Payment",
// //       image: "https://your-logo-url.com/logo.png", // Optional
// //       handler: function (response) {
// //         alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);
// //       },
// //       prefill: {
// //         name:  user.username,
// //         email: user.email,
// //         contact: user.phonenumber
// //       },
// //       notes: {
// //         address: "Fuel Flux Corporate Office"
// //       },
// //       theme: {
// //         color: "#F97316" // Orange
// //       }
// //     };

// //     const rzp = new window.Razorpay(options);
// //     rzp.open();
// //   };

// //   return (
// //     <div className="flex flex-col md:flex-row gap-6 p-4 md:p-8 bg-white rounded-xl border border-gray-300 max-w-4xl mx-auto">
// //       {/* Payment Methods Section */}
// //       <div className="flex-1 border border-gray-300 rounded-xl p-6 bg-white">
// //         <h2 className="text-xl font-bold mb-4">Payment Methods</h2>
// //         <div>
// //           <div className="mb-6">
// //             <p className="text-sm text-gray-600 mb-2">Default Payment Method</p>
// //             <div className="flex items-center gap-4 bg-orange-50 border border-orange-200 rounded-lg p-4">
// //               <div className="flex items-center justify-center w-14 h-10 bg-gray-200 rounded shadow-inner">
// //                 <span className="text-lg font-semibold text-gray-700">Visa</span>
// //               </div>
// //               <div>
// //                 <div className="text-gray-800 font-medium tracking-wider">XXX XXX XXX 456</div>
// //                 <div className="text-xs text-gray-500">Expires 12/27</div>
// //               </div>
// //             </div>
// //           </div>
// //           <div>
// //             <p className="text-sm text-gray-600 mb-2">Other Payment Methods</p>
// //             <div className="flex flex-col gap-2">
// //               <div
// //                 onClick={loadRazorpay}
// //                 className="border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition"
// //               >
// //                 UPI &gt;&gt; <span className="text-orange-500 font-medium">Pay Now</span>
// //               </div>
// //               <div className="border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition">
// //                 Other ..
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Transaction History Section */}
// //       <div className="flex-1 border border-gray-300 rounded-xl p-6 bg-white">
// //         <div className="flex items-center justify-between mb-2">
// //           <h2 className="text-xl font-bold">Transaction History</h2>
// //           <span className="text-orange-500 text-sm font-medium cursor-pointer">View All</span>
// //         </div>
// //         <div className="divide-y divide-gray-200">
// //           <div className="py-3 flex justify-between items-start">
// //             <div>
// //               <div className="font-medium text-gray-800">HP Fuel Station</div>
// //               <div className="text-xs text-gray-500">Apr 26, 2025. Diesel</div>
// //             </div>
// //             <div className="font-semibold text-gray-800">₹650.00</div>
// //           </div>
// //           <div className="py-3 flex justify-between items-start">
// //             <div>
// //               <div className="font-medium text-gray-800">Indian Oil</div>
// //               <div className="text-xs text-gray-500">Apr 26, 2025. Petrol</div>
// //             </div>
// //             <div className="font-semibold text-gray-800">₹1,200.00</div>
// //           </div>
// //           <div className="py-3 flex justify-between items-start">
// //             <div>
// //               <div className="font-medium text-gray-800">Bharat Petroleum</div>
// //               <div className="text-xs text-gray-500">Apr 26, 2025. Petrol</div>
// //             </div>
// //             <div className="font-semibold text-gray-800">₹850.00</div>
// //           </div>
// //           <div className="py-3 flex justify-between items-start">
// //             <div>
// //               <div className="font-medium text-gray-800">Reliance Pump</div>
// //               <div className="text-xs text-gray-500">Apr 26, 2025. CNG</div>
// //             </div>
// //             <div className="font-semibold text-gray-800">₹400.00</div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default PaymentMethods;



// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axiosInstance from "../../Utils/axiosInstance"; // Update the path as per your project
 
// import { loadRazorpay } from "../../Utils/loadRazorpay";
// const PaymentMethods = () => {
//   const [user, setUser] = useState({});
//   const navigate = useNavigate();

//   const handleuser = async () => {
//     try {
//       const token = localStorage.getItem("token");

//       if (!token) {
//         alert("Please login first!");
//         navigate("/login");
//         return;
//       }

//       const response = await axiosInstance.get("/api/users/getregister", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (response.data) {
//         setUser(response.data);
//       }
//     } catch (error) {
//       if (error.response?.status === 401) {
//         localStorage.clear();
//         navigate("/login");
//       }
//     }
//   };

//   useEffect(() => {
//     handleuser();
//   }, []);

//   // const loadRazorpay = () => {
//   //   const options = {
//   //     key: "rzp_test_JmBCRfTmwicMor", // Test API Key
//   //     amount: 10000, // ₹100 in paise
//   //     currency: "INR",
//   //     name: user.username || "Guest",
//   //     description: "Fuel Station Booking Payment",
//   //     image: "https://your-logo-url.com/logo.png", // Optional
//   //     handler: function (response) {
//   //       alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);
//   //     },
//   //     prefill: {
//   //       name: user.username || "Guest",
//   //       email: user.email || "guest@example.com",
//   //       contact: user.phonenumber || "9999999999",
//   //     },
//   //     notes: {
//   //       address: "Fuel Flux Corporate Office",
//   //     },
//   //     theme: {
//   //       color: "#F97316",
//   //     },
//   //   };

//   //   const rzp = new window.Razorpay(options);
//   //   rzp.open();
//   // };

//   return (
//     <div className="flex flex-col md:flex-row gap-6 p-4 md:p-8 bg-white rounded-xl border border-gray-300 max-w-4xl mx-auto">
//       {/* Payment Methods Section */}
//       <div className="flex-1 border border-gray-300 rounded-xl p-6 bg-white">
//         <h2 className="text-xl font-bold mb-4">Payment Methods</h2>
//         <div>
//           <div className="mb-6">
//             <p className="text-sm text-gray-600 mb-2">Default Payment Method</p>
//             <div className="flex items-center gap-4 bg-orange-50 border border-orange-200 rounded-lg p-4">
//               <div className="flex items-center justify-center w-14 h-10 bg-gray-200 rounded shadow-inner">
//                 <span className="text-lg font-semibold text-gray-700">Visa</span>
//               </div>
//               <div>
//                 <div className="text-gray-800 font-medium tracking-wider">XXX XXX XXX 456</div>
//                 <div className="text-xs text-gray-500">Expires 12/27</div>
//               </div>
//             </div>
//           </div>
//           <div>
//             <p className="text-sm text-gray-600 mb-2">Other Payment Methods</p>
//            <div
//   onClick={() =>
//     loadRazorpay({
//       // amountInPaise: 10000, // ₹100
//       user: user,
//     })
//   }
//   className="border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition"
// >
//   UPI &gt;&gt; <span className="text-orange-500 font-medium">Pay Now</span>
// </div>

//           </div>
//         </div>
//       </div>

//       {/* Transaction History Section */}
//       <div className="flex-1 border border-gray-300 rounded-xl p-6 bg-white">
//         <div className="flex items-center justify-between mb-2">
//           <h2 className="text-xl font-bold">Transaction History</h2>
//           <span className="text-orange-500 text-sm font-medium cursor-pointer">View All</span>
//         </div>
//         <div className="divide-y divide-gray-200">
//           <div className="py-3 flex justify-between items-start">
//             <div>
//               <div className="font-medium text-gray-800">HP Fuel Station</div>
//               <div className="text-xs text-gray-500">Apr 26, 2025. Diesel</div>
//             </div>
//             <div className="font-semibold text-gray-800">₹650.00</div>
//           </div>
//           <div className="py-3 flex justify-between items-start">
//             <div>
//               <div className="font-medium text-gray-800">Indian Oil</div>
//               <div className="text-xs text-gray-500">Apr 26, 2025. Petrol</div>
//             </div>
//             <div className="font-semibold text-gray-800">₹1,200.00</div>
//           </div>
//           <div className="py-3 flex justify-between items-start">
//             <div>
//               <div className="font-medium text-gray-800">Bharat Petroleum</div>
//               <div className="text-xs text-gray-500">Apr 26, 2025. Petrol</div>
//             </div>
//             <div className="font-semibold text-gray-800">₹850.00</div>
//           </div>
//           <div className="py-3 flex justify-between items-start">
//             <div>
//               <div className="font-medium text-gray-800">Reliance Pump</div>
//               <div className="text-xs text-gray-500">Apr 26, 2025. CNG</div>
//             </div>
//             <div className="font-semibold text-gray-800">₹400.00</div>
//           </div>
//         </div>
//       </div>

//       {/* <BookPayment onConfirmBook={loadRazorpay} /> */}
//     </div>
//   );
// };

// export default PaymentMethods;
