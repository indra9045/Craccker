import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import "../style/landingPagestyle.css"
import "../style/style.css"



const LandingPage = () => {

  const [isDisabled, setIsDisabled] = useState(false)
  useEffect(() => {

    const accessToken = localStorage.getItem('token')
    console.log("token from home:", accessToken)
    if (accessToken && accessToken !== 'undefined' && accessToken !== '') {
      setIsDisabled(true)

    }
  }, [])
  console.log("is disabled:", isDisabled)

  return (
    <>
      <div className='home-wrapper'>
        <div className='container-fluid vw-100 vh-100 d-flex align-items-center justify-content-center m-0 p-0'>
          <div className='container w-100 d-flex align-items-center'>
            <div className="row w-100 h-100 align-items-center m-0">
              <div className='col-lg-6 col-md-12 text-center text-lg-left text-white'>
                <h1 className='d-flex my-3 f-color'>Hey there,</h1>
                <h2 className='d-flex my-2 animated-text f-color'>Welcome to Hackers world</h2>
                <Link to="/signup" role='button' className="btn my-4 btn-primary">
                  Learn More
                </Link>
                
              </div>
              <div className='col-lg-6 col-md-12 text-center text-lg-right'>
                <img src="/HomeImg.png" alt="error" className='img-fluid' />
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}
export default LandingPage
