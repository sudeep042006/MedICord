import React, { useState, useEffect } from "react";
import Web3 from "web3";
import DoctorRegistration from "../build/contracts/DoctorRegistration.json";
import { useParams } from "react-router-dom";

const CreateRecord = () => {
  const { hhNumber } = useParams();
  const [contract, setContract] = useState(null);
  const [patientList, setPatientList] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Form fields
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    recordType: "other",
    cid: ""
  });

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
      const patientListData = await contractInstance.methods.getPatientList(hhNumber).call();
      setPatientList(patientListData);
    } catch (error) {
      console.error('Error fetching patient list:', error);
      setError('Error fetching patient list');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedPatient) {
      setError("Please select a patient first");
      return;
    }

    if (!formData.title || !formData.description) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      // Get doctor details from contract
      const doctorDetails = await contract.methods.getDoctorDetails(hhNumber).call();
      
      // Get patient details from contract (you might need to import PatientRegistration contract)
      // For now, we'll use basic patient info
      const selectedPatientData = patientList.find(p => p.patient_number === selectedPatient);

      const recordData = {
        patientAddress: selectedPatient,
        title: formData.title,
        description: formData.description,
        timeStamp: new Date().toISOString(),
        cid: formData.cid || "",
        patientInfo: {
          name: selectedPatientData?.patient_name || "Unknown",
          dateOfBirth: "",
          gender: "",
          bloodGroup: "",
          homeAddress: "",
          email: ""
        },
        doctorInfo: {
          name: doctorDetails[1], // doctorName
          hhNumber: hhNumber,
          specialization: doctorDetails[6], // specialization
          hospitalName: doctorDetails[2] // hospitalName
        },
        recordType: formData.recordType
      };

      const response = await fetch('http://localhost:5000/api/records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recordData)
      });

      if (response.ok) {
        const savedRecord = await response.json();
        setSuccess(`Record created successfully! Record ID: ${savedRecord._id}`);
        setFormData({
          title: "",
          description: "",
          recordType: "other",
          cid: ""
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create record');
      }
    } catch (error) {
      console.error('Error creating record:', error);
      setError('Error creating record: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Create New Medical Record</h2>
      
      {error && (
        <div className="bg-red-600 text-white p-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-600 text-white p-3 rounded mb-4">
          {success}
        </div>
      )}

      {/* Patient Selection */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3">Select Patient</h3>
        {patientList.length === 0 ? (
          <div className="text-gray-400">No patients found with permission.</div>
        ) : (
          <div className="grid gap-2">
            {patientList.map((patient, index) => (
              <button
                key={index}
                onClick={() => setSelectedPatient(patient.patient_number)}
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

      {/* Record Creation Form */}
      {selectedPatient && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Record Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white focus:border-teal-500 focus:outline-none"
              placeholder="Enter record title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white focus:border-teal-500 focus:outline-none"
              placeholder="Enter detailed description"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Record Type</label>
            <select
              name="recordType"
              value={formData.recordType}
              onChange={handleInputChange}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white focus:border-teal-500 focus:outline-none"
            >
              <option value="diagnostic">Diagnostic</option>
              <option value="treatment">Treatment</option>
              <option value="prescription">Prescription</option>
              <option value="surgery">Surgery</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">IPFS CID (Optional)</label>
            <input
              type="text"
              name="cid"
              value={formData.cid}
              onChange={handleInputChange}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white focus:border-teal-500 focus:outline-none"
              placeholder="Enter IPFS CID if file is uploaded"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-teal-500 hover:bg-teal-600 disabled:bg-gray-600 text-white rounded-lg focus:outline-none focus:ring focus:ring-teal-400 transition duration-300"
          >
            {loading ? 'Creating Record...' : 'Create Record'}
          </button>
        </form>
      )}
    </div>
  );
};

export default CreateRecord; 