import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import logo from "../../../../assets/sideimg.jpeg";
import "./emaillogin.scss";

const initialState = {
  email: "",
  password: "",
};

const EmailLogin = () => {
  const navigate = useNavigate();
  const [state, setState] = useState(initialState);

  const { email, password } = state;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(state);
    // if ((email, password)) {
    //   localStorage.setItem("nowtoken", true);
    //   navigate("/");
    // }
  };
  return (
    <div className="mainlogin-div">
      <img className="img-container" src={logo} alt="logo " />

      <form onSubmit={handleSubmit} className="login-form">
        <div className="heading">Login</div>
        <div className="button-container">
          <button className="pl-button pl-button--active">Email</button>
          <Link to="/phonelogin" className="navi-button" id="secondary-button">
            Phone Number
          </Link>
        </div>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            className="remove_underline"
            required
            type="email"
            id="email"
            name="email"
            placeholder="enter email"
            value={email}
            onChange={handleInputChange}
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            className="remove_underline"
            required
            type="password"
            id="password"
            name="password"
            placeholder="enter password"
            value={password}
            onChange={handleInputChange}
          />
        </div>
        <Link to="/forgot" className="forget-link">
          {"Forgot Password ?"}
        </Link>

        <div className="input-group">
          <button className="login-btn">Login</button>
        </div>
        <span className="newusertag">New to kundalpur</span>
        <Link to="/register" className="creatbtn">
          Create Account
        </Link>
      </form>
    </div>
  );
};

export default EmailLogin;
