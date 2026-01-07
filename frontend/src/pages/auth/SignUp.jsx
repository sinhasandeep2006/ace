import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/AuthLayout";
import Input from "../../components/inputs/Input";

import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import { validateEmail } from "../../utils/helper";
import { UserContext } from "../../context/UserContext";

const SignUp = () => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext);

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!fullname) return setError("Enter full name");
    if (!validateEmail(email)) return setError("Invalid email");
    if (!password) return setError("Enter password");

    try {
      const res = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullname,
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      updateUser(res.data);
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSignup}>
        <Input label="Full Name" value={fullname} onChange={e => setFullname(e.target.value)} />
        <Input label="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button className="btn-primary">Sign Up</button>

        <p className="text-sm">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default SignUp;
