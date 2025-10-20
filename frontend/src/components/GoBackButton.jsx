import { useNavigate } from "react-router-dom";

function GoBackButton(){
    const navigate = useNavigate();
    
    const handleGoBack = () => {
        navigate(-1);
    }

    return <div className="goBack-btn flex flex-start">
        <button className="no-rotate !rounded-full flex w-[40px] h-[40px] !p-2" onClick={handleGoBack}>
            <img className="w-full h-full" src="/goBack-white.svg" alt="Go Back"/>
        </button>
    </div>
}

export default GoBackButton;