import { useState } from "react";
import ModalDropdown from "./ModalDropdown";
import TodoButtons from "./TodoButtons";

function TodoEditingMode({ todoData, categories, category, priorities, priority, modifyTodo, onApply, onModify }) {
    const [completed, setCompleted] = useState(todoData.completed);

    const handleCompletedToggle = () => {
        const newCompleted = !completed;
        setCompleted(newCompleted);
        modifyTodo({ completed: newCompleted, completed_at: newCompleted ? new Date() : null });
    };

    return <form className="todo-modify_form flex flex-col gap-5 items-start justify-start" method="PUT">
        <div className="todo-dropdowns flex justify-between w-full">
            <div className="todo-category field">
                <label>Category</label>
                <ModalDropdown 
                    items={categories} 
                    currentOption={category} 
                    onValueChange={(id) => modifyTodo({category_id: id})} 
                />
            </div>
            <div className="todo-priority field">
                <label>Priority</label>
                <ModalDropdown 
                    items={priorities} 
                    currentOption={priority}
                    onValueChange={(id) => modifyTodo({priority: id})} 
                />
            </div>
        </div>
        <div className="todo-title field items-center !flex-col">
            <label>Title</label>
            <input 
                id="todo-title" 
                type="text" 
                className="w-full" 
                defaultValue={todoData.title} 
                onChange={(e) => modifyTodo({title: e.target.value})}
                required 
            />
        </div>
        <div className="todo-description field !flex-col h-100">
            <label>Description</label>
            <textarea 
                id="todo-description" 
                className="!h-100 border border-solid border-white rounded-xl p-3" 
                defaultValue={todoData.description} 
                onChange={(e) => modifyTodo({description: e.target.value})}
                required 
            />
        </div>
        <div className="todo-deadline field">
            <label>Deadline</label>
            <input 
                id="todo-deadline" 
                type="date" 
                defaultValue={todoData.deadline ? new Date(todoData.deadline).toLocaleDateString('sv-SE') : ''} 
                onChange={(e) => modifyTodo({deadline: e.target.value || null})}
            />
        </div>
        <div className="todo-completed field w-full flex cursor-pointer justify-start items-center gap-3" onClick={handleCompletedToggle}>
            <button 
                id="todo-completed" 
                type="button" 
                className={`todo-complete ${completed ? "completed" : ""}`} 
                aria-label={completed ? "Undo task completion" : "Mark task as complete"}
            />
            <label className={`${completed ? "text-[#2b632d]" : "text-white"} cursor-pointer`}>Set as completed</label>
        </div>
        <TodoButtons 
            mainButton={{ text: "APPLY", handleClick: onApply, color: "#0e6f0e", icon: "/confirm-white.svg" }} 
            secondaryButton={{ text: "UNDO", handleClick: onModify, icon: "/undo-white.svg" }}
        />
    </form>
}

export default TodoEditingMode;