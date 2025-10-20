import Tooltip from "./Tooltip";

function PriorityIcon({ priority, dim }){
    return <Tooltip textColor={priority?.color} tooltipText={priority?.title}>
        <div className="todo-priority">
            <img width={dim} height={dim} src={priority?.icon} alt="Priority Icon" />
        </div>
    </Tooltip>
}

export default PriorityIcon;