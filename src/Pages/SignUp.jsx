import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth, db } from "/firbaseConfig";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBRadio,
} from "mdb-react-ui-kit";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const SignUp = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  // CAPTCHA States
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
    speech.lang = "en-US";

    let formattedText = captchaText
      .split("")
      .map((char) => {
        if (char.match(/[A-Z]/)) return `Uppercase ${char}`;
        if (char.match(/[a-z]/)) return `Lowercase ${char}`;
        return `Number ${char}`;
      })
      .join(", ");

    speech.text = formattedText;
    window.speechSynthesis.speak(speech);
  };

  const onSubmit = async (data) => {
    if (!captchaVerified) {
      toast.error("❌ Please verify CAPTCHA first.");
      return;
    }

    try {
      console.log("Signing up user:", data.email);

      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      await sendEmailVerification(user);
      toast.info("📩 Verification email sent! Please check your inbox.", { autoClose: 5000 });

      await setDoc(doc(db, "users", user.uid), {
        email: data.email,
        userName: `${data.firstName} ${data.lastName}`,
        dob: data.dob,
        gender: data.gender,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        country: data.country,
        verified: false,
        createdAt: new Date(),
      });

      navigate("/verification");
    } catch (error) {
      console.error("❌ Error during sign-up:", error);
      toast.error(error.message || "Something went wrong!", { autoClose: 3000 });
    }
  };

  return (
    <MDBContainer fluid style={{ width: "900px" }}>
      <MDBRow className="justify-content-center align-items-center m-5">
        <MDBCard>
          <MDBCardBody className="px-4">
            <h3 className="fw-bold mb-4 pb-2 pb-md-0 mb-md-5 text-dark">Registration Form</h3>

            <form onSubmit={handleSubmit(onSubmit)}>
              <MDBRow>
                <MDBCol md="6">
                  <MDBInput wrapperClass="mb-4" size="lg" type="text" placeholder="First name" {...register("firstName", { required: "First name is required" })} />
                  {errors.firstName && <p className="text-danger">{errors.firstName.message}</p>}
                </MDBCol>
                <MDBCol md="6">
                  <MDBInput wrapperClass="mb-4" size="lg" type="text" placeholder="Last name" {...register("lastName", { required: "Last name is required" })} />
                  {errors.lastName && <p className="text-danger">{errors.lastName.message}</p>}
                </MDBCol>
              </MDBRow>

              <MDBRow>
                <MDBCol md="6">
                  <label className="fw-bold">D.O.B</label>
                  <MDBInput wrapperClass="mb-4" placeholder="Birthday" size="lg" type="date" {...register("dob", { required: "Date of birth is required" })} />
                </MDBCol>
                <MDBCol md="6" className="mb-4">
                  <h6 className="fw-bold">Gender:</h6>
                  <MDBRadio {...register("gender", { required: "Gender is required" })} name="gender" value="Female" label="Female" inline />
                  <MDBRadio {...register("gender")} name="gender" value="Male" label="Male" inline />
                  <MDBRadio {...register("gender")} name="gender" value="Other" label="Other" inline />
                </MDBCol>
              </MDBRow>

              <MDBRow>
                <MDBCol md="6">
                  <MDBInput wrapperClass="mb-4" placeholder="Email" size="lg" type="email" {...register("email", { required: "Email is required" })} />
                </MDBCol>
                <MDBCol md="6">
                  <MDBInput wrapperClass="mb-4" placeholder="Password" size="lg" type="password" {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters long" } })} />
                </MDBCol>
              </MDBRow>

              {/* Confirm Password Field */}
              <MDBRow>
                <MDBCol md="6">
                  <MDBInput
                    wrapperClass="mb-4"
                    placeholder="Confirm Password"
                    size="lg"
                    type="password"
                    {...register("confirmPassword", {
                      required: "Confirm password is required",
                      validate: (value) => value === watch("password") || "Passwords do not match",
                    })}
                  />
                  {errors.confirmPassword && <p className="text-danger">{errors.confirmPassword.message}</p>}
                </MDBCol>
              </MDBRow>

              {/* Address, City, State, and Country Fields */}
              <MDBRow>
                <MDBCol md="6">
                  <MDBInput wrapperClass="mb-4" placeholder="Address" size="lg" type="text" {...register("address", { required: "Address is required" })} />
                  {errors.address && <p className="text-danger">{errors.address.message}</p>}
                </MDBCol>
                <MDBCol md="6">
                  <MDBInput wrapperClass="mb-4" placeholder="City" size="lg" type="text" {...register("city", { required: "City is required" })} />
                  {errors.city && <p className="text-danger">{errors.city.message}</p>}
                </MDBCol>
              </MDBRow>

              <MDBRow>
                <MDBCol md="6">
                  <MDBInput wrapperClass="mb-4" placeholder="State" size="lg" type="text" {...register("state", { required: "State is required" })} />
                  {errors.state && <p className="text-danger">{errors.state.message}</p>}
                </MDBCol>
                <MDBCol md="6">
                  <MDBInput wrapperClass="mb-4" placeholder="Country" size="lg" type="text" {...register("country", { required: "Country is required" })} />
                  {errors.country && <p className="text-danger">{errors.country.message}</p>}
                </MDBCol>
              </MDBRow>

              {/* Phone Field */}
              <MDBRow>
                <MDBCol md="6">
                  <MDBInput
                    wrapperClass="mb-4"
                    placeholder="Phone Number"
                    size="lg"
                    type="text"
                    {...register("phone", { required: "Phone number is required", pattern: { value: /^[0-9]{10}$/, message: "Invalid phone number format" } })}
                  />
                  {errors.phone && <p className="text-danger">{errors.phone.message}</p>}
                </MDBCol>
              </MDBRow>

              {/* CAPTCHA Section */}
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
                    <input 
                      type="text" 
                      value={userCaptcha} 
                      onChange={(e) => setUserCaptcha(e.target.value)} 
                      placeholder="Enter CAPTCHA" 
                    />
                    <button type="button" onClick={verifyCaptcha}>Verify</button>
                  </div>
                )}

                {captchaType === "voice" && (
                  <div>
                    <button type="button" onClick={playAudioCaptcha} style={{ marginBottom: "10px" }}>🔊 Play CAPTCHA</button>
                    <input 
                      type="text" 
                      value={userCaptcha} 
                      onChange={(e) => setUserCaptcha(e.target.value)} 
                      placeholder="Enter CAPTCHA" 
                    />
                    <button type="button" onClick={verifyCaptcha}>Verify</button>
                  </div>
                )}
              </div>

              <MDBBtn type="submit" className="mb-4" size="lg" disabled={!captchaVerified}>Submit</MDBBtn>
            </form>

            <p>Already have an account? <Link to="/login">Login</Link></p>
          </MDBCardBody>
        </MDBCard>
      </MDBRow>
    </MDBContainer>
  );
};

export default SignUp;
