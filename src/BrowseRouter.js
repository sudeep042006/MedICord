import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Web3 from "web3";

import PatientRegistry from "./components/PatientRegistration";
import LoginPage from "./components/LoginPage";
import PatientDashBoard from "./components/PatientDashBoard";
import DoctorDashBoard from "./components/DoctorDashBoard";
import DiagnosticDashBoard from "./components/DiagnosticDashBoard";
import RegisterPage from "./components/RegisterPage";
import DoctorLogin from "./components/DoctorLogin";
import DiagnosticLogin from "./components/DiagnosticLogin";
import PatientLogin from "./components/PatientLogin";
import DiagnosticForm from "./components/DiagnosticForm";
import DoctorRegistry from "./components/DoctorRegistration";
import DiagnosticRegistry from "./components/DiagnosticsRegistration";
import Footer from "./components/Footer";
import LandingPage_1 from "./components/LandingPage_1";
import ViewPatientRecords from "./components/ViewPatientRecords";
import ViewPatientList from "./components/ViewPatientList";
import ViewProfile from "./components/ViewProfile";
import ViewDoctorProfile from "./components/ViewDoctorProfile";
import ViewDiagnosticProfile from "./components/ViewDiagnosticProfile";
import AboutUs from "./components/AboutPage"; 
<<<<<<< HEAD
import PatientRecords from "./components/PatientRecords";
import CreateRecord from "./components/CreateRecord";
import GrantPermission from "./components/GrantPermission";
import ViewAllPatients from "./components/ViewAllPatients";
=======
>>>>>>> 3cf79c2301a79171c87b11c7f127cbc09bae465f



const BrowseRouter = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loggedInPatient, setLoggedInPatient] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        try {
          await window.ethereum.enable();
          setWeb3(web3Instance);

          const fetchedAccounts = await web3Instance.eth.getAccounts();
          setAccounts(fetchedAccounts);
        } catch (error) {
          console.error("User denied access to accounts.");
        }
      } else {
        console.log("Please install MetaMask extension");
      }
    };

    init();
  }, []);
  return (
    <BrowserRouter>

      <Routes>
      <Route path="/AboutPage" element={<AboutUs></AboutUs>}></Route>

        <Route path="/" element={<LandingPage_1></LandingPage_1>}></Route>
        <Route path="/register" element={<RegisterPage></RegisterPage>}></Route>
        
        <Route
          path="/patient_registration"
          element={<PatientRegistry></PatientRegistry>}
        ></Route>
        <Route
          path="/doctor_registration"
          element={<DoctorRegistry></DoctorRegistry>}
        ></Route>
        <Route
          path="/diagnostic_registration"
          element={<DiagnosticRegistry></DiagnosticRegistry>}
        ></Route>
        <Route
          path="/patient_login"
          element={<PatientLogin></PatientLogin>}
        ></Route>
        <Route
          path="/doctor_login"
          element={<DoctorLogin></DoctorLogin>}
        ></Route>
      
        <Route
          path="/diagnostic_login"
          element={<DiagnosticLogin></DiagnosticLogin>}
        ></Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/patient/:hhNumber" element={<PatientDashBoard />}></Route>
        <Route path="/doctor/:hhNumber" element={<DoctorDashBoard />}></Route>
        <Route path="/diagnostic/:hhNumber" element={<DiagnosticDashBoard />}></Route>
        <Route
          path="/patient/:hhNumber/viewprofile"
          element={<ViewProfile />}
        ></Route>
        <Route
          path="/doctor/:hhNumber/viewdoctorprofile"
          element={<ViewDoctorProfile />}
        ></Route>
        <Route
          path="/diagnostic/:hhNumber/viewdiagnosticprofile"
          element={<ViewDiagnosticProfile />}
        ></Route>
        <Route
          path="/patient/:hhNumber/viewrecords"
<<<<<<< HEAD
          element={<PatientRecords />}
=======
          element={<ViewPatientRecords />}
>>>>>>> 3cf79c2301a79171c87b11c7f127cbc09bae465f
        ></Route>
        
        <Route 
        path="/diagnostic/:hhNumber/diagnosticform" 
        element={<DiagnosticForm></DiagnosticForm>}>
        </Route>

       
        <Route
          path="/doctor/:hhNumber/patientlist"
          element={<ViewPatientList />}
        ></Route>
<<<<<<< HEAD
        
        <Route
          path="/doctor/:hhNumber/createrecord"
          element={<CreateRecord />}
        ></Route>

        <Route
          path="/doctor/:hhNumber/allpatients"
          element={<ViewAllPatients />}
        ></Route>

        <Route
          path="/patient/:hhNumber/grantpermission"
          element={<GrantPermission />}
        ></Route>
=======
>>>>>>> 3cf79c2301a79171c87b11c7f127cbc09bae465f
       
       
      </Routes>
      <Footer></Footer>
    </BrowserRouter>
  );
};

export default BrowseRouter;
