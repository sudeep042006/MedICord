import React, { useState } from "react";
import { useParams } from "react-router-dom";
import NavBar_Logout from "./NavBar_Logout";

const PatientRecords = () => {
  const { hhNumber } = useParams();
  const [records, setRecords] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newRecord, setNewRecord] = useState({ title: "", description: "" });

  const handleAddRecord = () => {
    setShowModal(true);
    setNewRecord({ title: "", description: "" });
  };

  const handleSaveRecord = () => {
    if (!newRecord.title || !newRecord.description) return;
    setRecords([{ ...newRecord, id: Date.now() }, ...records]);
    setShowModal(false);
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
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Modal for adding record */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white text-black rounded-lg p-6 w-80">
              <h3 className="text-lg font-bold mb-4">Add New Record</h3>
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
              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-1 bg-gray-300 rounded"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-1 bg-teal-500 text-white rounded"
                  onClick={handleSaveRecord}
                >
                  Save
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
