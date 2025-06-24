import React, { useEffect, useState } from "react";
import NavBar_Logout from "./NavBar_Logout";
// Import web3 and contract ABI
import Web3 from "web3";
import DiagnosticFormABI from "../build/contracts/DiagnosticForm.json";

// Set your contract address here
const CONTRACT_ADDRESS = "0x99DFB0C129F1F229C7f5F72F0f042eE44184368D"; // <-- Replace with your deployed contract address

function ViewPatientList() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecords() {
      try {
        // Modern dapp browsers...
        if (window.ethereum) {
          const web3 = new Web3(window.ethereum);
          await window.ethereum.request({ method: "eth_requestAccounts" });

          // Debug: Log network and contract info
          const networkId = await web3.eth.net.getId();
          console.log("Network ID:", networkId);
          console.log("Contract Address:", CONTRACT_ADDRESS);
          console.log("ABI:", DiagnosticFormABI.abi);

          const contract = new web3.eth.Contract(
            DiagnosticFormABI.abi,
            CONTRACT_ADDRESS
          );
          const data = await contract.methods.getRecords().call();
          setRecords(data);
        } else {
          alert("Please install MetaMask to view patient records.");
        }
      } catch (err) {
        console.error("Error fetching records:", err);
        alert("Error fetching records: " + err.message);
      }
      setLoading(false);
    }
    fetchRecords();
  }, []);

  return (
    <div>
      <NavBar_Logout />
      <div className="bg-gradient-to-b from-black to-gray-800 min-h-screen text-white p-10 font-mono">
        <h2 className="text-center text-3xl mb-8 font-bold">Patient Records</h2>
        {loading ? (
          <div className="text-center text-lg">Loading records...</div>
        ) : records.length === 0 ? (
          <div className="text-center text-lg">No patient records found.</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {records.map((rec, idx) => (
              <div
                key={rec.recordId + idx}
                className="bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-700"
              >
                <div className="mb-2">
                  <span className="font-semibold">Record ID:</span> {rec.recordId}
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Patient Name:</span> {rec.patientName}
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Doctor Name:</span> {rec.doctorName}
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Age:</span> {rec.age}
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Gender:</span> {rec.gender}
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Blood Group:</span> {rec.bloodGroup}
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Patient Address:</span> {rec.patientAddress}
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Diagnostic Address:</span> {rec.diagnosticAddress}
                </div>
                <div>
                  <span className="font-semibold">CID:</span> {rec.cid}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewPatientList;
