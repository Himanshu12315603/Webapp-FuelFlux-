import React, { useState } from 'react';
import axiosInstance from '../../Utils/axiosInstance';
import { useNavigate, useSearchParams } from 'react-router-dom';

const PhoneVerify = () => {
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const handleSubmit = async () => {
    if (!/^\d{10}$/.test(phone)) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }

    try {
      await axiosInstance.post('/api/users/update-phone', {
        phoneNumber: phone,
        token: token,
      });

      localStorage.setItem('token', token);
      navigate('/video');
    } catch (err) {
      console.error(err);
      alert('Failed to update phone number');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="p-6 border rounded shadow bg-white">
        <h2 className="text-2xl font-bold mb-4">Enter Your Phone Number</h2>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="border p-2 rounded mb-4"
          placeholder="10-digit phone number"
        />
        <button
          onClick={handleSubmit}
          className="bg-orange-500 px-4 py-2 rounded text-white"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default PhoneVerify;
