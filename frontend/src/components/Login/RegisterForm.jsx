import { useState } from "react";
import { register } from "../../services/api";
import validator from "validator";
import { handleError } from "../../utils/utils";

function RegisterForm({ handleShowLogin }){
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passError, setPassError] = useState("");

    const validateEmail = (value) => {
        if(value == "") {
            setEmailError("");
            return;
        }

        if(!validator.isEmail(value)){
			setEmailError("Enter valid Email address!");
            return;
        }

        setEmailError("");
        setEmail(value)
    }

    const validatePassword = (value) => {
        if(value == ""){
            setPassError("");
            return;
        }

        if (!validator.isStrongPassword(value, {
            minLength: 8, minLowercase: 1,
            minUppercase: 1, minNumbers: 1, minSymbols: 1
        })) {
            setPassError('Your password must be at least 8 characters long, with at least one uppercase letter, one lowercase letter, one number, and one symbol.');
            return;
        }

        setPassError("");
        setPassword(value)
    }

    const onRegister = async (e) => {
        e.preventDefault();

        try{
            const registration = await register(name, surname, email, password);
            if(registration.data?.success)
                handleShowLogin(true);
        }
        catch(err){
            handleError(err);
        }
    }
    
    return <div className="register-container w-[300px] flex justify-center flex-col items-center">
        <h1>Register</h1>
        <form className="login-form flex p-10 flex-col gap-10 w-full" onSubmit={onRegister} method="GET">
            <div className="flex flex-col items-start gap-3">
                <label>Name:</label>
                <input type="text" onChange={(e) => setName(e.target.value)} required/>
            </div>
            <div className="flex flex-col items-start gap-3">
                <label>Surname:</label>
                <input type="text" onChange={(e) => setSurname(e.target.value)} required/>
            </div>
            <div className="flex flex-col items-start gap-3">
                <label>Email:</label>
                <input type="email" onChange={(e) => validateEmail(e.target.value)} required/>
                {emailError && <span className="!text-sm font-bold text-[#f43b3b]">
				    {emailError}
			    </span>}
            </div>
            <div className="flex flex-col items-start gap-3">
                <label>Password:</label>
                <input type="password" onChange={(e) => validatePassword(e.target.value)} required/>
                {passError && <span className="!text-sm font-bold text-[#f43b3b]">
				    {passError}
			    </span>}
            </div>
            <button type="submit">Register</button>
        </form>
        <div className="login-button">
            <button onClick={()=> handleShowLogin(true)}>{"<- Torna al login"}</button>
        </div>
    </div>
}

export default RegisterForm;