import React, { useState, useEffect } from 'react';
import AWS from 'aws-sdk';
import './App.css';


const images = require.context('../img', true);

function login() {
  console.log('Loging in..')
  AWS.config.update({ region: "us-west-2" });

  const payload = {
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: "6m2h8eaq0in0v90p6r9n451hnm",
    AuthParameters: {
      USERNAME: document.getElementById('email').value,
      PASSWORD: document.getElementById('password').value
    }
  }

  var cognito = new AWS.CognitoIdentityServiceProvider();
  cognito.initiateAuth(payload, function (err, data) {
    if (err) {
      alert("Error: " + err);
      console.error(err);
    } else {
      // window.location.href = "https://www.google.com";
      console.log("Success")
    }
  });
}

function signUp() {
  console.log('Signing up..');
  const email = document.getElementById('signup_email').value;
  const password = document.getElementById('signup_password').value;

  const apiUrl = 'https://lkpm8si61d.execute-api.us-west-2.amazonaws.com/dev/signup_user';

  const payload = {
    body: {
      email: email,
      password: password
    }
  };

  fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Success:', data);
      if (data.statusCode === 200) {
        openModal();
      } else {
        alert('Error: ' + data.msg);
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert(error)
    });
}

function verifyUser() {
  console.log('Verifying..');
  const email = document.getElementById('signup_email').value;
  const otp = Array.from({ length: 6 }, (_, index) => {
    const otpDigit = document.getElementById(`otp${index + 1}`).value;
    return String(otpDigit || ''); // Ensure each digit is treated as a string
  }).join('');

  const apiUrl = 'https://lkpm8si61d.execute-api.us-west-2.amazonaws.com/dev/verify_user';

  const payload = {
    body: {
      email: email,
      otp: otp
    }
  };

  fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Success:', data);
      document.getElementById('verification-modal').style.display = 'none';
    })
    .catch(error => {
      console.error('Error:', error);
      alert(error)
    });
}

function openModal() {
  document.getElementById('verification-modal').style.display = 'block';
  const signUpEmail = document.getElementById('signup_email').value;
  const modalEmailInput = document.getElementById('modal_email');
  modalEmailInput.value = signUpEmail;

  // $('#verification-modal').modal('show');
}


function handleInput(input) {
  const nextInput = input.nextElementSibling;
  if (nextInput && input.value !== "") {
    nextInput.focus();
  }

  if (input.value.length > 1) {
    const digits = input.value.split("");
    for (let i = 0; i < digits.length; i++) {
      input.value = digits[i];
      if (i < digits.length - 1) {
        input = input.nextElementSibling;
      }
    }
  }
}

function resend_otp() {
  const email = document.getElementById('modal_email').value;
  const apiUrl = `https://lkpm8si61d.execute-api.us-west-2.amazonaws.com/dev/resend_otp`;

  const payload = {
    body: {
      email: email,
    }
  };

  fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Success:', data);
    })
    .catch(error => {
      console.error('Error:', error);
      alert(error)
    });
}

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);

  useEffect(() => {
    const sign_in_btn = document.querySelector("#sign-in-btn");
    const sign_up_btn = document.querySelector("#sign-up-btn");
    const container = document.querySelector(".container");

    if (sign_in_btn && sign_up_btn && container) {
      sign_up_btn.addEventListener('click', () => {
        container.classList.add("sign-up-mode");
      });

      sign_in_btn.addEventListener('click', () => {
        container.classList.remove("sign-up-mode");
      });
    }
  }, []); // Empty dependency array ensures that this effect runs once on mount


  const handleInput = (index, value) => {
    const updatedOtpValues = [...otpValues];
    updatedOtpValues[index] = value;
    setOtpValues(updatedOtpValues);
  };

  const handleSignInSubmit = (e) => {
    e.preventDefault();
    console.log('Sign In Clicked');
    login();
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    console.log('Sign Up Clicked');
    signUp();
  };

  const handleVerifyClick = () => {
    console.log('Verify Clicked');
    verifyUser();
  };

  const handleRequestAgainClick = () => {
    console.log('Request Again Clicked');
    resend_otp();
  };

  return (
    <div className="container">
      <div className="forms-container">
        <div className="signin-signup">
          <form action="" className="sign-in-form" id="loginForm" onSubmit={handleSignInSubmit}>
            <h2 className="title">Sign In</h2>
            <div className="input-field">
              <i className="fas fa-envelope"></i>
              <input
                type="email"
                id="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="input-field">
              <i className="fas fa-lock"></i>
              <input
                type="password"
                id="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <input type="submit" value="Login" className="btn2 solid" />
          </form>

          <form action="" className="sign-up-form" id="signupForm" onSubmit={handleSignUpSubmit}>
            <h2 className="title">Sign up</h2>
            <div className="input-field">
              <i className="fas fa-envelope"></i>
              <input
                type="email"
                id="signup_email"
                placeholder="Email"
                required
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
              />
            </div>
            <div className="input-field">
              <i className="fas fa-lock"></i>
              <input
                type="password"
                id="signup_password"
                placeholder="Password"
                required
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
              />
            </div>
            <input type="submit" value="Sign up" className="btn solid" />
          </form>
        </div>
      </div>

      <div id="verification-modal" className="modal">
        <div className="modal-content">
          <section className="container-fluid bg-body-tertiary d-block">
            <div className="row justify-content-center">
              <div className="col-12 col-md-6 col-lg-4" style={{ minWidth: '500px' }}>
                <div className="card bg-white mb-5 mt-5 border-0" style={{ boxShadow: '0 12px 15px rgba(0, 0, 0, 0.02)' }}>
                  <div className="card-body p-5 text-center">
                    <h4>Verify</h4>
                    <p>Your code was sent to you via email</p>

                    <div className="otp-email">
                      <i className="fas fa-envelope"></i>
                      <input type="email" id="modal_email" disabled required />
                    </div>

                    <div className="otp-field mb-4">
                      {Array.from({ length: 6 }).map((_, index) => (
                        <input
                          key={index}
                          type="number"
                          className="otp-input"
                          maxLength="1"
                          value={otpValues[index]}
                          onChange={(e) => handleInput(index, e.target.value)}
                          required
                        />
                      ))}
                    </div>
                    <button type="button" id="verify-button" className="btn solid" onClick={handleVerifyClick}>
                      Verify
                    </button>
                    <p className="resend text-muted mb-0">
                      Didn't receive code? <a href="#" id="request-again-link" onClick={handleRequestAgainClick}>
                        Request again
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="panels-container">
        <div className="panel left-panel">
          <div className="content">
            <h3>New user?</h3>
            <p></p>
            <button className="btn transparent" id="sign-up-btn">
              Register
            </button>
          </div>
          <img src={images('./log.svg')} className="image" alt="" />
        </div>

        <div className="panel right-panel">
          <div className="content">
            <h3>Already registered?</h3>
            <p></p>
            <button className="btn transparent" id="sign-in-btn">
              Sign In
            </button>
          </div>
          <img src={images('./log.svg')} className="image" alt="" />
        </div>
      </div>
    </div>
  );
}

export default App;
