import { useState } from 'react';
import  CloseIcon  from '../assets/close-icon.svg';

import { auth } from '../services/api';

interface LoginProps {
    onClose?: () => void;
}

export default function Login({ onClose }: LoginProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(email, password);
        auth.login(email,password)
        
        
    };
    return (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center p-4 ">
            <div className="bg-white rounded-lg max-w-md w-full h-full p-2 relative pt-10 flex flex-col">
                <button 
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 rounded-full bg-gray-200 p-2  "
                >
                    <img src={CloseIcon} className="w-6 h-6" />
                </button>

                <h2 className="text-2xl text-center  font-bold mb-4">Log In</h2>
                
                <p className="text-sm text-gray-500 mb-4 text-center">
                    By continuing, you agree to our{' '}
                    <a href="#" className="text-blue-500">User Agreement</a> and acknowledge that you understand the{' '}
                    <a href="#" className="text-blue-500">Privacy Policy</a>.
                </p>

                <button className="w-full mb-2 border rounded-full py-2 px-4 flex items-center justify-center gap-2 hover:bg-gray-50">
                    <img src="/google-icon.png" alt="Google" className="w-5 h-5" />
                    <span>Google Api to sign in </span>
                </button>

                <button className="w-full mb-4 border rounded-full py-2 px-4 flex items-center justify-center gap-2 hover:bg-gray-50">
                    <img src="/apple-icon.png" alt="Apple" className="w-5 h-5" />
                    <span>Apple api </span>
                </button>

                <div className="text-center text-gray-500 my-2">OR</div>

                <form className="space-y-4 flex-1 flex flex-col"
                onSubmit={handleSubmit}>
                    <div>
                        <input
                            type="text"
                            placeholder="Email or username"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border rounded bg-gray-50"
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border rounded bg-gray-50"
                            required
                        />
                    </div>
                    
                    <div className="text-sm">
                        <a href="#" className="text-blue-500">Forgot password?</a>
                    </div>


                    <div className="text-sm  ">
                        New to Reddit?{' '}
                        <a href="#" className="text-blue-500">Sign Up</a>
                    </div>
                    <div className="flex-1"></div> {/* This pushes the button to bottom */}
                    
                    <button
                        type="submit"
                        className={`w-full py-2 rounded mb-2 ${
                            email && password 
                                ? 'bg-orange-600 text-white active:bg-orange-800' 
                                : 'bg-gray-200 text-gray-500'
                        }`}
                    >
                        Log In
                    </button>
                </form>
            </div>
        </div>
    );
}
