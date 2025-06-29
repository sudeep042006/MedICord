import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { useParams, useNavigate } from "react-router-dom";
import "../CSS/PatientDashBoard.css";
import NavBar_Logout from "./NavBar_Logout";
import PatientRegistration from "../build/contracts/PatientRegistration.json";

const PatientDashBoard = () => {
  const { hhNumber } = useParams(); // Retrieve the hhNumber from the URL parameter

  const navigate = useNavigate();
  
  const viewRecord = () => {
    navigate(`/patient/${hhNumber}/viewrecords`);
  };

  const viewprofile = () => {
    navigate("/patient/" + hhNumber + "/viewprofile");
  };

  const managePermissions = () => {
    navigate("/patient/" + hhNumber + "/grantpermission");
  };
  

  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [patientPhoneNo, setPatientPhoneNo] = useState(null);
  const [patientDetails, setPatientDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        const networkId = await web3Instance.eth.net.getId();
        const deployedNetwork = PatientRegistration.networks[networkId];
        const contractInstance = new web3Instance.eth.Contract(
          PatientRegistration.abi,
          deployedNetwork && deployedNetwork.address,
        );
        setContract(contractInstance);
        setPatientPhoneNo(hhNumber);
        try {
          const result = await contractInstance.methods.getPatientDetails(patientPhoneNo).call();
          setPatientDetails(result);
        } catch (error) {
          console.error('Error retrieving patient details:', error);
          setError('Error retrieving patient details');
        }
      } else {
        console.log('Please install MetaMask extension');
        setError('Please install MetaMask extension');
      }
    };

    init();
  }, [patientPhoneNo]);

  return (
    <div>
      <NavBar_Logout />
      <div className="bg-gradient-to-b from-black to-gray-800 p-4 sm:p-10 font-mono text-white min-h-screen">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-center">Patient Dashboard</h2>
          
          {error && (
            <div className="bg-red-600 text-white p-4 rounded-lg mb-6 text-center">
              {error}
            </div>
          )}
          
          {patientDetails && (
            <p className="text-xl sm:text-2xl mb-8 text-center">
              Welcome{" "}
              <span className="font-bold text-yellow-500">{patientDetails.name}!</span>
            </p>
          )}

          {/* Main Dashboard Actions */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <button
              onClick={viewprofile}
              className="p-6 bg-teal-500 hover:bg-teal-600 text-white rounded-lg focus:outline-none focus:ring focus:ring-teal-400 transition duration-300 flex flex-col items-center"
            >
              <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              View Profile
            </button>
            
            <button
              onClick={viewRecord}
              className="p-6 bg-blue-500 hover:bg-blue-600 text-white rounded-lg focus:outline-none focus:ring focus:ring-blue-400 transition duration-300 flex flex-col items-center"
            >
              <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              View Records
            </button>

            <button
              onClick={managePermissions}
              className="p-6 bg-purple-500 hover:bg-purple-600 text-white rounded-lg focus:outline-none focus:ring focus:ring-purple-400 transition duration-300 flex flex-col items-center"
            >
              <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Manage Permissions
            </button>
          </div>

          {/* Quick Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold mb-2 text-teal-400">Your Information</h3>
              <p className="text-gray-400 text-sm">
                View and manage your personal information and medical profile.
              </p>
            </div>
            
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold mb-2 text-blue-400">Medical Records</h3>
              <p className="text-gray-400 text-sm">
                Access your medical records and view your health history.
              </p>
            </div>
          </div>

          <div className="mt-6 bg-gray-900 p-6 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold mb-2 text-purple-400">Doctor Permissions</h3>
            <p className="text-gray-400 text-sm">
              Control which doctors can view your medical records. You can grant or revoke access to any registered doctor.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashBoard;
