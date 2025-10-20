import { useRef, useState } from "react";

function AccordionItem({title, children}){
    const contentRef = useRef();
    const [isOpen, setIsOpen] = useState(false);

    return <div className="accordion-container text-left w-full border-b">
        <div className="accordion-header w-full">
            <button className="accordion-button !py-5 !px-0 w-full !bg-transparent transform" onClick={() => setIsOpen(prev => !prev)}>
                <h2 className="font-bold text-xl text-left">{title}</h2>
            </button>
        </div>
        <div 
            ref={contentRef} 
            className={`accordion-content overflow-hidden transition-all flex flex-col duration-400 ease-out w-full`} 
            style={{ maxHeight: isOpen ? `${contentRef.current.scrollHeight}px` : "0px" }}
        >
            {children}
        </div>
    </div>
}

export default AccordionItem;