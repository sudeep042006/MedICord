<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import NavBar_Logout from "./NavBar_Logout";
import Web3 from "web3";
import { create as ipfsHttpClient } from "ipfs-http-client";
import PatientRegistration from "../build/contracts/PatientRegistration.json";
import UploadEhr from "../build/contracts/UploadEhr.json";

const ipfs = ipfsHttpClient({
  url: "http://127.0.0.1:5001/api/v0"
});

const UPLOAD_EHR_ADDRESS = "0x1Be867Af56cbb4c9Ae1B0e6c4b6e8B0fd7b321eD";
=======
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import NavBar_Logout from "./NavBar_Logout";
>>>>>>> 3cf79c2301a79171c87b11c7f127cbc09bae465f

const PatientRecords = () => {
  const { hhNumber } = useParams();
  const [records, setRecords] = useState([]);
  const [showModal, setShowModal] = useState(false);
<<<<<<< HEAD
  const [newRecord, setNewRecord] = useState({ title: "", description: "", file: null });
  const [patientDetails, setPatientDetails] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPatientDetails = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
        const networkId = await web3Instance.eth.net.getId();
        const deployedNetwork = PatientRegistration.networks[networkId];
        const contractInstance = new web3Instance.eth.Contract(
          PatientRegistration.abi,
          deployedNetwork && deployedNetwork.address
        );
        try {
          const result = await contractInstance.methods.getPatientDetails(hhNumber).call();
          setPatientDetails(result);
        } catch (err) {
          setError("Error fetching patient details");
        }
      }
    };
    fetchPatientDetails();
    // Fetch records from backend
    fetch(`http://localhost:5000/api/records/${hhNumber}`)
      .then(res => res.json())
      .then(data => setRecords(data));
  }, [hhNumber]);

  const handleAddRecord = () => {
    setShowModal(true);
    setNewRecord({ title: "", description: "", file: null });
    setError("");
  };

  const handleFileChange = (e) => {
    setNewRecord({ ...newRecord, file: e.target.files[0] });
  };

  const handleSaveRecord = async () => {
    if (!newRecord.title || !newRecord.description) return;
    setUploading(true);
    let cid = "";
    try {
      if (newRecord.file) {
        const added = await ipfs.add(newRecord.file);
        cid = added.path;
      }
      // Store on-chain
      if (web3 && cid) {
        const accounts = await web3.eth.getAccounts();
        const networkId = await web3.eth.net.getId();
        const uploadEhr = new web3.eth.Contract(
          UploadEhr.abi,
          UploadEhr.networks[networkId].address
        );
        await uploadEhr.methods.addRecord(
          accounts[0], // patient address
          newRecord.title,
          newRecord.description,
          new Date().toISOString(),
          cid
        ).send({ from: accounts[0] });
      }
      // Store in backend
      const recordData = {
        patientAddress: hhNumber,
        title: newRecord.title,
        description: newRecord.description,
        timeStamp: new Date().toISOString(),
        cid,
        patientInfo: patientDetails
      };
      await fetch("http://localhost:5000/api/records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recordData)
      });
      setRecords([recordData, ...records]);
      setShowModal(false);
    } catch (err) {
      setError("Failed to upload file or save record");
    }
    setUploading(false);
=======
  const [newRecord, setNewRecord] = useState({ title: "", description: "" });

  const handleAddRecord = () => {
    setShowModal(true);
    setNewRecord({ title: "", description: "" });
  };

  const handleSaveRecord = () => {
    if (!newRecord.title || !newRecord.description) return;
    setRecords([{ ...newRecord, id: Date.now() }, ...records]);
    setShowModal(false);
>>>>>>> 3cf79c2301a79171c87b11c7f127cbc09bae465f
  };

  const handleDelete = (id) => {
    setRecords(records.filter((r) => r.id !== id));
  };

  return (
    <div>
      <NavBar_Logout />
      <div className="bg-gradient-to-b from-black to-gray-800 min-h-screen p-4 font-mono text-white flex flex-col items-center">
        <div className="w-full max-w-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Patient Records</h2>
            <button
              className="bg-teal-500 hover:bg-gray-600 px-4 py-2 rounded"
              onClick={handleAddRecord}
            >
              Add Record
            </button>
          </div>
          {records.length === 0 ? (
            <div className="text-gray-300">No records yet.</div>
          ) : (
            <div className="space-y-4">
<<<<<<< HEAD
              {records.map((rec, idx) => (
                <div
                  key={idx}
                  className="bg-gray-900 rounded shadow p-4 flex flex-col gap-2"
                >
                  <div className="font-bold text-lg">{rec.title}</div>
                  <div className="text-gray-300">{rec.description}</div>
                  {rec.patientInfo && (
                    <div className="text-xs text-gray-400">
                      Name: <span className="text-yellow-500">{rec.patientInfo.name}</span> | DOB: {rec.patientInfo.dateOfBirth} | Gender: {rec.patientInfo.gender} | Blood Group: {rec.patientInfo.bloodGroup} | Address: {rec.patientInfo.homeAddress} | Email: {rec.patientInfo.email}
                    </div>
                  )}
                  <div className="flex gap-2 mt-2">
                    {rec.cid && (
                      <>
                        <button
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-700"
                          onClick={() => window.open(`http://127.0.0.1:8080/ipfs/${rec.cid}`, '_blank')}
                        >
                          View
                        </button>
                        <span className="font-semibold text-xs text-blue-300 break-all">{rec.cid}</span>
                      </>
                    )}
                    <button
                      className="px-3 py-1 bg-red-500 rounded hover:bg-red-700 text-white"
                      onClick={() => handleDelete(rec.id)}
                    >
                      Delete
                    </button>
                  </div>
=======
              {records.map((rec) => (
                <div
                  key={rec.id}
                  className="bg-gray-900 rounded shadow p-4 flex justify-between items-center"
                >
                  <div>
                    <div className="font-bold">{rec.title}</div>
                    <div className="text-gray-300">{rec.description}</div>
                  </div>
                  <button
                    className="ml-4 px-3 py-1 bg-red-500 rounded hover:bg-red-700"
                    onClick={() => handleDelete(rec.id)}
                  >
                    Delete
                  </button>
>>>>>>> 3cf79c2301a79171c87b11c7f127cbc09bae465f
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Modal for adding record */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
<<<<<<< HEAD
            <div className="bg-white text-black rounded-lg p-6 w-96">
              <h3 className="text-lg font-bold mb-4">Add New Record</h3>
              {patientDetails && (
                <div className="mb-3 text-xs bg-gray-100 p-2 rounded">
                  <div><b>Name:</b> {patientDetails.name}</div>
                  <div><b>DOB:</b> {patientDetails.dateOfBirth}</div>
                  <div><b>Gender:</b> {patientDetails.gender}</div>
                  <div><b>Blood Group:</b> {patientDetails.bloodGroup}</div>
                  <div><b>Address:</b> {patientDetails.homeAddress}</div>
                  <div><b>Email:</b> {patientDetails.email}</div>
                </div>
              )}
=======
            <div className="bg-white text-black rounded-lg p-6 w-80">
              <h3 className="text-lg font-bold mb-4">Add New Record</h3>
>>>>>>> 3cf79c2301a79171c87b11c7f127cbc09bae465f
              <input
                className="w-full mb-3 p-2 border rounded"
                placeholder="Title"
                value={newRecord.title}
                onChange={(e) =>
                  setNewRecord({ ...newRecord, title: e.target.value })
                }
              />
              <textarea
                className="w-full mb-3 p-2 border rounded"
                placeholder="Description"
                value={newRecord.description}
                onChange={(e) =>
                  setNewRecord({ ...newRecord, description: e.target.value })
                }
              />
<<<<<<< HEAD
              <input
                type="file"
                className="w-full mb-3 p-2 border rounded"
                onChange={handleFileChange}
              />
              {error && <div className="text-red-500 mb-2">{error}</div>}
=======
>>>>>>> 3cf79c2301a79171c87b11c7f127cbc09bae465f
              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-1 bg-gray-300 rounded"
                  onClick={() => setShowModal(false)}
<<<<<<< HEAD
                  disabled={uploading}
=======
>>>>>>> 3cf79c2301a79171c87b11c7f127cbc09bae465f
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-1 bg-teal-500 text-white rounded"
                  onClick={handleSaveRecord}
<<<<<<< HEAD
                  disabled={uploading}
                >
                  {uploading ? "Saving..." : "Save"}
=======
                >
                  Save
>>>>>>> 3cf79c2301a79171c87b11c7f127cbc09bae465f
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientRecords;
