// StepRoute.js
import { Navigate } from "react-router-dom";

const StepRoute = ({ children, step }) => {
  const isAllowed =
    (step === "foundvehicle" && localStorage.getItem("step_addvehicle")) ||
    (step === "waitscreen" && localStorage.getItem("step_foundvehicle")) ||
    (step === "mainpage" && localStorage.getItem("step_waitscreen")) || 
    // (step === "booking" && localStorage.getItem("step_booking"))
     (step === "booking" && localStorage.getItem("step_booking")) ||
    (step === "bookpayment" && localStorage.getItem("step_booking"));
    

  // If allowed, render the child route, otherwise redirect to "/"
  return isAllowed ? children : <Navigate to="/" />;
};

export default StepRoute;
