import "../../styles/FilterOption.css";

function FilterOption({ option, onSelect, squared }){
    return <div className="filter-option">
        <button className={`${option.value ? "selected" : ""} ${squared ? "squared" : ""}`} onClick={() => onSelect(option.key)}>
            {option.key}
        </button>
    </div>
}

export default FilterOption;