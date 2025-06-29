import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { useParams, Link, useNavigate } from "react-router-dom";
import NavBar_Logout from "./NavBar_Logout";
import DoctorRegistration from "../build/contracts/DoctorRegistration.json";
import DoctorPatientList from "./DoctorPatientList";
<<<<<<< HEAD
import CreateRecord from "./CreateRecord";
=======
>>>>>>> 3cf79c2301a79171c87b11c7f127cbc09bae465f

const DoctorDashBoardPage = () => {
  const { hhNumber } = useParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState(null);
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [error, setError] = useState(null);
  const [showPatientList, setShowPatientList] = useState(false);
<<<<<<< HEAD
  const [showCreateRecord, setShowCreateRecord] = useState(false);
=======
>>>>>>> 3cf79c2301a79171c87b11c7f127cbc09bae465f

  const viewPatientList = () => {
    navigate("/doctor/"+hhNumber+"/patientlist");
  };

  const viewDoctorProfile = () => {
    navigate("/doctor/"+hhNumber+"/viewdoctorprofile");
  };

<<<<<<< HEAD
  const viewAllPatients = () => {
    navigate("/doctor/"+hhNumber+"/allpatients");
  };

=======
>>>>>>> 3cf79c2301a79171c87b11c7f127cbc09bae465f
  useEffect(() => {
    const init = async () => {
      // Check if Web3 is injected by MetaMask or any other provider
      if (window.ethereum) {
        try {
          const web3Instance = new Web3(window.ethereum);
          const networkId = await web3Instance.eth.net.getId();
          const deployedNetwork = DoctorRegistration.networks[networkId];
          const contractInstance = new web3Instance.eth.Contract(
            DoctorRegistration.abi,
            deployedNetwork && deployedNetwork.address
          );
          setContract(contractInstance);

          // Call the getDoctorDetails function of the smart contract
          const result = await contractInstance.methods.getDoctorDetails(hhNumber).call();
          setDoctorDetails(result);
        } catch (error) {
          console.error('Error initializing Web3 or fetching doctor details:', error);
          setError('Error initializing Web3 or fetching doctor details');
        }
      } else {
        console.error('Please install MetaMask extension');
        setError('Please install MetaMask extension');
      }
    };

    init();
  }, [hhNumber]);

  return (
    <div>
    <NavBar_Logout></NavBar_Logout>
<<<<<<< HEAD
    <div className="bg-gradient-to-b from-black to-gray-800 p-4 sm:p-10 font-mono text-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-center">Doctor Dashboard</h2>
        
        {error && (
          <div className="bg-red-600 text-white p-4 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}
        
        {doctorDetails && (
          <p className="text-xl sm:text-2xl mb-8 text-center">
=======
    <div className="bg-gradient-to-b from-black to-gray-800 p-4 sm:p-10 font-mono text-white h-screen flex flex-col justify-center items-center">
      <h2 className="text-3xl sm:text-4xl font-bold mb-6">Doctor Dashboard</h2>
        {doctorDetails && (
          <p className="text-xl sm:text-2xl mb-24">
>>>>>>> 3cf79c2301a79171c87b11c7f127cbc09bae465f
            Welcome{" "}
            <span className="font-bold text-yellow-500">{doctorDetails[1]}!</span>
          </p>
        )}
<<<<<<< HEAD

        {/* Main Dashboard Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <button
            onClick={viewDoctorProfile}
            className="px-6 py-4 bg-teal-500 hover:bg-teal-600 text-white rounded-lg focus:outline-none focus:ring focus:ring-teal-400 transition duration-300 flex flex-col items-center"
          >
            <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            View Profile
          </button>
          
          <button
            onClick={() => setShowPatientList(!showPatientList)}
            className="px-6 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg focus:outline-none focus:ring focus:ring-blue-400 transition duration-300 flex flex-col items-center"
          >
            <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            My Patients
          </button>

          <button
            onClick={() => setShowCreateRecord(!showCreateRecord)}
            className="px-6 py-4 bg-green-500 hover:bg-green-600 text-white rounded-lg focus:outline-none focus:ring focus:ring-green-400 transition duration-300 flex flex-col items-center"
          >
            <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create Record
          </button>

          <button
            onClick={viewAllPatients}
            className="px-6 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-lg focus:outline-none focus:ring focus:ring-orange-400 transition duration-300 flex flex-col items-center"
          >
            <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            All Patients
          </button>

          <button
            onClick={viewPatientList}
            className="px-6 py-4 bg-purple-500 hover:bg-purple-600 text-white rounded-lg focus:outline-none focus:ring focus:ring-purple-400 transition duration-300 flex flex-col items-center"
          >
            <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Full View
          </button>
        </div>

        {/* Dynamic Content Sections */}
        {showPatientList && (
          <div className="mb-8">
            <DoctorPatientList />
          </div>
        )}

        {showCreateRecord && (
          <div className="mb-8">
            <CreateRecord />
          </div>
        )}

        {/* Quick Stats or Info */}
        <div className="grid md:grid-cols-4 gap-6 mt-8">
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold mb-2 text-teal-400">Profile</h3>
            <p className="text-gray-400 text-sm">
              View and manage your professional profile and credentials.
            </p>
          </div>
          
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold mb-2 text-blue-400">My Patients</h3>
            <p className="text-gray-400 text-sm">
              View patients who have granted you permission to access their records.
            </p>
          </div>
          
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold mb-2 text-green-400">Create Records</h3>
            <p className="text-gray-400 text-sm">
              Create new medical records for your authorized patients.
            </p>
          </div>

          <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold mb-2 text-orange-400">All Patients</h3>
            <p className="text-gray-400 text-sm">
              Browse all registered patients and request permission to view their records.
            </p>
          </div>
        </div>
      </div>
=======
      <div className="space-y-4 space-x-4">
        <button
          onClick={viewDoctorProfile}
          className="px-6 py-3 bg-teal-500 hover-bg-gray-600 text-white rounded-lg focus:outline-none focus:ring focus:ring-teal-400 transition duration-300"
        >
          View Profile
        </button>
        
        <button
        onClick={() => setShowPatientList(true)}
        className="px-6 py-3 bg-teal-500 hover-bg-gray-600 text-white rounded-lg focus:outline-none focus:ring focus:ring-teal-400 transition duration-300"
      >
        View Patient List
        </button>
      
      </div>
      {showPatientList && <DoctorPatientList />}
>>>>>>> 3cf79c2301a79171c87b11c7f127cbc09bae465f
      </div>
      </div>
  );
};

export default DoctorDashBoardPage;
