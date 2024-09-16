import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import Register from './Register'

const Login = () => {
  const {setUser} = useContext(AuthContext)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full p-2 border border-gray-300 rounded"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            className="w-full p-2 border border-gray-300 rounded"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">

            Login
          </button>
          { <span className='flex justify-center'  > if already registered login here ? </span> }
        </form>
      </div>
      <div className = "ml-5" >
      <Register/>
      </div>
    </div>
  );
};

export default Login;
