import { useState } from "react";
import { LoginForm, RegisterForm } from "../components";

function Login(){
    const [showLogin, setShowLogin] = useState(true);
    localStorage.removeItem("token");

    return <div className="p-10" style={{ maxWidth: "1280px" }}>
        {showLogin && <LoginForm handleShowLogin={setShowLogin} />}
        {!showLogin && <RegisterForm handleShowLogin={setShowLogin} />}
    </div>;
}

export default Login;