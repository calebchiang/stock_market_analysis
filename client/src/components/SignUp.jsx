import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function SignUp() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:3000/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            if (!response.ok) throw new Error('Signup failed');

            const data = await response.json();
            console.log('Signup successful', data);
            // Here you can handle redirection after successful signup, e.g., navigate to '/signin'
            // using useNavigate from react-router-dom if you want immediate sign in after sign up.
        } catch (error) {
            console.error('Signup error:', error);
            setErrorMessage(error.message || 'Something went wrong');
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email Address</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary w-100">Sign Up</button>
            </form>
            {errorMessage && <div className="alert alert-danger" role="alert">{errorMessage}</div>}
            <div className="text-center mt-3">
                Already have an account? <Link to="/">Sign In</Link>
            </div>
        </div>
    );
}

export default SignUp;
