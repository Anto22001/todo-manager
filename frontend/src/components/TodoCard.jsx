import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TodoCategory from "./TodoCategory";
import PriorityIcon from "./PriorityIcon";
import Tooltip from "./Tooltip";
import { updateTodo } from "../services/api";
import { priorities } from "../utils/utils";
import "../styles/TodoCard.css";

function TodoCard({ t, c, selectable, onSelect, selected }){
    const navigate = useNavigate();
    const [completed, setCompleted] = useState(t?.completed || false);
    const [priority, setPriority] = useState({});
    const [isExpired, setIsExpired] = useState(false);
    const [isSelected, setIsSelected] = useState(selected || false);

    const handleSelectionClick = () => {
        onSelect(t);
        setIsSelected((prev) => !prev);
    }

    const onComplete = (e) => {
        e.stopPropagation();
        
        updateTodo(t.id, {...t, completed: !completed, completed_at: new Date()});
        setCompleted((prev)=>!prev);
    }

    const onCardClick = () => {
        navigate(`/todo/${t.id}`)
    }

    useEffect(() => {
        setIsSelected(selected);
    }, [selected])

    useEffect(()=>{
        if(!t) return;

        setCompleted(t.completed);
        setPriority(priorities.find(p => p.id == t.priority));
        setIsExpired(t?.deadline && new Date().setHours(0,0,0,0) > new Date(t.deadline).setHours(0,0,0,0))
    }, [t])
    
    return <div className="todo-card_container p-7 bg-[#373737] rounded-4xl flex flex-col gap-3 relative">
        { selectable && 
            <>
                <div 
                    className={`todo-completed_overlay absolute z-11 flex justify-center items-center cursor-pointer w-full h-full left-0 top-0 rounded-4xl block hover:border hover:border-[#00ff00] hover:bg-[#489088bf] hover:opacity-50 ${isSelected ? "bg-[#489088bf] selected" :"bg-transparent"}`} 
                    onClick={handleSelectionClick} 
                />
            </>
        }
        <div 
            className={`todo-completed_overlay absolute z-9 flex justify-center items-center cursor-pointer ${completed ? "bg-[#00ff564f]" : "bg-[#ff00564f]"} w-full h-full left-0 top-0 rounded-4xl ${completed || isExpired ? "block" : "hidden"}`} 
            onClick={onCardClick}
        >
            <h2 className={`font-extrabold text-4xl break-all p-5 ${completed ? "text-[#023607]" : "text-[#280e0e]"}`}>{completed ? "COMPLETED" : "EXPIRED"}</h2>
        </div>
        <div className={`todo-card_content min-h-fit justify-between !text-white relative flex flex-col cursor-pointer items-start w-full h-full gap-3`} onClick={onCardClick}>
            <div className="todo-info_main flex flex-col items-start gap-3 w-full">
                <TodoCategory className="todo-category" category={c} />
                <div className="todo-title text-left uppercase font-bold text-xl text-ellipsis">{t.title}</div>
                <div className="todo-description text-left text-lg text-ellipsis">{t.description}</div>
                {!completed && t.deadline && <div className="todo-deadline text-left text-sm italic">Deadline: {new Date(t.deadline).toLocaleDateString('sv-SE')}</div>}
            </div>
            <div className="todo-info_secondary flex flex-col w-full">
                <div className="todo-options flex justify-between items-center w-full gap-3">
                    <PriorityIcon priority={priority} dim={60}/>
                    <Tooltip tooltipText={completed ? "Set as to complete" : "Set as completed"} textColor="white">
                        <button 
                            className={`todo-complete ${completed ? "completed" : ""} disabled:opacity-20 z-10`} 
                            onClick={(e) => onComplete(e)} 
                            aria-label={completed ? "Undo task completion" : "Mark task as complete"} 
                            disabled={isExpired && !completed}
                        />
                    </Tooltip>
                </div>
            </div>
        </div>
    </div>;
}

export default TodoCard;