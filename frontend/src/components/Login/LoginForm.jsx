import { useNavigate } from "react-router-dom";
import { login } from "../../services/authSlice"
import { useDispatch } from "react-redux";
import { login as auth } from "../../services/api";
import validator from "validator";
import { useState } from "react";
import { handleError } from "../../utils/utils";

function LoginForm({ handleShowLogin }){
    let navigate = useNavigate();
    const dispatch = useDispatch();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");

    const onLogin = async (e) => {
        e.preventDefault();

        try{
            const response = await auth(email, password);
            if(response?.data == null || response.data?.data == null){
               throw new Error("Login error. Try again..."); 
            }

            const token = response.data.data;
            dispatch(login({ token }));
            navigate("/");
        }
        catch(err){
            handleError(err);
        }
    }

    const validateEmail = (val) => {
        if(val == "") {
            setEmailError("");
            return;
        }

        if(!validator.isEmail(val)){
            setEmailError("Enter valid Email address!");
            return;
        }

        setEmailError("");
        setEmail(val)
    }

    return <div className="login-container w-[300px] flex justify-center flex-col items-center">
        <h1>Login</h1>
        <form className="login-form flex p-10 flex-col gap-10 w-full" onSubmit={onLogin} method="GET">
            <div className="flex flex-col items-start gap-3">
                <label>Email:</label>
                <input type="email" onChange={(e) => validateEmail(e.target.value)} required/>
                {emailError && <span className="text-sm font-bold text-[#ff0000]">
				    {emailError}
			    </span>}
            </div>
            <div className="flex flex-col items-start gap-3">
                <label>Password:</label>
                <input type="password" onChange={(e) => setPassword(e.target.value)} required/>
            </div>
            <button type="submit">Login</button>
        </form>
        <div className="register-button">
            <button onClick={()=> handleShowLogin(false)}>Non sei ancora registrato?</button>
        </div>
    </div>
}

export default LoginForm;