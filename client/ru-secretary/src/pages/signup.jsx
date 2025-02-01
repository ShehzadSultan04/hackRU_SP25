import React, { useState } from "react";
//sign up with a user name and password
const SignUp = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });
            if (response.ok) {
                history.push("/login");
            } else {
                setError("Sign Up Failed");
            }
        } catch (error) {
            setError("Sign Up Failed");
        }
    };

    return (
        <div style={{ paddingLeft: "20px" }}>
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit}>
                <label className="mb-2">
                    Username:
                    <input
                        type="text"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </label>
                <br />
                <label className="mb-2">
                    Password:
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>
                <br />
                <button className="mb-2" type="submit">
                    Sign Up
                </button>
                {error && <p>{error}</p>}
            </form>
        </div>
    );
};

export default SignUp;
