import "../styles/Tooltip.css";

function Tooltip({ tooltipText, textColor, children }){
    return <div className="tooltip">
        <span className="tooltiptext font-bold" style={{ color: textColor }}>{tooltipText}</span>
        {children}
    </div>
}

export default Tooltip;