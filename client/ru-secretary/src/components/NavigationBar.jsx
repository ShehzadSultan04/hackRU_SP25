import React from "react";

const NavigationBar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <div className="navbar-header">
                    <a className="navbar-brand" href="#">
                        WebSiteName
                    </a>
                </div>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item active">
                            <a className="nav-link" href="#">
                                Home
                            </a>
                        </li>
                        <li className="nav-item dropdown">
                            <a
                                className="nav-link dropdown-toggle"
                                data-bs-toggle="dropdown"
                                href="#"
                                role="button"
                                aria-expanded="false"
                            >
                                Page 1
                            </a>
                            <ul className="dropdown-menu">
                                <li>
                                    <a className="dropdown-item" href="#">
                                        Page 1-1
                                    </a>
                                </li>
                                <li>
                                    <a className="dropdown-item" href="#">
                                        Page 1-2
                                    </a>
                                </li>
                                <li>
                                    <a className="dropdown-item" href="#">
                                        Page 1-3
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">
                                Page 2
                            </a>
                        </li>
                    </ul>
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <a className="nav-link" href="#">
                                <span className="glyphicon glyphicon-user"></span>{" "}
                                Sign Up
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">
                                <span className="glyphicon glyphicon-log-in"></span>{" "}
                                Login
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default NavigationBar;

{
    /* <Link href="/calendar">
    <span className="text-black text-lg font-semibold hover:text-[#FF6962] cursor-pointer">
        Calendar
    </span>
</Link>; */
}
