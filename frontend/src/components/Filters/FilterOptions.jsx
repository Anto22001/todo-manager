import { useEffect, useState } from "react";
import FilterOption from "./FilterOption";

function FilterOptions({ optionsData, updateOptions, singleSelection = false }){
    const [options, setOptions] = useState(optionsData);

    useEffect(() => {
        setOptions(optionsData);
    }, [optionsData]);

    useEffect(() => {
        updateOptions(options);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [options]);

    const handleSelect = (key) => {
        setOptions((prev) => 
            prev.map((opt) => {
                if (singleSelection) {
                    return { ...opt, value: opt.key === key };
                }
                return opt.key === key ? { ...opt, value: !opt.value } : opt;
            })
        );
    }

    return <>
        {options.map(o => 
            <FilterOption 
                key={o.key} 
                option={o} 
                onSelect={handleSelect} 
                squared={!singleSelection} 
            />
        )}
    </>
}

export default FilterOptions;