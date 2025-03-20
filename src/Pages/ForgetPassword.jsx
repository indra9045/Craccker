import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "/firbaseConfig";
import { MDBContainer, MDBInput, MDBBtn } from "mdb-react-ui-kit";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

function ForgetPassword() {
  const [mail, setMail] = useState("");
  const navigate = useNavigate(); // 🔹 Use navigation

  const handleClick = async (e) => {
    e.preventDefault();

    if (!mail) {
      toast.error("❌ Please enter a valid email.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, mail);
      toast.success("✅ Password reset email sent! Redirecting to login...", {
        onClose: () => navigate("/login"), // 🔹 Navigate after toast closes
        delay: 3000, // Delay for toast to complete
      });
    } catch (error) {
      toast.error("❌ " + error.message);
    }
  };

  return (
    <MDBContainer className="d-flex flex-column align-items-center justify-content-center vh-100">
      <h2 className="mb-4">Forgot Password?</h2>

      <MDBInput
        label="Enter your email"
        type="email"
        className="mb-3"
        onChange={(e) => setMail(e.target.value)}
        required
      />

      <MDBBtn color="primary" onClick={handleClick}>
        Send Reset Link
      </MDBBtn>

      {/* Toast Notifications */}
      <ToastContainer position="top-right" autoClose={3000} />
    </MDBContainer>
  );
}

export default ForgetPassword;
