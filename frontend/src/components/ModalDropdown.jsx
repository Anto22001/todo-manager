import { useRef, useState } from "react";
import { useClickOutside } from "@react-hooks-library/core";

function ModalDropdown({ items, onValueChange, currentOption = null }){
    const [activeOption, setActiveOption] = useState(currentOption || items[0]);
    const [showDropdown, setShowDropdown] = useState(false);
    
    const handleOptionChange = (e, el) => {
        e.preventDefault();
        handleShowDropdown(false);

        if(el.id == activeOption.id) return;

        setActiveOption(el);
        onValueChange(el.id);
    }

    const handleShowDropdown = (show = null) => {
        if(show != null){
          setShowDropdown(show);
          return;  
        } 

        setShowDropdown(prev => !prev);
    } 

    const ref = useRef(null);
    useClickOutside(ref, () => handleShowDropdown(false));

    return <div ref={ref} className="dropdown relative w-full">
        <button 
            className="active-option w-full" 
            onClick={(e) => { 
                e.preventDefault(); 
                handleShowDropdown() 
            }}
        >
            {activeOption.title}
        </button>
        {showDropdown && 
            <div className="w-full bg-[#3030149e] rounded-4xl dropdown-options flex flex-col gap-3 absolute top-full left-0 z-50">
                {items.map(i => 
                    <button 
                        key={`option-${i.id}`} 
                        className={`w-full ${i.id == activeOption.id && "!bg-[#4f4f4f] !cursor-default"}`} 
                        onClick={(e) => handleOptionChange(e, i)}
                    >
                        {i.title}
                    </button>
                )}
            </div>
        }
    </div>
}

export default ModalDropdown;