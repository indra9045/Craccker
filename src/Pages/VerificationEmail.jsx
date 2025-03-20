import React, { useEffect, useState } from "react";
import { auth, db } from "/firbaseConfig";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { deleteUser } from "firebase/auth";
import { doc, deleteDoc } from "firebase/firestore";

const Verification = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(15); // Initial countdown time (15 seconds)

  useEffect(() => {
    // Function to check if the user is verified
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

    // ⏳ Check verification status every 3 seconds
    const interval = setInterval(checkVerificationStatus, 3000);

    // Countdown logic
    const countdown = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime === 1) {
          clearInterval(countdown); // Stop countdown when it reaches 0
        }
        return prevTime - 1;
      });
    }, 1000);

    // Timeout logic after 15 seconds
    const timeout = setTimeout(async () => {
      clearInterval(interval);
      const user = auth.currentUser;
      if (user && !user.emailVerified) {
        await deleteDoc(doc(db, "users", user.uid)); // Delete Firestore user
        await deleteUser(user); // Delete Firebase user
        toast.error("Verification failed! Please sign up again.", { autoClose: 5000 });
        navigate("/home");
      }
    }, 15000); // 15 seconds timeout

    // Cleanup function to clear intervals and timeouts when the component unmounts
    return () => {
      clearInterval(interval);
      clearInterval(countdown);
      clearTimeout(timeout);
    };
  }, [navigate]); // Dependency array: Only run this effect when `navigate` changes

  return (
    <div className="verification-container">
      <h2>Verify Your Email</h2>
      <p>Please check your inbox and verify your email.</p>
      <p>Once verified, you will be redirected to login automatically.</p>
      <p>You have {timeLeft} seconds left to verify your email.</p> {/* Display countdown */}
    </div>
  );
};

export default Verification;
