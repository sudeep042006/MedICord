import React, { useEffect, useState } from "react";
import NavBar_Logout from "./NavBar_Logout";
import Web3 from "web3";
import DiagnosticFormABI from "../build/contracts/DiagnosticForm.json";

const CONTRACT_ADDRESS = "0x99DFB0C129F1F229C7f5F72F0f042eE44184368D";

function DiagnosticForm() {
  const [form, setForm] = useState({
    recordId: "",
    doctorName: "",
    patientName: "",
    age: "",
    gender: "",
    bloodGroup: "",
    diagnosticAddress: "",
    patientAddress: "",
    cid: "",
  });
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchRecords() {
      setLoading(true);
      try {
        if (window.ethereum) {
          const web3 = new Web3(window.ethereum);
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const contract = new web3.eth.Contract(
            DiagnosticFormABI.abi,
            CONTRACT_ADDRESS
          );
          const data = await contract.methods.getRecords().call();
          setRecords(data);
        }
      } catch (err) {
        alert("Error fetching records: " + err.message);
      }
      setLoading(false);
    }
    fetchRecords();
  }, [submitting]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        const contract = new web3.eth.Contract(
          DiagnosticFormABI.abi,
          CONTRACT_ADDRESS
        );
        await contract.methods
          .createEHR(
            form.recordId,
            form.doctorName,
            form.patientName,
            form.age,
            form.gender,
            form.bloodGroup,
            form.diagnosticAddress,
            form.patientAddress,
            form.cid
          )
          .send({ from: accounts[0] });
        setForm({
          recordId: "",
          doctorName: "",
          patientName: "",
          age: "",
          gender: "",
          bloodGroup: "",
          diagnosticAddress: "",
          patientAddress: "",
          cid: "",
        });
      }
    } catch (err) {
      alert("Error saving record: " + err.message);
    }
    setSubmitting(false);
  }

  return (
    <div>
      <NavBar_Logout />
      <div className="bg-gradient-to-b from-black to-gray-800 min-h-screen text-white p-10 font-mono">
        <h2 className="text-center text-3xl mb-8 font-bold">
          Add Diagnostic Record
        </h2>
        <form
          className="max-w-xl mx-auto bg-gray-900 p-6 rounded-lg shadow-lg mb-10 border border-gray-700"
          onSubmit={handleSubmit}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className="p-2 rounded bg-gray-800 border border-gray-700"
              name="recordId"
              placeholder="Record ID"
              value={form.recordId}
              onChange={handleChange}
              required
            />
            <input
              className="p-2 rounded bg-gray-800 border border-gray-700"
              name="doctorName"
              placeholder="Doctor Name"
              value={form.doctorName}
              onChange={handleChange}
              required
            />
            <input
              className="p-2 rounded bg-gray-800 border border-gray-700"
              name="patientName"
              placeholder="Patient Name"
              value={form.patientName}
              onChange={handleChange}
              required
            />
            <input
              className="p-2 rounded bg-gray-800 border border-gray-700"
              name="age"
              type="number"
              placeholder="Age"
              value={form.age}
              onChange={handleChange}
              required
            />
            <input
              className="p-2 rounded bg-gray-800 border border-gray-700"
              name="gender"
              placeholder="Gender"
              value={form.gender}
              onChange={handleChange}
              required
            />
            <input
              className="p-2 rounded bg-gray-800 border border-gray-700"
              name="bloodGroup"
              placeholder="Blood Group"
              value={form.bloodGroup}
              onChange={handleChange}
              required
            />
            <input
              className="p-2 rounded bg-gray-800 border border-gray-700"
              name="diagnosticAddress"
              placeholder="Diagnostic Address"
              value={form.diagnosticAddress}
              onChange={handleChange}
              required
            />
            <input
              className="p-2 rounded bg-gray-800 border border-gray-700"
              name="patientAddress"
              placeholder="Patient Address"
              value={form.patientAddress}
              onChange={handleChange}
              required
            />
            <input
              className="p-2 rounded bg-gray-800 border border-gray-700 col-span-1 md:col-span-2"
              name="cid"
              placeholder="CID (IPFS/File hash)"
              value={form.cid}
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="submit"
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            disabled={submitting}
          >
            {submitting ? "Saving..." : "Add Record"}
          </button>
        </form>
        <h2 className="text-center text-3xl mb-8 font-bold">
          Diagnostic Records List
        </h2>
        {loading ? (
          <div className="text-center text-lg">Loading records...</div>
        ) : records.length === 0 ? (
          <div className="text-center text-lg">No diagnostic records found.</div>
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

export default DiagnosticForm;
