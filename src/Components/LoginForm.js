// import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import "./LoginForm.css";

// const responseGoogle = (response) => {
//   console.log(response);
// };

const Login = () => {
  return (
    // <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
    <div className="LoginForm-container">
      <h1 className="LoginForm-title-1">My Coffee</h1>
      <h2 className="LoginForm-title-2">로그인</h2>
      <form className="LoginForm-form">
        <input className="LoginForm-input" type="email" placeholder="Email" />
        <input
          className="LoginForm-input"
          type="password"
          placeholder="Password"
        />
        <button className="LoginForm-submit" type="submit">
          Login
        </button>
      </form>
      {/* <div style={{ margin: "20px 0" }}>
          <GoogleLogin
            onSuccess={responseGoogle}
            onError={() => {
              console.log("Login Failed");
            }}
          />
        </div> */}
    </div>
    // </GoogleOAuthProvider>
  );
};

export default Login;
