import React, { useEffect } from "react";
import { auth, db } from "/firbaseConfig";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { deleteUser } from "firebase/auth";
import { doc, deleteDoc } from "firebase/firestore";

const Verification = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkVerificationStatus = async () => {
      const user = auth.currentUser;
      if (user) {
        await user.reload(); // Refresh user data
        if (user.emailVerified) {
          toast.success("✅ Email verified! Redirecting to login...", { autoClose: 1000 });
          setTimeout(() => navigate("/login"), 2000);
          return;
        }
      }
    };

    // ⏳ Check every 3 seconds
    const interval = setInterval(checkVerificationStatus, 3000);

    // ⏳ Stop checking & delete user after 15 seconds
    setTimeout(async () => {
      clearInterval(interval);
      const user = auth.currentUser;
      if (user && !user.emailVerified) {
        await deleteDoc(doc(db, "users", user.uid)); // Delete Firestore user
        await deleteUser(user); // Delete Firebase user
        toast.error("Verification failed! Please sign up again.", { autoClose: 5000 });
        navigate("/home");
      }
    }, 15000); // ⏳ 15 seconds timeout

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="verification-container">
      <h2>Verify Your Email</h2>
      <p>Please check your inbox and verify your email.</p>
      <p>Once verified, you will be redirected to login automatically.</p>
    </div>
  );
};

export default Verification;
