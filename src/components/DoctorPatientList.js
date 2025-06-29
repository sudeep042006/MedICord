import React, { useState, useEffect } from "react";
import Web3 from "web3";
import DoctorRegistration from "../build/contracts/DoctorRegistration.json";
import { useParams } from "react-router-dom";

const DoctorPatientList = () => {
  const { hhNumber } = useParams();
  const [patientList, setPatientList] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [contract, setContract] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initContract = async () => {
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
          await fetchPatientList(contractInstance);
        } catch (error) {
          console.error('Error initializing contract:', error);
          setError('Error initializing contract');
        }
      } else {
        setError('Please install MetaMask extension');
      }
    };

    initContract();
  }, [hhNumber]);

  const fetchPatientList = async (contractInstance) => {
    try {
      setLoading(true);
      const patientListData = await contractInstance.methods.getPatientList(hhNumber).call();
      setPatientList(patientListData);
    } catch (error) {
      console.error('Error fetching patient list:', error);
      setError('Error fetching patient list');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecords = async () => {
    if (!selectedPatient) {
      alert("Please select a patient first");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/records/${selectedPatient}`);
      if (res.ok) {
        const data = await res.json();
        setRecords(data);
      } else {
        console.error('Failed to fetch records');
        setRecords([]);
      }
    } catch (error) {
      console.error('Error fetching records:', error);
      setError('Error fetching records');
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePatientSelect = (patientNumber) => {
    setSelectedPatient(patientNumber);
    setRecords([]); // Clear previous records
  };

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Doctor View Patient Records</h2>
      
      {error && (
        <div className="bg-red-600 text-white p-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Patient List Section */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3">Patients with Permission</h3>
        {loading ? (
          <div className="text-gray-400">Loading patient list...</div>
        ) : patientList.length === 0 ? (
          <div className="text-gray-400">No patients found with permission.</div>
        ) : (
          <div className="grid gap-2">
            {patientList.map((patient, index) => (
              <button
                key={index}
                onClick={() => handlePatientSelect(patient.patient_number)}
                className={`p-3 rounded text-left transition-colors ${
                  selectedPatient === patient.patient_number
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                }`}
              >
                <div className="font-semibold">{patient.patient_name}</div>
                <div className="text-sm text-gray-400">ID: {patient.patient_number}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Records Section */}
      {selectedPatient && (
        <div>
          <div className="flex items-center gap-4 mb-4">
            <h3 className="text-xl font-semibold">
              Records for Patient: {patientList.find(p => p.patient_number === selectedPatient)?.patient_name}
            </h3>
            <button
              className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded transition-colors"
              onClick={fetchRecords}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Fetch Records'}
            </button>
          </div>

          {records.length === 0 ? (
            <div className="text-gray-400">No records found for this patient.</div>
          ) : (
            <div className="space-y-4">
              {records.map((rec, idx) => (
                <div key={idx} className="bg-gray-800 p-4 rounded border border-gray-700">
                  <div className="font-bold text-teal-400 mb-2">{rec.title}</div>
                  <div className="text-gray-300 mb-2">{rec.description}</div>
                  <div className="text-xs text-gray-400 space-y-1">
                    <div>Name: <span className="text-yellow-500">{rec.patientInfo?.name}</span></div>
                    <div>DOB: {rec.patientInfo?.dateOfBirth}</div>
                    <div>Gender: {rec.patientInfo?.gender}</div>
                    <div>Blood Group: {rec.patientInfo?.bloodGroup}</div>
                    <div>Address: {rec.patientInfo?.homeAddress}</div>
                    <div>Email: {rec.patientInfo?.email}</div>
                    <div>Timestamp: {rec.timeStamp}</div>
                  </div>
                  {rec.cid && (
                    <a
                      href={`http://127.0.0.1:8080/ipfs/${rec.cid}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-2 text-blue-400 underline hover:text-blue-300"
                    >
                      View File
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DoctorPatientList;
