// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract UploadEhr {
    struct PatientRecord {
        string title;
        string description;
        string timeStamp;
        string medicalRecordHash; // IPFS CID
    }

    // Mapping from patient address to their records
    mapping(address => PatientRecord[]) private records;

    // Add a record for a patient (can be called by patient or authorized doctor)
    function addRecord(
        address patient,
        string memory title,
        string memory description,
        string memory timeStamp,
        string memory medicalRecordHash
    ) public {
        PatientRecord memory newRecord = PatientRecord(
            title,
            description,
            timeStamp,
            medicalRecordHash
        );
        records[patient].push(newRecord);
    }

    // Get all records for a patient
    function getRecords(
        address patient
    ) public view returns (PatientRecord[] memory) {
        return records[patient];
    }
}
