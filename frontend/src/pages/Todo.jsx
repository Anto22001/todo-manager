import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GoBackButton, TodoEditingMode, TodoReadingMode } from "../components";
import { deleteTodo, getAllCategories, getTodo, updateTodo } from "../services/api";
import { handleError, priorities } from "../utils/utils";

function Todo(){
    const { id } = useParams();
    const navigate = useNavigate();

    const [todoData, setTodoData] = useState({});
    const [todoToModify, setTodoToModify] = useState({});
    const [categories, setCategories] = useState([]);
    const [readingMode, setReadingMode] = useState(true);

    const category = categories.find(c => c.id === todoData.category_id);
    const priority = priorities.find(p => p.id === todoData.priority);
    const isExpired = todoData?.deadline && new Date().setHours(0,0,0,0) > new Date(todoData.deadline).setHours(0,0,0,0);
    const completedAt = todoData.completed_at ? new Date(todoData.completed_at).toLocaleString() : null;

    const onComplete = async() => {
        try {
            const response = await updateTodo(todoData.id, {
                ...todoData, 
                completed: !todoData.completed, 
                completed_at: new Date()
            });
            if(response.data?.success) {
                setTodoData(prev => ({
                    ...prev, 
                    completed: !prev.completed,
                    completed_at: new Date()
                }));
            }
        } catch (err) {
            handleError(err);
        }
    }

    const onDelete = async() => {
        if(!window.confirm("Are you sure to delete this Todo?")) return;

        try{
            const response = await deleteTodo(todoData.id);
            if(response.data?.success) navigate('/todos');
        } catch(err){
            handleError(err);
        }
    }
    
    const onModify = () => setReadingMode(val => !val);
    
    const onApply = async(e) => {
        e.preventDefault();
        
        const hasChanges = JSON.stringify(todoToModify) !== JSON.stringify(todoData);
        if(!hasChanges) {
            setReadingMode(true);
            return;
        }

        if(!window.confirm("Are you sure to modify this Todo?")) return;
        
        try{
            const response = await updateTodo(id, todoToModify);
            if(response.data?.success) {
                setTodoData({...todoToModify});
                setReadingMode(true);
            }
        } catch(err){
            handleError(err);
        }
    }
    
    const modifyTodo = (data) => {
        setTodoToModify(prev => ({ ...prev, ...data }));
    }
    
    const loadTodoAndCategory = useCallback(async(id) => {
        try {
            const [todoRes, categoriesRes] = await Promise.all([
                getTodo(id),
                getAllCategories()
            ]);

            if(todoRes.data?.success){
                const todo = todoRes.data.data;
                setTodoData(todo);
                setTodoToModify(todo);
            }

            if(categoriesRes.data?.success){
                setCategories(categoriesRes.data.data);
            }
        } catch (err) {
            handleError(err);
        }
    }, [])

    useEffect(() => {
        loadTodoAndCategory(id);  
    }, [id, loadTodoAndCategory])
    
    return <div style={{ maxWidth: "1280px" }} className="flex flex-col justify-between w-full h-full gap-10 p-10">
        <div className="flex w-full pt-6 pb-2 flex-start items-center relative">
            <GoBackButton />
            <div className="todo-site left-0 h-full w-full">
                <h1 className="!text-lg md:!text-2xl">ToDo Manager</h1>
            </div>
        </div>
        {todoData.id && (readingMode ? 
            <TodoReadingMode 
                todoData={todoData}
                category={category}
                priority={priority}
                completedAt={completedAt}
                isExpired={isExpired}
                onComplete={onComplete}
                onDelete={onDelete}
                onModify={onModify}
            /> :
            <TodoEditingMode 
                todoData={todoData}
                categories={categories}
                category={category}
                priorities={priorities}
                priority={priority}
                modifyTodo={modifyTodo}
                onApply={onApply}
                onModify={onModify}
            />
        )}
    </div>
}

export default Todo;