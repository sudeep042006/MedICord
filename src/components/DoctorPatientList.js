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
      )}
    </div>
  );
};

export default DoctorPatientList;
