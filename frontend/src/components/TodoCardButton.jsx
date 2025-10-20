function TodoCardButton({ handleClick }){
    return <div className={`todo-card_content min-h-fit !text-white relative flex flex-col justify-center items-center bg-[#373737] rounded-4xl w-full h-full gap-3`}>
        <button className="todo-card_button w-full h-full !bg-transparent flex justify-center items-center loop-animation" onClick={handleClick}>
            <img src="/plus-white.svg" color="white" alt="Create Todo" />
        </button>
    </div>
}

export default TodoCardButton;