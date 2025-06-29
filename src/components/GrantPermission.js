import React, { useState, useEffect } from "react";
import Web3 from "web3";
import PatientRegistration from "../build/contracts/PatientRegistration.json";
import DoctorRegistration from "../build/contracts/DoctorRegistration.json";
import { useParams, useNavigate } from "react-router-dom";
import NavBar_Logout from "./NavBar_Logout";

const GrantPermission = () => {
  const { hhNumber } = useParams();
  const navigate = useNavigate();
  const [patientContract, setPatientContract] = useState(null);
  const [doctorContract, setDoctorContract] = useState(null);
  const [patientDetails, setPatientDetails] = useState(null);
  const [doctorHHNumber, setDoctorHHNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [allDoctors, setAllDoctors] = useState([]);
  const [grantedDoctors, setGrantedDoctors] = useState([]);

  useEffect(() => {
    const initContracts = async () => {
      if (window.ethereum) {
        try {
          const web3Instance = new Web3(window.ethereum);
          const networkId = await web3Instance.eth.net.getId();
          
          // Initialize Patient Registration contract
          const patientDeployedNetwork = PatientRegistration.networks[networkId];
          const patientContractInstance = new web3Instance.eth.Contract(
            PatientRegistration.abi,
            patientDeployedNetwork && patientDeployedNetwork.address
          );
          setPatientContract(patientContractInstance);

          // Initialize Doctor Registration contract
          const doctorDeployedNetwork = DoctorRegistration.networks[networkId];
          const doctorContractInstance = new web3Instance.eth.Contract(
            DoctorRegistration.abi,
            doctorDeployedNetwork && doctorDeployedNetwork.address
          );
          setDoctorContract(doctorContractInstance);

          // Fetch patient details
          await fetchPatientDetails(patientContractInstance);
          
          // Fetch all doctors
          await fetchAllDoctors(doctorContractInstance);
          
          // Fetch granted doctors
          await fetchGrantedDoctors(patientContractInstance);

        } catch (error) {
          console.error('Error initializing contracts:', error);
          setError('Error initializing contracts');
        }
      } else {
        setError('Please install MetaMask extension');
      }
    };

    initContracts();
  }, [hhNumber]);

  const fetchPatientDetails = async (contractInstance) => {
    try {
      const details = await contractInstance.methods.getPatientDetails(hhNumber).call();
      setPatientDetails({
        name: details[1],
        dateOfBirth: details[2],
        gender: details[3],
        bloodGroup: details[4],
        homeAddress: details[5],
        email: details[6]
      });
    } catch (error) {
      console.error('Error fetching patient details:', error);
      setError('Error fetching patient details');
    }
  };

  const fetchAllDoctors = async (contractInstance) => {
    try {
      // This would require adding a function to get all doctors in the contract
      // For now, we'll use a placeholder approach
      setAllDoctors([]);
    } catch (error) {
      console.error('Error fetching all doctors:', error);
    }
  };

  const fetchGrantedDoctors = async (contractInstance) => {
    try {
      // Get the list of doctors this patient has granted permission to
      const doctorList = await contractInstance.methods.getPatientList(hhNumber).call();
      setGrantedDoctors(doctorList);
    } catch (error) {
      console.error('Error fetching granted doctors:', error);
    }
  };

  const handleGrantPermission = async () => {
    if (!doctorHHNumber.trim()) {
      setError("Please enter a doctor's HH Number");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      // First check if the doctor exists
      const isDoctorRegistered = await doctorContract.methods.isRegisteredDoctor(doctorHHNumber).call();
      
      if (!isDoctorRegistered) {
        setError("Doctor with this HH Number is not registered");
        return;
      }

      // Get doctor details
      const doctorDetails = await doctorContract.methods.getDoctorDetails(doctorHHNumber).call();
      
      // Grant permission
      await patientContract.methods.grantPermission(
        hhNumber,
        doctorHHNumber,
        patientDetails.name
      ).send({ from: window.ethereum.selectedAddress });

      setSuccess(`Permission granted to Dr. ${doctorDetails[1]} (${doctorHHNumber})`);
      setDoctorHHNumber("");
      
      // Refresh the granted doctors list
      await fetchGrantedDoctors(patientContract);

    } catch (error) {
      console.error('Error granting permission:', error);
      setError('Error granting permission: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRevokePermission = async (doctorNumber) => {
    try {
      setLoading(true);
      setError(null);

      await patientContract.methods.revokePermission(hhNumber, doctorNumber)
        .send({ from: window.ethereum.selectedAddress });

      setSuccess("Permission revoked successfully");
      
      // Refresh the granted doctors list
      await fetchGrantedDoctors(patientContract);

    } catch (error) {
      console.error('Error revoking permission:', error);
      setError('Error revoking permission: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <NavBar_Logout />
      <div className="bg-gradient-to-b from-black to-gray-800 min-h-screen text-white p-10 font-mono">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Manage Doctor Permissions</h2>
          
          {error && (
            <div className="bg-red-600 text-white p-4 rounded-lg mb-6 text-center">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-600 text-white p-4 rounded-lg mb-6 text-center">
              {success}
            </div>
          )}

          {/* Patient Info */}
          {patientDetails && (
            <div className="bg-gray-900 p-6 rounded-lg mb-8 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4 text-teal-400">Patient Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div><span className="font-semibold">Name:</span> {patientDetails.name}</div>
                <div><span className="font-semibold">HH Number:</span> {hhNumber}</div>
                <div><span className="font-semibold">Date of Birth:</span> {patientDetails.dateOfBirth}</div>
                <div><span className="font-semibold">Gender:</span> {patientDetails.gender}</div>
                <div><span className="font-semibold">Blood Group:</span> {patientDetails.bloodGroup}</div>
                <div><span className="font-semibold">Email:</span> {patientDetails.email}</div>
                <div className="md:col-span-2">
                  <span className="font-semibold">Address:</span> {patientDetails.homeAddress}
                </div>
              </div>
            </div>
          )}

          {/* Grant Permission Section */}
          <div className="bg-gray-900 p-6 rounded-lg mb-8 border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-blue-400">Grant Permission to Doctor</h3>
            <div className="flex gap-4 mb-4">
              <input
                type="text"
                placeholder="Enter Doctor's HH Number"
                value={doctorHHNumber}
                onChange={(e) => setDoctorHHNumber(e.target.value)}
                className="flex-1 p-3 bg-gray-800 border border-gray-700 rounded text-white focus:border-blue-500 focus:outline-none"
              />
              <button
                onClick={handleGrantPermission}
                disabled={loading}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white rounded-lg focus:outline-none focus:ring focus:ring-blue-400 transition duration-300"
              >
                {loading ? 'Granting...' : 'Grant Permission'}
              </button>
            </div>
            <p className="text-sm text-gray-400">
              Enter the HH Number of the doctor you want to grant permission to view your medical records.
            </p>
          </div>

          {/* Granted Doctors List */}
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-green-400">Doctors with Permission</h3>
            {grantedDoctors.length === 0 ? (
              <div className="text-gray-400 text-center p-4">
                No doctors have been granted permission yet.
              </div>
            ) : (
              <div className="space-y-3">
                {grantedDoctors.map((doctor, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-800 rounded border border-gray-700">
                    <div>
                      <div className="font-semibold">{doctor.patient_name}</div>
                      <div className="text-sm text-gray-400">HH Number: {doctor.patient_number}</div>
                    </div>
                    <button
                      onClick={() => handleRevokePermission(doctor.patient_number)}
                      disabled={loading}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-600 text-white rounded text-sm transition duration-300"
                    >
                      Revoke Permission
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Back to Dashboard */}
          <div className="mt-8 text-center">
            <button
              onClick={() => navigate(`/patient/${hhNumber}`)}
              className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg focus:outline-none focus:ring focus:ring-teal-400 transition duration-300"
            >
              Back to Patient Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrantPermission; 