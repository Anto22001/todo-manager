import PriorityIcon from "./PriorityIcon";
import TodoButtons from "./TodoButtons";
import TodoCategory from "./TodoCategory";

function TodoReadingMode({ todoData, category, priority, completedAt, isExpired, onComplete, onDelete, onModify }) {
    return <div className="todo-container flex flex-col justify-start items-start w-full gap-7">
        <div className="todo-secondary_info w-full flex flex-row gap-5 items-center">
            <TodoCategory className="todo-category p-5" category={category} />
            <PriorityIcon priority={priority} dim={80}/>
        </div>
        <div className="todo-title flex justify-start w-full flex-col">
            <h1 className="text-left !font-extrabold">{todoData.title}</h1>
            <p className="text-left mt-2 font-bold text-lg">ID: {todoData.id}</p>
        </div>
        <div className="w-full flex flex-col items-start gap-2">
            <label className="italic">Description:</label>
            <div className="todo-description flex justify-start w-full border rounded-4xl p-5 !h-100">
                <p className="text-left text-lg h-full overflow-auto whitespace-pre-line">{todoData.description}</p>
            </div>
        </div>
        {todoData.completed && 
            <div className="todo-completed flex gap-5 items-center">
                <button 
                    className="todo-complete completed" 
                    onClick={onComplete} 
                    aria-label="Undo task completion"
                />
                <p className="font-extrabold text-lg text-[#39cd3e]">Completed at {completedAt}</p>
            </div>
        }
        {!todoData.completed && todoData.deadline && 
            <div className="todo-deadline">
                <p>Deadline: {new Date(todoData.deadline).toLocaleDateString('sv-SE')}</p>
            </div>
        }
        <TodoButtons 
            mainButton={{ text: "DELETE", handleClick: onDelete, color: "#8c0909", icon: "/trash-white.svg" }} 
            secondaryButton={{ text: "MODIFY", handleClick: onModify, icon: "/modify-white.svg", show: !isExpired }}
        />
    </div>
}

export default TodoReadingMode;