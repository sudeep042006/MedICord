const fetch = require('node-fetch');

const API_BASE = 'http://localhost:5000/api';

// Test data
const testRecord = {
  patientAddress: "PAT001",
  title: "Blood Test Results",
  description: "Complete blood count and comprehensive metabolic panel results",
  timeStamp: new Date().toISOString(),
  cid: "QmTestCID123456789",
  patientInfo: {
    name: "John Doe",
    dateOfBirth: "1990-05-15",
    gender: "Male",
    bloodGroup: "O+",
    homeAddress: "123 Main St, City, State",
    email: "john.doe@email.com"
  },
  doctorInfo: {
    name: "Dr. Smith",
    hhNumber: "DOC001",
    specialization: "Internal Medicine",
    hospitalName: "City General Hospital"
  },
  recordType: "diagnostic"
};

async function testAPI() {
  console.log('🧪 Testing MediCord API...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const healthResponse = await fetch(`${API_BASE}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health Check:', healthData);
    console.log('');

    // Test 2: Create Record
    console.log('2. Testing Create Record...');
    const createResponse = await fetch(`${API_BASE}/records`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testRecord)
    });
    
    if (createResponse.ok) {
      const createdRecord = await createResponse.json();
      console.log('✅ Record Created:', createdRecord._id);
      console.log('');
      
      // Test 3: Get Records for Patient
      console.log('3. Testing Get Records for Patient...');
      const getResponse = await fetch(`${API_BASE}/records/${testRecord.patientAddress}`);
      const records = await getResponse.json();
      console.log(`✅ Found ${records.length} records for patient ${testRecord.patientAddress}`);
      records.forEach((record, index) => {
        console.log(`   Record ${index + 1}: ${record.title} - ${record._id}`);
      });
      console.log('');

      // Test 4: Get All Records
      console.log('4. Testing Get All Records...');
      const allRecordsResponse = await fetch(`${API_BASE}/records`);
      const allRecords = await allRecordsResponse.json();
      console.log(`✅ Total records in database: ${allRecords.length}`);
      console.log('');

      // Test 5: Get Record by ID
      console.log('5. Testing Get Record by ID...');
      const recordByIdResponse = await fetch(`${API_BASE}/records/id/${createdRecord._id}`);
      const recordById = await recordByIdResponse.json();
      console.log('✅ Record by ID:', recordById.title);
      console.log('');

      // Test 6: Update Record
      console.log('6. Testing Update Record...');
      const updateData = { ...testRecord, title: "Updated Blood Test Results" };
      const updateResponse = await fetch(`${API_BASE}/records/${createdRecord._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });
      
      if (updateResponse.ok) {
        const updatedRecord = await updateResponse.json();
        console.log('✅ Record Updated:', updatedRecord.title);
        console.log('');
      }

      // Test 7: Delete Record
      console.log('7. Testing Delete Record...');
      const deleteResponse = await fetch(`${API_BASE}/records/${createdRecord._id}`, {
        method: 'DELETE'
      });
      
      if (deleteResponse.ok) {
        console.log('✅ Record Deleted Successfully');
        console.log('');
      }

    } else {
      console.log('❌ Failed to create record:', createResponse.status);
    }

  } catch (error) {
    console.error('❌ API Test Failed:', error.message);
  }
}

// Run the test
testAPI(); 