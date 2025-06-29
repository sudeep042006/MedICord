import React, { useEffect, useState } from "react";
import NavBar_Logout from "./NavBar_Logout";
import Web3 from "web3";
import DoctorRegistration from "../build/contracts/DoctorRegistration.json";
import { useParams } from "react-router-dom";

function ViewPatientList() {
  const { hhNumber } = useParams();
  const [patientList, setPatientList] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contract, setContract] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initContract = async () => {
      if (window.ethereum) {
        try {
          const web3Instance = new Web3(window.ethereum);
          await window.ethereum.request({ method: "eth_requestAccounts" });
          
          const networkId = await web3Instance.eth.net.getId();
          const deployedNetwork = DoctorRegistration.networks[networkId];
          
          if (!deployedNetwork) {
            throw new Error("Contract not deployed on current network");
          }

          const contractInstance = new web3Instance.eth.Contract(
            DoctorRegistration.abi,
            deployedNetwork.address
          );
          
          setContract(contractInstance);
          await fetchPatientList(contractInstance);
        } catch (error) {
          console.error("Error initializing contract:", error);
          setError("Error initializing contract: " + error.message);
        } finally {
          setLoading(false);
        }
      } else {
        setError("Please install MetaMask to view patient records.");
        setLoading(false);
      }
    };

    initContract();
  }, [hhNumber]);

  const fetchPatientList = async (contractInstance) => {
    try {
      const patientListData = await contractInstance.methods.getPatientList(hhNumber).call();
      setPatientList(patientListData);
    } catch (error) {
      console.error("Error fetching patient list:", error);
      setError("Error fetching patient list: " + error.message);
    }
  };

  const fetchPatientRecords = async (patientNumber) => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/records/${patientNumber}`);
      if (res.ok) {
        const data = await res.json();
        setRecords(data);
      } else {
        console.error('Failed to fetch records');
        setRecords([]);
      }
    } catch (error) {
      console.error('Error fetching records:', error);
      setError('Error fetching records: ' + error.message);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePatientSelect = (patientNumber) => {
    setSelectedPatient(patientNumber);
    setRecords([]); // Clear previous records
    fetchPatientRecords(patientNumber);
  };

  return (
    <div>
      <NavBar_Logout />
      <div className="bg-gradient-to-b from-black to-gray-800 min-h-screen text-white p-10 font-mono">
        <h2 className="text-center text-3xl mb-8 font-bold">Patient Records Dashboard</h2>
        
        {error && (
          <div className="bg-red-600 text-white p-4 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center text-lg">Loading patient list...</div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Patient List Section */}
            <div className="lg:col-span-1">
              <h3 className="text-xl font-semibold mb-4 text-teal-400">Patients with Permission</h3>
              {patientList.length === 0 ? (
                <div className="text-gray-400 text-center p-4 bg-gray-900 rounded-lg">
                  No patients found with permission.
                </div>
              ) : (
                <div className="space-y-2">
                  {patientList.map((patient, index) => (
                    <button
                      key={index}
                      onClick={() => handlePatientSelect(patient.patient_number)}
                      className={`w-full p-4 rounded-lg text-left transition-all duration-200 ${
                        selectedPatient === patient.patient_number
                          ? 'bg-teal-600 text-white shadow-lg'
                          : 'bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-700'
                      }`}
                    >
                      <div className="font-semibold text-lg">{patient.patient_name}</div>
                      <div className="text-sm opacity-75">ID: {patient.patient_number}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Records Section */}
            <div className="lg:col-span-2">
              {selectedPatient ? (
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-teal-400">
                    Records for: {patientList.find(p => p.patient_number === selectedPatient)?.patient_name}
                  </h3>
                  
                  {loading ? (
                    <div className="text-center text-lg">Loading records...</div>
                  ) : records.length === 0 ? (
                    <div className="text-gray-400 text-center p-8 bg-gray-900 rounded-lg">
                      No records found for this patient.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {records.map((rec, idx) => (
                        <div
                          key={idx}
                          className="bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-700 hover:border-gray-600 transition-all"
                        >
                          <div className="mb-4">
                            <h4 className="font-bold text-teal-400 text-lg mb-2">{rec.title}</h4>
                            <p className="text-gray-300">{rec.description}</p>
                          </div>
                          
                          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-400">
                            <div>
                              <span className="font-semibold text-yellow-500">Name:</span> {rec.patientInfo?.name}
                            </div>
                            <div>
                              <span className="font-semibold">DOB:</span> {rec.patientInfo?.dateOfBirth}
                            </div>
                            <div>
                              <span className="font-semibold">Gender:</span> {rec.patientInfo?.gender}
                            </div>
                            <div>
                              <span className="font-semibold">Blood Group:</span> {rec.patientInfo?.bloodGroup}
                            </div>
                            <div className="md:col-span-2">
                              <span className="font-semibold">Address:</span> {rec.patientInfo?.homeAddress}
                            </div>
                            <div className="md:col-span-2">
                              <span className="font-semibold">Email:</span> {rec.patientInfo?.email}
                            </div>
                            <div className="md:col-span-2">
                              <span className="font-semibold">Timestamp:</span> {rec.timeStamp}
                            </div>
                          </div>
                          
                          {rec.cid && (
                            <div className="mt-4 pt-4 border-t border-gray-700">
                              <a
                                href={`http://127.0.0.1:8080/ipfs/${rec.cid}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                              >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                View File
                              </a>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-400 p-8 bg-gray-900 rounded-lg">
                  Select a patient from the list to view their records.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewPatientList;
