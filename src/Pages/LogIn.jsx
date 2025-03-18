import React, { useContext } from 'react';
import InputField from '../components/InputField.jsx';
import Button from '../components/Button.jsx';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import UserContext from '../context/UserContext.jsx';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth, db } from '/firbaseConfig';  // ✅ Corrected Import
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

function LogIn() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { setUserN, setUserE } = useContext(UserContext);
  const navigate = useNavigate();

  const handleOnSubmit = async (data) => {
    try {
      // 🔹 Sign in user with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      // 🔹 Fetch user data from Firestore
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();

        if (user.emailVerified) {  // ✅ Check Firebase Authentication Email Verification
          if (!userData.verified) {
            await updateDoc(userRef, { verified: true });  // ✅ Auto-update verified field
          }

          setUserN(userData.userName);
          setUserE(userData.email);

          toast.success("✅ Login successful! Redirecting...");
          navigate("/fileUpload");
        } else {
          toast.error("❌ Please verify your email before logging in.");
        }
      } else {
        toast.error("⚠️ No user found in the database.");
      }
    } catch (error) {
      console.error("Login Error:", error.code, error.message);
      toast.error(`❌ Login failed! ${error.message}`);
    }
  };

  return (
    <>
      <div className="d-flex" style={{ gap: "14rem" }}>
        <div className="image my-4">
          <img src='/SignIn&LogIn.png' alt="login-icon" />
        </div>

        <div className="formClass">
          <form onSubmit={handleSubmit(handleOnSubmit)} className='p-4 rounded-3 m-4' style={{ border: "2px solid #ae50e2", width: "33rem", height: "27rem", alignContent: "center" }}>
            <h2 className='my-2 p-4'>Welcome Back</h2>
            <InputField name='email' type='email' register={register} errors={errors} />
            <InputField name='password' type='password' register={register} errors={errors} />
            <Button type='submit'>Log In</Button>
            <Link to='/forgetPassword' className='primary text-decoration-underline f-color d-flex justify-content-center my-3'>Forget Password?</Link>
            <p>Create New Account <Link to='/signup' className='primary text-decoration-underline f-color'>Sign Up</Link></p>
          </form>
        </div>
      </div>
    </>
  );
}

export default LogIn;
