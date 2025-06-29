// Test script to help set up permissions between doctors and patients
// This script provides instructions and sample data for testing

console.log(`
🧪 MediCord Permission Testing Guide
====================================

To test the patient list functionality, you need to:

1. REGISTER PATIENTS:
   - Go to /patient_registration
   - Register multiple patients with different HH Numbers
   - Example HH Numbers: PAT001, PAT002, PAT003

2. REGISTER DOCTORS:
   - Go to /doctor_registration  
   - Register doctors with different HH Numbers
   - Example HH Numbers: DOC001, DOC002, DOC003

3. GRANT PERMISSIONS:
   - Login as a patient (e.g., PAT001)
   - Go to "Manage Permissions" 
   - Enter doctor's HH Number (e.g., DOC001)
   - Click "Grant Permission"

4. TEST DOCTOR DASHBOARD:
   - Login as the doctor (e.g., DOC001)
   - Go to "My Patients" - you should see the patient who granted permission
   - Go to "All Patients" - you should see all registered patients

SAMPLE TEST DATA:
================

PATIENTS:
- HH Number: PAT001, Name: John Doe, Email: john@test.com
- HH Number: PAT002, Name: Jane Smith, Email: jane@test.com  
- HH Number: PAT003, Name: Bob Wilson, Email: bob@test.com

DOCTORS:
- HH Number: DOC001, Name: Dr. Alice Johnson, Specialization: Cardiology
- HH Number: DOC002, Name: Dr. Mike Brown, Specialization: Neurology
- HH Number: DOC003, Name: Dr. Sarah Davis, Specialization: Pediatrics

TEST SCENARIOS:
===============

1. Patient PAT001 grants permission to DOC001
   - Login as PAT001 → Manage Permissions → Enter DOC001 → Grant
   - Login as DOC001 → My Patients → Should see PAT001

2. Patient PAT002 grants permission to DOC001 and DOC002
   - Login as PAT002 → Manage Permissions → Grant to both doctors
   - Login as DOC001 → My Patients → Should see PAT002
   - Login as DOC002 → My Patients → Should see PAT002

3. Test record creation
   - Login as DOC001 → Create Record → Select PAT001 → Create record
   - Login as PAT001 → View Records → Should see the created record

4. Test permission revocation
   - Login as PAT001 → Manage Permissions → Revoke DOC001
   - Login as DOC001 → My Patients → Should not see PAT001 anymore

TROUBLESHOOTING:
================

If "No patients found with permission":
- Check if patients have actually granted permission
- Verify the doctor's HH Number is correct
- Check browser console for errors
- Ensure MetaMask is connected to the correct network

If "No patients registered yet":
- Register some patients first
- Check if the smart contract is deployed correctly
- Verify the contract address in the frontend

If permission granting fails:
- Check if the doctor HH Number exists
- Ensure you're using the correct wallet address
- Check MetaMask for transaction errors

QUICK COMMANDS:
===============

1. Start Backend:
   cd backend && node server.js

2. Start Frontend:
   npm start

3. Test API:
   cd backend && node test-api.js

4. Deploy Contracts:
   truffle migrate --reset

Remember: Patients must explicitly grant permission to doctors before they appear in the doctor's patient list!
`);

// Export for potential programmatic use
module.exports = {
  samplePatients: [
    { hhNumber: 'PAT001', name: 'John Doe', email: 'john@test.com' },
    { hhNumber: 'PAT002', name: 'Jane Smith', email: 'jane@test.com' },
    { hhNumber: 'PAT003', name: 'Bob Wilson', email: 'bob@test.com' }
  ],
  sampleDoctors: [
    { hhNumber: 'DOC001', name: 'Dr. Alice Johnson', specialization: 'Cardiology' },
    { hhNumber: 'DOC002', name: 'Dr. Mike Brown', specialization: 'Neurology' },
    { hhNumber: 'DOC003', name: 'Dr. Sarah Davis', specialization: 'Pediatrics' }
  ]
}; 