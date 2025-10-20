import { useRef, useState } from "react";
import { useClickOutside } from '@react-hooks-library/core';
import ModalDropdown from "./ModalDropdown";
import { createTodo } from "../services/api";
import { handleError, priorities } from "../utils/utils";
import "../styles/TodoModal.css";

function TodoModal({ categories, handleShowModal, handleOnCreation }){
    const [todo, setTodo] = useState({category: categories[0].id, priority: priorities[0].id });
    
    const ref = useRef(null);
    useClickOutside(ref, () => handleShowModal(false));

    const handleTodoCreation = async (e) => {
        e.preventDefault();

        try {
           const newTodo = await createTodo(todo); 
           if(newTodo.data?.success) handleOnCreation(newTodo.data?.data);
        } catch (err) {
            handleError(err);
        }

        handleShowModal(false);
    }

    const updateTodo = (data) => {
        setTodo((prev) => ({ ...prev, ...data }));
    }

    return <div className="todo-modal bg-black/70 fixed top-0 left-0 z-100 w-full h-full flex justify-center items-center">
        <div ref={ref} className="todo-modal_content flex flex-col bg-[#373737] p-10 pt-5 rounded-4xl gap-5 m-5 w-full xs:w-[80%] md:w-[60%] lg:w-[600px] max-h-[90vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <div onClick={() => handleShowModal(false)} className="cursor-pointer items-center modal-close w-full flex justify-between">
                <h1>Todo Modal</h1>
                <button className="l-0 !px-0 !bg-transparent">
                    <img src="close-white.svg" alt="Close Modal"/>
                </button>
            </div>
            <form className="flex flex-col gap-7 w-full" onSubmit={handleTodoCreation} method="POST">
                <div className="todo-title field">
                    <label>Title</label>
                    <input 
                        id="todo-title" 
                        type="text" 
                        onChange={(e) => updateTodo({title: e.target.value})}
                        required 
                    />
                </div>
                <div className="todo-description field">
                    <label>Description</label>
                    <textarea 
                        id="todo-description" 
                        type="text" 
                        className="!h-60 w-full border border-solid border-white rounded-xl p-3" 
                        onChange={(e) => updateTodo({description: e.target.value})}
                        required 
                    />
                </div>
                <div className="todo-deadline field">
                    <label>Deadline</label>
                    <input 
                        id="todo-deadline" 
                        type="date" 
                        onChange={(e) => updateTodo({deadline: e.target.value || null})}
                    />
                </div>
                <div className="todo-priority field">
                    <label>Priority</label>
                    <ModalDropdown 
                        items={priorities} 
                        onValueChange={(id) => updateTodo({priority: id})} 
                    />
                </div>
                <div className="todo-category field">
                    <label>Category</label>
                    <ModalDropdown 
                        items={categories} 
                        onValueChange={(id) => updateTodo({category: id})} 
                    />
                </div>
                <button type="submit">Create</button>
            </form>
        </div>
    </div>
}

export default TodoModal;