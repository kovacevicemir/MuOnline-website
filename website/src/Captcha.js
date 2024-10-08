import React, { useState, useEffect } from "react";

const SimpleCaptcha = ({ setIsCaptchaOk }) => {
  const [captcha, setCaptcha] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Generate a new CAPTCHA when the component mounts
  useEffect(() => {
    generateCaptcha();
  }, []);

  useEffect(() => {
    if(captcha !== ""){
        handleSubmit();
    }
  }, [inputValue])
  

  // Function to generate random CAPTCHA
  const generateCaptcha = () => {
    const randomCaptcha = Math.random().toString(36).substring(2, 8); // 6 characters
    setCaptcha(randomCaptcha);
    setInputValue("");
    setErrorMessage("");
    setIsVerified(false);
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    if (inputValue === captcha && inputValue !== "") {
      setIsVerified(true);
      setErrorMessage("");
      setIsCaptchaOk(true);
    } else {
      setErrorMessage("Incorrect CAPTCHA.");
      setIsCaptchaOk(false);
      setIsVerified(false);
    }
  };

  return (
    <div>
      <div>
        <label>CAPTCHA: </label>
        <strong style={{ fontSize: "20px", letterSpacing: "2px" }}>
          {captcha}
        </strong>
        <button
          type="button"
          onClick={generateCaptcha}
          style={{ marginLeft: "10px" }}
        >
          Refresh
        </button>
      </div>

      <div>
        <label>Enter CAPTCHA: </label>
        <input
          type="text"
          className="text-black"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          required
        />
      </div>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      {isVerified && (
        <p style={{ color: "green" }}>
          You have successfully verified the CAPTCHA!
        </p>
      )}
    </div>
  );
};

export default SimpleCaptcha;
