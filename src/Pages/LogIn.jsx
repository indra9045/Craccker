import React, { useState, useEffect, useContext } from 'react';
import InputField from '../components/InputField.jsx';
import Button from '../components/Button.jsx';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import UserContext from '../context/UserContext.jsx';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth, db } from '/firbaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

function LogIn() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { setUserN, setUserE } = useContext(UserContext);
  const navigate = useNavigate();

  const [captchaText, setCaptchaText] = useState("");
  const [userCaptcha, setUserCaptcha] = useState("");
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaType, setCaptchaType] = useState("text");

  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let text = "";
    for (let i = 0; i < 6; i++) {
      text += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(text);
    setUserCaptcha("");
    setCaptchaVerified(false);
  };

  const verifyCaptcha = () => {
    if (userCaptcha === captchaText) {
      toast.success("✅ CAPTCHA Verified!");
      setCaptchaVerified(true);
    } else {
      toast.error("❌ Incorrect CAPTCHA. Try again.");
      generateCaptcha();
    }
  };

  const playAudioCaptcha = () => {
    const speech = new SpeechSynthesisUtterance();
    speech.lang = 'en-US';
    
    let formattedText = captchaText.split('').map(char => {
      if (char.match(/[A-Z]/)) return `Uppercase ${char}`;
      if (char.match(/[a-z]/)) return `Lowercase ${char}`;
      return `Number ${char}`;
    }).join(', ');
    
    speech.text = formattedText;
    window.speechSynthesis.speak(speech);
  };

  const handleOnSubmit = async (data) => {
    if (!captchaVerified) {
      toast.error("❌ Please verify CAPTCHA first.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();

        if (user.emailVerified) {
          if (!userData.verified) { 
            await updateDoc(userRef, { verified: true });
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
        generateCaptcha();
      }
    } catch (error) {
      console.error("Login Error:", error.code, error.message);
      toast.error(`❌ Login failed! ${error.message}`);
      generateCaptcha();
    }
  };

  return (
    <>
      <div className="d-flex" style={{ gap: "14rem" }}>
        <div className="image my-4">
          <img src='/SignIn&LogIn.png' alt="login-icon" />
        </div>

        <div className="formClass">
          <form onSubmit={handleSubmit(handleOnSubmit)} className='p-4 rounded-3 m-4' style={{ border: "2px solid #ae50e2", width: "33rem", height: "30rem", alignContent: "center" }}>
            <h2 className='my-2 p-4'>Welcome Back</h2>
            <InputField name='email' type='email' register={register} errors={errors} />
            <InputField name='password' type='password' register={register} errors={errors} />

            <div className="mb-3">
              <label>Choose CAPTCHA Type:</label>
              <select value={captchaType} onChange={(e) => setCaptchaType(e.target.value)}>
                <option value="text">Text CAPTCHA</option>
                <option value="voice">Voice CAPTCHA</option>
              </select>
              <button type="button" onClick={generateCaptcha} style={{ marginLeft: "10px" }}>🔄 Refresh CAPTCHA</button>
            </div>

            <div className="captcha-section" style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "8px", marginBottom: "10px" }}>
              {captchaType === "text" && (
                <div>
                  <p className="fw-bold" style={{ fontSize: "1.2rem" }}>{captchaText}</p>
                  <input type="text" value={userCaptcha} onChange={(e) => setUserCaptcha(e.target.value)} placeholder="Enter CAPTCHA" />
                  <button type="button" onClick={verifyCaptcha}>Verify</button>
                </div>
              )}
              {captchaType === "voice" && (
                <div>
                  <button type="button" onClick={playAudioCaptcha}>🔊 Play CAPTCHA</button>
                  <input type="text" value={userCaptcha} onChange={(e) => setUserCaptcha(e.target.value)} placeholder="Enter CAPTCHA" />
                  <button type="button" onClick={verifyCaptcha}>Verify</button>
                </div>
              )}
            </div>

            <Button type='submit' disabled={!captchaVerified}>Log In</Button>
            <Link to='/forgetPassword' className='primary text-decoration-underline f-color d-flex justify-content-center my-3'>Forget Password?</Link>
            <p>Create New Account <Link to='/signup' className='primary text-decoration-underline f-color'>Sign Up</Link></p>
          </form>
        </div>
      </div>
    </>
  );
}

export default LogIn;
