// import React from "react";
// import LoginForm from "./screens/LoginForm";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import SignUp from "./screens/SignUp";
// import Profile from "./screens/Profile";
// import PrivateRoute from "./ProtectedRoute/PrivateRoute";
// import HomePage from "./screens/HomePage";
// import PermissonPage from "./screens/PermissonPage";
// import AddVehiclePage from "./screens/AddVehical";
// import FoundVehicle from "./screens/FoundVehicle";
// import Waitscreen from "./screens/Waitscreen";
// import MainPage from './screens/MainPage';
// import NearbyFuelMap from "./screens/NearbyFuelMap";
// import Bookings from "./screens/Bookings";
// import Pressure from "./screens/Pressure";
// import Bookconfirmed from "./screens/Bookconfirmed";  
// import Overview from "./profilescreens/Overview";
// import Savedstations from './profilescreens/Savedstations';
// import PaymentMethods from './profilescreens/PaymentMethods';
// import Historypage from './profilescreens/Historypage';
// import 'leaflet/dist/leaflet.css';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/login" element={<LoginForm />} />
//         <Route path = "/signup" element={<SignUp/>}/>
//         <Route path= "/" element ={<HomePage/>}/>
//         <Route 
        
//         path="/permission"
//         element=
//         {
//           <PrivateRoute>
//             <PermissonPage/>
//           </PrivateRoute>
//         }
//         />
//           <Route path= "/permission" element ={<PermissonPage/>}/>
//         <Route path="/addvehicle" element={<AddVehiclePage />}/>
//         <Route path="/foundvehicle" element={<FoundVehicle/>}/>
//         <Route path="/waitscreen" element={<Waitscreen/>}/>
//         <Route path="/mainpage" element={<MainPage/>}/>
//         <Route path = "/stations" element={<NearbyFuelMap/>}/>
//         <Route path = "/bookings" element={<Bookings/>}/>
//         <Route path = "/pressure" element={<Pressure/>}/>
//         <Route path="/bookconfirmed" element={<Bookconfirmed/>}/>
//    <Route path="/profile" element={<Profile />}>
//           <Route index element={<Overview />} /> {/* Default */}
//           <Route path="overview" element={<Overview />} />
//           <Route path="saved" element={<Savedstations />} />
//           <Route path="payment" element={<PaymentMethods />} />
//           <Route path="history" element={<Historypage />} />
//         </Route>
//       </Routes>
//     </Router>
//   );
// }

// export default App;



import React from "react";
import LoginForm from "./screens/LoginForm";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./screens/SignUp";
import Profile from "./screens/Profile";
import PrivateRoute from "./ProtectedRoute/PrivateRoute";
import HomePage from "./screens/HomePage";
import PermissonPage from "./screens/PermissonPage";
import AddVehiclePage from "./screens/AddVehical";
import FoundVehicle from "./screens/FoundVehicle";
import Waitscreen from "./screens/Waitscreen";
import MainPage from './screens/MainPage';
import NearbyFuelMap from "./screens/NearbyFuelMap";
import Bookings from "./screens/Bookings";
import Pressure from "./screens/Pressure";
import Bookconfirmed from "./screens/Bookconfirmed";
import Overview from "./profilescreens/Overview";
import Savedstations from './profilescreens/Savedstations';
// import PaymentMethods from './profilescreens/PaymentMethods';
import Historypage from './profilescreens/Historypage';
import Videos from "./screens/Videos";
import 'leaflet/dist/leaflet.css';
import BookPayment from "./screens/BookPayment";
import StepRoute from "./ProtectedRoute/StepRoute";
import OAuthCallback from './screens/OAuthCallback';
import PhoneVerify from "./screens/PhoneVerify";
import ContactUs from "./PrivacyPolicyRoute/ContactUs";
import PrivacyPolicy from "./PrivacyPolicyRoute/PrivacyPolicy";
import AboutUs from "./PrivacyPolicyRoute/AboutUs";
 
import FeedbackPage from "./profilescreens/FeedbackPage";
function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/phoneverify" element={<PhoneVerify />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/aboutus" element={<AboutUs />} />


        {/* Protected Routes */}
        <Route
          path="/permission"
          element={
            <PrivateRoute>
              <PermissonPage />
            </PrivateRoute>
          }
        />
        <Route path="/oauth-callback" element={<OAuthCallback />} />
         <Route
          path="/video"
          element={
            <PrivateRoute>
              <Videos />
            </PrivateRoute>
          }
        />
        <Route
          path="/addvehicle"
          element={
            <PrivateRoute>
              <AddVehiclePage />
            </PrivateRoute>
          }
        />
        {/* <Route
          path="/foundvehicle"
          element={
            <PrivateRoute>
              <FoundVehicle />
            </PrivateRoute>
          }
        /> */}
        <Route
  path="/foundvehicle"
  element={
    <PrivateRoute>
      <StepRoute step="foundvehicle">
        <FoundVehicle />
      </StepRoute>
    </PrivateRoute>
  }
/>
        {/* <Route
          path="/waitscreen"
          element={
            <PrivateRoute>
              <Waitscreen />
            </PrivateRoute>
          }
        /> */}
        <Route
  path="/waitscreen"
  element={
    <PrivateRoute>
      <StepRoute step="waitscreen">
        <Waitscreen />
      </StepRoute>
    </PrivateRoute>
  }
/>
        {/* <Route
          path="/mainpage"
          element={
            <PrivateRoute>
              <MainPage />
            </PrivateRoute>
          }
        /> */}
        <Route
  path="/mainpage"
  element={
    <PrivateRoute>
      <StepRoute step="mainpage">
        <MainPage />
      </StepRoute>
    </PrivateRoute>
  }
/>
        <Route
          path="/stations"
          element={
            <PrivateRoute>
              <StepRoute step="mainpage">
              <NearbyFuelMap />
        {/* <MainPage /> */}
      </StepRoute>
            </PrivateRoute>
          }
        />
        <Route
          path="/bookings"
          element={
            <PrivateRoute>
              <StepRoute step="mainpage">
        {/* <MainPage /> */}
              <Bookings />
      </StepRoute>
            </PrivateRoute>
          }
        />
        <Route
          path="/pressure"
          element={
            <PrivateRoute>
              <StepRoute step="mainpage">
        {/* <MainPage /> */}
              <Pressure />
      </StepRoute>
            </PrivateRoute>
          }
        />
        <Route
          path="/bookconfirmed"
          element={
            
            <PrivateRoute>
              <StepRoute step="mainpage">
        {/* <MainPage /> */}
              <Bookconfirmed />
      </StepRoute>
            </PrivateRoute>
          }
        />
        <Route
          path="/bookpayment"
          element={
           <PrivateRoute>
      <StepRoute step="bookpayment">
        {/* <MainPage /> */}
      <BookPayment/>
      </StepRoute>
    </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        >
          <Route index element={<Overview />} />
          <Route path="overview" element={<Overview />} />
          <Route path="saved" element={<Savedstations />} />
          <Route path="history" element={<Historypage />} />
          <Route path="feedback" element={<FeedbackPage/>} />
        </Route>
      </Routes>
    </Router>
      // <Route path="payment" element={<PaymentMethods />} />
  );
}

export default App;
