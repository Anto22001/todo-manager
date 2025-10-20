import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useClickOutside } from "@react-hooks-library/core";
import { logout } from "../services/authSlice";

function Sidebar(){
    const ref = useRef();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showSidebar, setShowSidebar] = useState(false);

    const onLogout = () => {
        dispatch(logout());
        navigate("/login");
    }
    
    const toggleShowSidebar = () => setShowSidebar((prev) => !prev)
    useClickOutside(ref, () => {
        if(showSidebar) toggleShowSidebar();
    });
    
    const sidebarNavLinkClass = "sidebar-nav_link !text-black text-xl hover:!text-[#00ff99] hover:text-2xl focus:text-lg border-b py-5 !font-bold";
    return <>
        <div className="flex w-full pt-6 pb-2 items-start flex-col-reverse md:flex-row md:items-center relative gap-5">
            <button onClick={toggleShowSidebar}>
                <img src="/hamburger-white.svg" alt="Open Sidebar"/>
            </button>
            <div className="todo-site left-0 h-full w-full">
                <h1 className="!text-lg md:!text-2xl flex items-center justify-center"><img style={{ maxHeight: "100px" }} src="/logo.svg" alt="ToDo Manager"/></h1>
            </div>
        </div>
        <div className={`sidebar-container ${showSidebar ? "bg-[#0000005e] pointer-events-auto" : "bg-transparent pointer-events-none"} duration-300 fixed top-0 left-0 w-full h-full z-80`}>
            <nav ref={ref} className={`flex flex-col gap-3 py-7 px-5 bg-white h-full w-full md:w-[30%] ${showSidebar ? "translate-x-0" : "-translate-x-200"} duration-300`}>
                <div className="relative h-[30px] w-full">
                    <button className="right-0 top-0 !p-1 !bg-transparent absolute h-full flex justify-center" onClick={toggleShowSidebar}>
                        <img src="/close-black.svg" alt="Close Sidebar" />
                    </button>
                </div>
                <Link className={sidebarNavLinkClass} to="/" onClick={toggleShowSidebar}>Home</Link>
                <Link className={sidebarNavLinkClass} to="/todos" onClick={toggleShowSidebar}>Todos</Link>
                <div className="absolute bottom-[20px] right-[20px]">
                    <button className="flex gap-2 no-rotate" onClick={onLogout}>
                        <p className="hidden md:block">Logout</p>
                        <img src="/logout-white.svg" alt="Logout"/>
                    </button>
                </div>
            </nav>
        </div>
    </>
}

export default Sidebar;