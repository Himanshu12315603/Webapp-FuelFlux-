

export default function Register({ onSwitch }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, phone, password })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Registration successful!');
      } else {
        setMessage(data.error || 'Registration failed!');
      }
    } catch (err) {
      setMessage('Registration failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-orange-600">Register</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="w-full mb-4 p-2 border border-black rounded focus:outline-orange-500"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full mb-4 p-2 border border-black rounded focus:outline-orange-500"
          required
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          className="w-full mb-4 p-2 border border-black rounded focus:outline-orange-500"
          required
        />
        <div className="relative mb-4">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full p-2 border border-black rounded focus:outline-orange-500"
            required
          />
          <button
            type="button"
            className="absolute right-2 top-2 text-sm text-orange-500"
            onClick={() => setShowPassword(s => !s)}
            tabIndex={-1}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        <button
          type="submit"
          className="w-full bg-black text-orange-500 hover:bg-orange-500 hover:text-black border-2 border-black py-2 rounded font-bold transition"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
        {message && <div className="mt-4 text-center text-orange-600">{message}</div>}
        <div className="mt-4 text-center">
          <span className="text-black">Already have an account? </span>
          <button type="button" className="text-orange-600 hover:underline font-bold" onClick={onSwitch}>Login</button>
        </div>
      </form>
    </div>
  );
}
