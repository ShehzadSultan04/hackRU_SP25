//simple view to login with a username and password
//this view is used to login to the application

const Login = () => {
    return (
        <div style={{ paddingLeft: "20px" }}>
            <h1>Login</h1>
            <form>
                <label className="mb-2">
                    Username:
                    <input type="text" name="username" />
                </label>
                <br />
                <label className="mb-2">
                    Password:
                    <input type="password" name="password" />
                </label>
                <br />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
