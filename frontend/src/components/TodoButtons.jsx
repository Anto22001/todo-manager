function TodoButtons({ mainButton, secondaryButton }){
    const color = mainButton?.color || "";

    return <div className="todo-modify_buttons relative bottom-0 flex flex-row gap-10 justify-end w-full">
        {(!Object.hasOwn(secondaryButton, "show") || secondaryButton?.show) && 
            <button className="flex flex-row gap-2 items-center justify-center no-rotate" onClick={secondaryButton?.handleClick}>
                <p>{secondaryButton?.text}</p>
                <img src={secondaryButton?.icon} alt="Secondary Icon"/>
            </button>
        }
        {(!Object.hasOwn(mainButton, "show") || mainButton?.show) && 
            <button className="flex flex-row gap-2 items-center justify-center no-rotate" onClick={(e) => mainButton?.handleClick(e)} style={{ backgroundColor: color }}>
                <p>{mainButton?.text}</p>
                <img src={mainButton?.icon} alt="Main Icon"/>
            </button>
        }
    </div>
}

export default TodoButtons;