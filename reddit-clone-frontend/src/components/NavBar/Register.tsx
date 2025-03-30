import { useState } from 'react';
import CloseIcon from '../../assets/close-icon.svg';
import { auth } from '../../services/api';
import { useUser } from '../../context/UserContext';

interface RegisterProps {
  onClose?: () => void;
  onSwitch?: () => void;
}

export default function Register({ onClose, onSwitch }: RegisterProps) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { fetchUser } = useUser();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      console.log("Registering with:", {
        email: email.trim(),
        username: username.trim(),
        password,
      });
      await auth.register(username.trim(),email.trim(),password.trim());
      console.log("Register successful");
      await fetchUser();
      onClose?.();
    } catch (error) {
      console.error("Registration failed", error);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full h-full p-2 relative pt-10 flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 rounded-full bg-gray-200 p-2"
        >
          <img src={CloseIcon} className="w-6 h-6" />
        </button>

        <h2 className="text-2xl text-center font-bold mb-4">Sign Up</h2>

        <form className="space-y-4 flex-1 flex flex-col" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded bg-gray-50"
            required
          />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border rounded bg-gray-50"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded bg-gray-50"
            required
          />

          <div className="text-sm">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onSwitch}
              className="text-blue-500 underline"
            >
              Log In
            </button>
          </div>

          <button
            type="submit"
            className={`w-full py-2 rounded mb-2 ${
              email && password && username
                ? 'bg-green-600 text-white active:bg-green-800'
                : 'bg-gray-200 text-gray-500'
            }`}
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
