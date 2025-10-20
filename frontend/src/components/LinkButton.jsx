function LinkButton({ text, to }){
    return <div className="link-button_container mt-5 h-[100px] flex justify-center items-center w-full">
        <a className="w-full py-7 px-5 h-fit !text-white italic border-y rounded-3xl hover:bg-[#29742647] hover:text-xl hover:py-8 duration-300" href={to} target="_self">
            {text}
        </a>
    </div>
}

export default LinkButton;