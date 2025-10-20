import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCategories } from "../../services/api";
import { handleError, priorities } from "../../utils/utils";
import "../../styles/Analytics.css";

function AnalyticsNext({ todos }){
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);

    const handleOpenTodo = (id) => {
        navigate(`/todo/${id}`);
    }

    const loadCategories = async() => {
        try {
            const allCategories = await getAllCategories();
            if(allCategories.data?.success){
                const categories = allCategories.data?.data;
                setCategories(categories);
            }
        } catch (err) {
            handleError(err);
        }
    }

    useEffect(() => {
        loadCategories();  
    }, [])

    return <div className="analytics-next_container grid grid-rows-auto">
        <div className="analytics-next_title flex flex-col items-start gap-3 pb-7">
            <h2 className="font-bold text-3xl text-left">Deadline is near⏳</h2>
            <p>I tuoi impegni con la scadenza più vicina sono:</p>
        </div>
        <div className="analytics-next_content flex flex-col items-start pb-7 px-5 w-full">
            <div className="row-header grid grid-cols-5 w-full">
                <div className="analytic-next_header">ID</div>
                <div className="analytic-next_header">Title</div>
                <div className="analytic-next_header">Category</div>
                <div className="analytic-next_header">Priority</div>
                <div className="analytic-next_header">Deadline</div>
            </div>
            {todos.map(t => {
                const category = categories.find(c => c.id == t.category_id);
                const priority = priorities.find(p => p.id == t.priority);

                return <button key={`analytic-next_${t.id}`} className="analytics-next_todo w-full !p-0 !bg-transparent row-header grid grid-cols-5 transform scale-100 hover:text-[#00ff00] hover:scale-102 transition duration-700 ease-in-out" onClick={() => handleOpenTodo(t.id)}>
                    <div className="analytic-next_field">{t.id}</div>
                    <div className="analytic-next_field">{t.title}</div>
                    <div className="analytic-next_field">{category?.title}</div>
                    <div className="analytic-next_field">{priority?.title}</div>
                    <div className="analytic-next_field">{new Date(t.deadline).toLocaleDateString('sv-SE')}</div>
                </button>
            })}
        </div>
    </div>
}

export default AnalyticsNext;