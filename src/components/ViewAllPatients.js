import React, { useState, useEffect } from "react";
import Web3 from "web3";
import PatientRegistration from "../build/contracts/PatientRegistration.json";
import { useParams } from "react-router-dom";
import NavBar_Logout from "./NavBar_Logout";

const ViewAllPatients = () => {
  const { hhNumber } = useParams();
  const [contract, setContract] = useState(null);
  const [allPatients, setAllPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const initContract = async () => {
      if (window.ethereum) {
        try {
          const web3Instance = new Web3(window.ethereum);
          const networkId = await web3Instance.eth.net.getId();
          const deployedNetwork = PatientRegistration.networks[networkId];
          
          if (!deployedNetwork) {
            throw new Error("Contract not deployed on current network");
          }

          const contractInstance = new web3Instance.eth.Contract(
            PatientRegistration.abi,
            deployedNetwork.address
          );
          
          setContract(contractInstance);
          await fetchAllPatients(contractInstance);
        } catch (error) {
          console.error("Error initializing contract:", error);
          setError("Error initializing contract: " + error.message);
        } finally {
          setLoading(false);
        }
      } else {
        setError("Please install MetaMask to view patients.");
        setLoading(false);
      }
    };

    initContract();
  }, []);

  const fetchAllPatients = async (contractInstance) => {
    try {
      // Get all patient numbers first
      const patientNumbers = await contractInstance.methods.getAllPatientNumbers().call();
      
      // Fetch details for each patient
      const patientsData = [];
      for (let i = 0; i < patientNumbers.length; i++) {
        try {
          const patientDetails = await contractInstance.methods.getPatientDetails(patientNumbers[i]).call();
          patientsData.push({
            hhNumber: patientNumbers[i],
            name: patientDetails[1],
            dateOfBirth: patientDetails[2],
            gender: patientDetails[3],
            bloodGroup: patientDetails[4],
            homeAddress: patientDetails[5],
            email: patientDetails[6],
            walletAddress: patientDetails[0]
          });
        } catch (error) {
          console.error(`Error fetching details for patient ${patientNumbers[i]}:`, error);
        }
      }
      
      setAllPatients(patientsData);
    } catch (error) {
      console.error("Error fetching all patients:", error);
      setError("Error fetching all patients: " + error.message);
    }
  };

  const filteredPatients = allPatients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.hhNumber.includes(searchTerm) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <NavBar_Logout />
      <div className="bg-gradient-to-b from-black to-gray-800 min-h-screen text-white p-10 font-mono">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">All Registered Patients</h2>
          
          {error && (
            <div className="bg-red-600 text-white p-4 rounded-lg mb-6 text-center">
              {error}
            </div>
          )}

          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by name, HH Number, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-teal-500 focus:outline-none"
            />
          </div>

          {loading ? (
            <div className="text-center text-lg">Loading patients...</div>
          ) : filteredPatients.length === 0 ? (
            <div className="text-center text-gray-400 p-8 bg-gray-900 rounded-lg">
              {searchTerm ? 'No patients found matching your search.' : 'No patients registered yet.'}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredPatients.map((patient, index) => (
                <div
                  key={index}
                  className="bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-700 hover:border-gray-600 transition-all"
                >
                  <div className="mb-4">
                    <h3 className="font-bold text-teal-400 text-lg mb-2">{patient.name}</h3>
                    <div className="text-sm text-gray-400 space-y-1">
                      <div><span className="font-semibold">HH Number:</span> {patient.hhNumber}</div>
                      <div><span className="font-semibold">Email:</span> {patient.email}</div>
                      <div><span className="font-semibold">Date of Birth:</span> {patient.dateOfBirth}</div>
                      <div><span className="font-semibold">Gender:</span> {patient.gender}</div>
                      <div><span className="font-semibold">Blood Group:</span> {patient.bloodGroup}</div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 mb-4">
                    <div className="truncate">
                      <span className="font-semibold">Address:</span> {patient.homeAddress}
                    </div>
                    <div className="truncate">
                      <span className="font-semibold">Wallet:</span> {patient.walletAddress}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm transition-colors"
                      onClick={() => {
                        // This could open a modal or navigate to request permission
                        alert(`To request permission from ${patient.name}, ask them to grant permission to your HH Number: ${hhNumber}`);
                      }}
                    >
                      Request Permission
                    </button>
                    <button
                      className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm transition-colors"
                      onClick={() => {
                        navigator.clipboard.writeText(patient.hhNumber);
                        alert('HH Number copied to clipboard!');
                      }}
                    >
                      Copy HH#
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Summary */}
          <div className="mt-8 bg-gray-900 p-6 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold mb-2 text-yellow-400">Summary</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-semibold">Total Patients:</span> {allPatients.length}
              </div>
              <div>
                <span className="font-semibold">Showing:</span> {filteredPatients.length}
              </div>
              <div>
                <span className="font-semibold">Your HH Number:</span> {hhNumber}
              </div>
            </div>
            <p className="text-gray-400 text-sm mt-2">
              To view a patient's records, they must first grant you permission. 
              You can request permission by sharing your HH Number with the patient.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAllPatients; 