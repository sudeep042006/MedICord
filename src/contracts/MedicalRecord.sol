// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract MedicalRecord {
    struct Record {
        string recordId;
        string doctorName;
        string patientName;
        uint256 age;
        string gender;
        string bloodGroup;
        address diagnosticAddress;
        address patientAddress;
        string cid;
    }

    Record[] private records;

    event RecordCreated(
        string recordId,
        string doctorName,
        string patientName,
        uint256 age,
        string gender,
        string bloodGroup,
        address diagnosticAddress,
        address patientAddress,
        string cid
    );

    function createRecord(
        string memory _recordId,
        string memory _doctorName,
        string memory _patientName,
        uint256 _age,
        string memory _gender,
        string memory _bloodGroup,
        address _diagnosticAddress,
        address _patientAddress,
        string memory _cid
    ) public {
        records.push(
            Record(
                _recordId,
                _doctorName,
                _patientName,
                _age,
                _gender,
                _bloodGroup,
                _diagnosticAddress,
                _patientAddress,
                _cid
            )
        );
        emit RecordCreated(
            _recordId,
            _doctorName,
            _patientName,
            _age,
            _gender,
            _bloodGroup,
            _diagnosticAddress,
            _patientAddress,
            _cid
        );
    }

    function getRecords() public view returns (Record[] memory) {
        return records;
    }
}
