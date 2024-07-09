// src/Login.js
import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const responseGoogle = (response) => {
  console.log(response);
};

const Login = () => {
  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <h2>Login Page</h2>
        <form
          style={{ display: "flex", flexDirection: "column", width: "300px" }}
        >
          <input
            type="email"
            placeholder="Email"
            style={{ margin: "10px 0", padding: "10px", fontSize: "16px" }}
          />
          <input
            type="password"
            placeholder="Password"
            style={{ margin: "10px 0", padding: "10px", fontSize: "16px" }}
          />
          <button
            type="submit"
            style={{ padding: "10px", fontSize: "16px", cursor: "pointer" }}
          >
            Login
          </button>
        </form>
        <div style={{ margin: "20px 0" }}>
          <GoogleLogin
            onSuccess={responseGoogle}
            onError={() => {
              console.log("Login Failed");
            }}
          />
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
