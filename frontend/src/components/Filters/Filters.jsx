import { useCallback, useState } from "react";
import AccordionItem from "../AccordionItem";
import TodoButtons from "../TodoButtons";
import FilterOptions from "./FilterOptions";

function Filters({ setShowFilters, filters, onApplyFilters, onClearFilters }){
    const [newFilters, setNewFilters] = useState({ ...filters })

    const onClear = () => {
        setShowFilters(false);
        onClearFilters();
    }

    const onUndo = () => {
        setShowFilters(false);
        setNewFilters({ ...filters })
    }

    const handleOrderBy = useCallback((f) => setNewFilters((prev) => ({ ...prev, orderBy: f })), []);

    const handleFilterBy = useCallback((f, key) => {
        setNewFilters((prev) => {
            const newFilterBy = prev.filterBy.map(el => 
                el.key === key ? { ...el, value: f } : el
            );
            return { ...prev, filterBy: newFilterBy };
        })
    }, [])

    return <div className="filters-container p-10 md:p-7 w-full h-full flex flex-col gap-5 justify-between">
        <div className="filters-header flex flex-row justify-between items-center w-full relative">
            <h2 className="filters-title font-bold text-3xl md:text-lg text-left">Filters</h2>
            <button className="right-0 top-0 !p-1 !bg-transparent absolute h-full flex justify-center h-full flex justify-center" onClick={onUndo}>
                <img src="/close-white.svg" alt="Close Filters"/>
            </button>
        </div>
        <div className="filters-content_container w-full h-full md:overflow-y-scroll overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <div className="filters-content">
                <div className="filters-accordions">
                    {newFilters.orderBy && 
                        <AccordionItem title="Order By">
                            <FilterOptions 
                                optionsData={newFilters.orderBy} 
                                updateOptions={handleOrderBy} 
                                singleSelection 
                            />
                        </AccordionItem>
                    }
                    {newFilters.filterBy && newFilters.filterBy.map(filter => 
                        <AccordionItem key={filter.key} title={filter.key}>
                            <FilterOptions 
                                optionsData={filter.value} 
                                updateOptions={(f) => handleFilterBy(f, filter.key)} 
                                squared 
                            />
                        </AccordionItem>
                    )}
                </div>
            </div>
        </div>
        <div className="filters-button">
            <TodoButtons 
                mainButton={{ text: "APPLY", icon: "/confirm-white.svg", color: "#0e6f0e", handleClick: () => onApplyFilters(newFilters) }} 
                secondaryButton={{ text: "CLEAR", icon: "/trash-white.svg", color: "", handleClick: onClear }}
            />
        </div>
    </div>
}

export default Filters;