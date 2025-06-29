import React from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/./AboutUs.css";
import NavBar from "./NavBar";
import hospitalImage from "../images/hospital.png"; // Import the hospital image

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <div>
      <NavBar />
      <div className="hospital-image-container">
        <img
          src={hospitalImage}
          alt="Hospital"
          className="hospital-image"
        />
      </div>

      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col text-custom-blue space-y-8 w-3/5 p-8 bg-gray-800 shadow-lg rounded-lg transition-transform duration-10000 ease-in-out transform hover:scale-105">
          <div className="space-y-4">
            <h1 className="text-lg font-mono text-center">About Us</h1>
            <div className="about-content text-left">
              <h2>Who We Are</h2>
              <p>
                At MediCord, we are a passionate team of healthcare innovators and blockchain technologists on a mission to break barriers in global healthcare. We aim to redefine how medical records are shared and accessed across borders, ensuring security, privacy, and seamless access for everyone, anywhere.
              </p>

              <h2>What We Do</h2>
              <p>
                MediCord provides a secure, decentralized platform for managing and sharing Electronic Health Records (EHR) across countries. By leveraging cutting-edge blockchain technologies like Ethereum, Hyperledger, and IPFS, we ensure that medical data is accessible, interoperable, and protected—no matter where life takes you.
              </p>

              <h3>For Doctors</h3>
              <p>
                Doctors can securely access authorized patient records, view medical histories, and contribute to treatment plans, even for patients traveling or living abroad.
              </p>

              <h3>For Patients</h3>
              <p>
                Patients remain in full control of their medical data. They can view their health records, upload reports, and easily manage who can access their sensitive information—ensuring privacy and consent are never compromised.
              </p>

              <h3>For Diagnostic Centers</h3>
              <p>
                Diagnostic Centers can collaborate globally by uploading test reports and accessing doctor recommendations, all within a secure, blockchain-powered system.
              </p>

              <h2>Our Commitment</h2>
              <p>
                MediCord is designed to tackle the challenges of fragmented healthcare systems and privacy regulations. We prioritize:
              </p>
              <ul className="list-disc ml-6 mt-2">
                <li>✔ Secure, cross-border sharing of medical data</li>
                <li>✔ Role-based access control and smart consent management</li>
                <li>✔ Interoperability across multiple blockchain networks</li>
                <li>✔ Real-world usability for patients, doctors, and diagnostic centers</li>
              </ul>

              <h2>Contact Us</h2>
              <p>
                We believe that secure healthcare access knows no borders. If you have questions or want to learn more, feel free to contact us:<br />
                📞 Phone: +123 456 7890<br />
                ✉️ Email: example@medicord.com
              </p>
            </div>
          </div>
        </div>
      </div>

      <br />
      <br />
      <br />
      <br />
      <br />

      <div className="flex justify-center">
        <button
          className="bg-teal-500 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-110 hover:bg-gray-600"
          onClick={() => {
            navigate("/");
          }}
        >
          Back to Home Page
        </button>
      </div>
    </div>
  );
};

export default AboutUs;
