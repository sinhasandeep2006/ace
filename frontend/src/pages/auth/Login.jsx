import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/AuthLayout";
import Input from "../../components/inputs/Input";

import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import { UserContext } from "../../context/UserContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      updateUser(res.data);
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleLogin}>
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Input label="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />

        <button className="btn-primary">Login</button>
        <div>  </div>
        <div>  </div>
        <p className="text-sm  text-white">
          Don’t have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;
