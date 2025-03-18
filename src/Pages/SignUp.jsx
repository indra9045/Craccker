import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth, db } from '/firbaseConfig'; // ✅ Ensure correct path
import { createUserWithEmailAndPassword, sendEmailVerification, deleteUser } from "firebase/auth";
import { doc, setDoc, deleteDoc } from "firebase/firestore";

const SignUp = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const handleOnSubmit = async (data) => {
    try {
      console.log("Signing up user:", data.email);

      // ✅ Step 1: Create User in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      // ✅ Step 2: Send Email Verification
      await sendEmailVerification(user);
      toast.info("📩 Verification email sent! Please check your inbox.", { autoClose: 5000 });

      // ✅ Step 3: Store User Data in Firestore
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        email: data.email,
        userName: data.userName,
        dob: data.dob,
        gender: data.gender,
        address: data.address,
        city: data.city,
        state: data.state,
        country: data.country,
        verified: false, // Initially unverified
        createdAt: new Date()
      });

      // ✅ Step 4: Redirect to Verification Page
      navigate("/verification");

    } catch (error) {
      console.error("❌ Error during sign-up:", error);
      toast.error(error.message || "Something went wrong!", { autoClose: 3000 });
    }
  };

  return (
    <div className="d-flex" style={{ gap: "14rem" }}>
      <div className="image my-4">
        <img src='/SignIn&LogIn.png' alt="signup-icon" />
      </div>
      <div className="formClass">
        <form onSubmit={handleSubmit(handleOnSubmit)} className='p-4 rounded-3 m-4'
          style={{ border: "2px solid #ae50e2", width: "33rem", height: "30rem", alignContent: "center" }}>
          <h2 className='my-3'>Sign Up</h2>
          <input {...register('userName')} placeholder="Full Name" required />
          <input {...register('email')} type='email' placeholder="Email" required />
          <input {...register('password')} type='password' placeholder="Password" required />
          <input {...register('dob')} type='date' required />
          <input {...register('gender')} placeholder="Gender" required />
          <input {...register('address')} placeholder="Address" required />
          <input {...register('city')} placeholder="City" required />
          <input {...register('state')} placeholder="State" required />
          <input {...register('country')} placeholder="Country" required />
          <label>
            <input type="checkbox" required /> I agree to the Terms and Conditions
          </label>
          <button type='submit'>Sign Up</button>
          <p>Already have an account? <Link to='/Login'>Log In</Link></p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
