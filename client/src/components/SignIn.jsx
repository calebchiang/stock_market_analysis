import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function SignIn() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:3000/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email, password: password }),
            });

            if (!response.ok) throw new Error('Signin failed');

            const data = await response.json();
            console.log('Signin successful', data);
            navigate('/dashboard'); // Redirect to dashboard upon successful sign-in
        } catch (error) {
            console.error('Signin error:', error);
            setErrorMessage(error.message || 'Something went wrong');
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Sign In</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
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
                <button type="submit" className="btn btn-primary w-100">Sign In</button>
            </form>
            {errorMessage && <div className="alert alert-danger" role="alert">{errorMessage}</div>}
            <div className="text-center mt-3">
                Don't have an account? <Link to="/signup">Sign Up</Link>
            </div>
        </div>
    );
}

export default SignIn;
