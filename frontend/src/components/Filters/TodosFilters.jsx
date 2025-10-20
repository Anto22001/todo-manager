import { useRef, useState } from "react";
import { useClickOutside, useMediaQuery } from "@react-hooks-library/core";
import Filters from "./Filters";

function TodosFilters({ filters, handleClearFilter, setFiltersToApply }){
    const filterRef = useRef(null);
    const isMobile = useMediaQuery("only screen and (max-width : 768px)");
    const [showFilters, setShowFilters] = useState(false);

    const onApply = (newFilters) => {
        setFiltersToApply(newFilters);
        handleShowFilter(false);
    }

    const handleShowFilter = (show) => {
        if(isMobile){
            document.body.style.overflow = show ? "hidden" : "auto"
        }

        setShowFilters(show);
    }

    useClickOutside(filterRef, () => { if(!isMobile) setShowFilters(false) });

    return <>
        <div className="relative flex items-start md:items-center justify-center">
            <button className="w-[40px] h-[40px] !p-2 no-rotate" onClick={() => handleShowFilter(!showFilters)}>
                <img src="/filter-white.svg" alt="Filter Icon"/>
            </button>
            {showFilters && 
                <div ref={filterRef} className="desktop-filters h-[600px] hidden md:block absolute top-[40px] right-0 z-10 bg-[#4a5553] rounded-2xl">
                    <Filters 
                        setShowFilters={handleShowFilter} 
                        filters={filters} 
                        onApplyFilters={onApply} 
                        onClearFilters={handleClearFilter}
                    />
                </div>
            }
        </div>
        <div className={`mobile-filters md:hidden fixed top-0 left-0 h-screen w-screen bg-[#4a5553] transform z-6 ${showFilters ? "translate-y-0" : "-translate-y-[100%]"} duration-300`}>
            {showFilters && 
                <Filters 
                    setShowFilters={handleShowFilter} 
                    filters={filters} 
                    onApplyFilters={onApply} 
                    onClearFilters={handleClearFilter}
                />
            }
        </div>
    </>
}

export default TodosFilters;