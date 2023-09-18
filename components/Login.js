import React, { useState } from "react";
import { setCookie } from "nookies";

const Login = ({ onSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = () => {
    if (username === "jmadmin" && password === "Jmadmin123#") {
      // Set a cookie named "isLoggedIn" with value "true"
      setCookie(null, "isLoggedIn", "true", { maxAge: 120 }); // Expires in 5 minutes
      onSuccess();
    } else {
      setErrorMessage("Invalid username or password");
    }
  };

  return (
    <>
      <div className="bg-black flex flex-col items-center justify-center h-screen">
        <img
          src="/logo 1.svg"
          alt="Logo"
          className=" mb-6"
          style={{ width: "25%" }}
        />
        <img
          src="/jmlogosmall.png"
          alt="Logo"
          className=" mb-6"
          style={{ width: "25%" }}
        />
        <form className="text-center">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="px-4 py-2 w-64 bg-black border focus:border-white"
              style={{ border: "2px solid #171717" }}
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-2 w-64 bg-black border focus:border-white "
              style={{ border: "2px solid #171717" }}
            />
          </div>
          <button
            onClick={handleLogin}
            className=" text-white px-8 py-2 cursor-pointer"
            style={{ background: "#1d1d1d" }}
          >
            Sign In
          </button>
        </form>

        {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
      </div>
    </>
  );
};

export default Login;
