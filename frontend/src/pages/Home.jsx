import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { LinkButton, AnalyticsCalendar, AnalyticsCharts, AnalyticsNext } from "../components";
import { getAnalytics } from "../services/api";
import { handleError } from "../utils/utils";

function Home(){
    const { user } = useSelector((state) => state.auth);
    const [analytics, setAnalytics] = useState({});

    const loadAnalytics = async() => {
        try {
            const response = await getAnalytics();
            if(response.data?.success){
                setAnalytics(response.data?.data);
            }
        } catch (err) {
            handleError(err);
        }
    }

    useEffect(() => {
        loadAnalytics();
    }, [])

    return <div className="todo-home flex w-full flex-col gap-4">
        <div className="home-intro w-full flex flex-col gap-3">
            <h2 className="text-4xl font-extrabold text-left">Ciao {user.name}🚀✨</h2>
            <p className="text-left text-sm">Benvenut*! In questo sito puoi gestire i tuoi impegni e le tue scadenze senza perderti nulla!</p>
            <p className="text-left text-sm">Nella Home puoi vedere gli analytics delle tue attività. Metticela tutta!🙌</p>
        </div>
        <LinkButton text="Visita e organizza i tuoi impegni" to="/todos"/>
        {Object.keys(analytics).length > 0 && 
        <div className="home-analytics flex flex-col gap-10 w-full">
            <div className="w-full mt-7 pt-10 border-t border-dashed">
                <h2 className="font-bold text-3xl text-left">Analytics📈</h2>
            </div>
            <div className="analytics-completed_todo flex flex-col gap-3 pb-10 border-b">
                <AnalyticsCharts completed={analytics.completed} />
            </div>
            <div className="analytics-calendary pb-10 border-b">
                <AnalyticsCalendar calendary={analytics.calendary}/>
            </div>
            {analytics.next?.length > 0 && 
            <div className="analytics-next_todos pb-10">
                <AnalyticsNext todos={analytics.next}/>
            </div>}
        </div>}
    </div>;
}

export default Home;