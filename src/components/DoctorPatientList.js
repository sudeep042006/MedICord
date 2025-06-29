<<<<<<< HEAD
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
=======
import React, { useEffect, useState } from "react";
import Web3 from "web3";
import PatientRegistration from "../build/contracts/PatientRegistration.json";

const DoctorPatientList = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = PatientRegistration.networks[networkId];
        if (!deployedNetwork) {
          setLoading(false);
          return;
        }
        const contract = new web3.eth.Contract(
          PatientRegistration.abi,
          deployedNetwork.address
        );
        try {
          // getAllPatients returns multiple arrays
          const result = await contract.methods.getAllPatients().call();
          // result is an object with keys: walletAddresses, names, dateOfBirths, genders, bloodGroups, homeAddresses, emails, hhNumbers
          // Convert to array of patient objects for easier rendering
          const len = result.walletAddresses.length;
          const patientArr = [];
          for (let i = 0; i < len; i++) {
            patientArr.push({
              walletAddress: result.walletAddresses[i],
              name: result.names[i],
              dateOfBirth: result.dateOfBirths[i],
              gender: result.genders[i],
              bloodGroup: result.bloodGroups[i],
              homeAddress: result.homeAddresses[i],
              email: result.emails[i],
              hhNumber: result.hhNumbers[i],
            });
          }
          setPatients(patientArr);
        } catch (err) {
          setPatients([]);
        }
      }
      setLoading(false);
    };
    fetchPatients();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Registered Patients</h2>
      {patients.length === 0 ? (
        <p>No patients found.</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="border px-4 py-2">Wallet Address</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">DOB</th>
              <th className="border px-4 py-2">Gender</th>
              <th className="border px-4 py-2">Blood Group</th>
              <th className="border px-4 py-2">Home Address</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">HH Number</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p, idx) => (
              <tr key={idx}>
                <td className="border px-4 py-2">{p.walletAddress}</td>
                <td className="border px-4 py-2">{p.name}</td>
                <td className="border px-4 py-2">{p.dateOfBirth}</td>
                <td className="border px-4 py-2">{p.gender}</td>
                <td className="border px-4 py-2">{p.bloodGroup}</td>
                <td className="border px-4 py-2">{p.homeAddress}</td>
                <td className="border px-4 py-2">{p.email}</td>
                <td className="border px-4 py-2">{p.hhNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
>>>>>>> 3cf79c2301a79171c87b11c7f127cbc09bae465f
      )}
    </div>
  );
};

export default DoctorPatientList;
