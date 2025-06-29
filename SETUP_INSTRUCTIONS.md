# MediCord Setup Instructions

## Overview

This system allows doctors to view patient lists from the blockchain and manage medical records in a backend database. The system integrates smart contracts for patient permissions with a MongoDB backend for record storage.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally on port 27017)
- MetaMask browser extension
- Truffle (for smart contract deployment)

## Setup Instructions

### 1. Backend Setup

1. **Navigate to the backend directory:**

   ```bash
   cd backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start MongoDB:**
   Make sure MongoDB is running on your system. If not, start it:

   ```bash
   # On Windows
   net start MongoDB

   # On macOS/Linux
   sudo systemctl start mongod
   ```

4. **Start the backend server:**

   ```bash
   node server.js
   ```

   The API will be available at `http://localhost:5000`

5. **Test the API (optional):**
   ```bash
   node test-api.js
   ```

### 2. Frontend Setup

1. **Navigate to the project root:**

   ```bash
   cd ..
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Deploy smart contracts (if not already deployed):**

   ```bash
   truffle migrate --reset
   ```

4. **Start the React development server:**
   ```bash
   npm start
   ```
   The frontend will be available at `http://localhost:3000`

### 3. Smart Contract Deployment

1. **Make sure you have a local blockchain running (Ganache) or are connected to a testnet**

2. **Deploy the contracts:**

   ```bash
   truffle migrate --reset
   ```

3. **Note the deployed contract addresses for:**
   - DoctorRegistration
   - PatientRegistration
   - MedicalRecord

## How to Use the System

### For Patients:

1. **Register as a Patient:**

   - Go to `/patient_registration`
   - Fill in your details and register with a unique HH Number (e.g., PAT001)

2. **Login as a Patient:**

   - Go to `/patient_login`
   - Enter your HH Number and password

3. **Access Patient Dashboard:**

   - View your profile
   - View your medical records
   - **Manage Doctor Permissions** (NEW!)

4. **Grant Permission to Doctors:**
   - Click "Manage Permissions" in your dashboard
   - Enter the doctor's HH Number (e.g., DOC001)
   - Click "Grant Permission"
   - You can also revoke permissions later

### For Doctors:

1. **Register as a Doctor:**

   - Go to `/doctor_registration`
   - Fill in your details and register with a unique HH Number (e.g., DOC001)

2. **Login as a Doctor:**

   - Go to `/doctor_login`
   - Enter your HH Number and password

3. **Access Doctor Dashboard:**
   - View your profile
   - **My Patients** - See patients who have granted you permission
   - **All Patients** - Browse all registered patients
   - **Create Record** - Create new medical records
   - **Full View** - Detailed patient list view

### Key Features:

1. **Permission System:**

   - Patients control who can view their records
   - Patients must explicitly grant permission to doctors
   - Doctors can only see patients who granted permission
   - Patients can revoke permissions at any time

2. **Patient List Management:**

   - "My Patients" shows only patients who granted permission
   - "All Patients" shows all registered patients for reference
   - Search functionality to find specific patients

3. **Record Management:**
   - Create new medical records for authorized patients
   - View existing records from the backend
   - Records are stored in MongoDB with patient information

## Testing the Permission System

### Quick Test Setup:

1. **Register Test Patients:**

   ```
   PAT001 - John Doe (john@test.com)
   PAT002 - Jane Smith (jane@test.com)
   PAT003 - Bob Wilson (bob@test.com)
   ```

2. **Register Test Doctors:**

   ```
   DOC001 - Dr. Alice Johnson (Cardiology)
   DOC002 - Dr. Mike Brown (Neurology)
   DOC003 - Dr. Sarah Davis (Pediatrics)
   ```

3. **Test Permission Flow:**
   - Login as PAT001 → Manage Permissions → Grant to DOC001
   - Login as DOC001 → My Patients → Should see PAT001
   - Login as DOC001 → All Patients → Should see all patients

### Test Scenarios:

1. **Basic Permission Granting:**

   - Patient grants permission to doctor
   - Doctor can see patient in "My Patients"
   - Doctor can create records for that patient

2. **Multiple Permissions:**

   - Patient grants permission to multiple doctors
   - Each doctor can see the patient in their list

3. **Permission Revocation:**

   - Patient revokes permission from doctor
   - Doctor no longer sees patient in "My Patients"
   - Doctor cannot create new records for that patient

4. **Record Creation:**
   - Doctor creates record for authorized patient
   - Patient can view the record in their dashboard

## API Endpoints

### Records API (`http://localhost:5000/api`)

- `GET /health` - Health check
- `POST /records` - Create a new record
- `GET /records` - Get all records
- `GET /records/:patientAddress` - Get records for a specific patient
- `GET /records/id/:id` - Get a specific record by ID
- `PUT /records/:id` - Update a record
- `DELETE /records/:id` - Delete a record

### Example Record Structure:

```json
{
  "patientAddress": "PAT001",
  "title": "Blood Test Results",
  "description": "Complete blood count results",
  "timeStamp": "2024-01-15T10:30:00.000Z",
  "cid": "QmTestCID123456789",
  "patientInfo": {
    "name": "John Doe",
    "dateOfBirth": "1990-05-15",
    "gender": "Male",
    "bloodGroup": "O+",
    "homeAddress": "123 Main St",
    "email": "john@email.com"
  },
  "doctorInfo": {
    "name": "Dr. Smith",
    "hhNumber": "DOC001",
    "specialization": "Internal Medicine",
    "hospitalName": "City Hospital"
  },
  "recordType": "diagnostic"
}
```

## Troubleshooting

### Common Issues:

1. **"No patients found with permission":**

   - Patients must explicitly grant permission to doctors
   - Check if the permission was actually granted
   - Verify the doctor's HH Number is correct
   - Check browser console for errors

2. **"No patients registered yet":**

   - Register some patients first
   - Check if the smart contract is deployed correctly
   - Verify the contract address in the frontend

3. **Permission granting fails:**

   - Check if the doctor HH Number exists
   - Ensure you're using the correct wallet address
   - Check MetaMask for transaction errors

4. **MongoDB Connection Error:**

   - Ensure MongoDB is running
   - Check if the connection string is correct
   - Verify MongoDB is accessible on port 27017

5. **Smart Contract Connection Error:**

   - Ensure MetaMask is installed and connected
   - Check if you're on the correct network
   - Verify contract addresses are correct

6. **CORS Errors:**
   - The backend has CORS enabled for localhost
   - If using a different port, update the CORS configuration

### Testing the System:

1. **Test Backend API:**

   ```bash
   cd backend
   node test-api.js
   ```

2. **Test Permission System:**

   ```bash
   node test-permissions.js
   ```

3. **Test Smart Contracts:**

   ```bash
   truffle test
   ```

4. **Test Frontend:**
   - Open browser developer tools
   - Check console for errors
   - Test all user flows

## Security Considerations

1. **Data Privacy:**

   - Patient permissions are managed on the blockchain
   - Only authorized doctors can view patient records
   - Backend validates permissions before serving data

2. **Input Validation:**

   - All inputs are validated on both frontend and backend
   - SQL injection protection through Mongoose
   - XSS protection through proper data sanitization

3. **Access Control:**
   - Doctor authentication through smart contracts
   - Patient permission system on blockchain
   - Backend API protected by patient address validation

## Future Enhancements

1. **IPFS Integration:**

   - File upload and storage on IPFS
   - CID management for medical files
   - Decentralized file storage

2. **Advanced Permissions:**

   - Time-based permissions
   - Permission levels (read-only, read-write)
   - Emergency access protocols

3. **Audit Trail:**
   - Record access logging
   - Blockchain-based audit trail
   - Compliance reporting

## Support

If you encounter any issues:

1. Check the console logs for error messages
2. Verify all services are running
3. Test individual components separately
4. Check network connectivity and configurations
5. Run the test scripts to verify functionality
