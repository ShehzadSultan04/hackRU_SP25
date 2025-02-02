import React, { useState } from "react";
//simple view to login with a username and password
//this view is used to login to the application

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://127.0.0.1:5000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                console.log(await response.json());
            } else {
                const errorText = await response.text();
                setError("Sign Up Failed: " + errorText);
            }
        } catch (error) {
            setError("Error: " + error.message);
        }
    };
    // const getBS = async (e) => {
    //     e.preventDefault();
    //     try {
    //         const response = await fetch("http://127.0.0.1:5000/getDeps");

    //         if (response.ok) {
    //             console.log(await response.json());
    //         } else {
    //             const errorText = await response.text();
    //             setError("Sign Up Failed: " + errorText);
    //         }
    //     } catch (error) {
    //         setError("Error: " + error.message);
    //     }
    // };

    return (
        <div style={{ paddingLeft: "20px" }}>
            <h1>Login</h1>
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
                    Login
                </button>
                {error && <p>{error}</p>}

                {/* <button className="mb-2" onClick={getBS}>
                    {" "}
                    Hello
                </button> */}
            </form>
        </div>
    );
};

export default Login;
