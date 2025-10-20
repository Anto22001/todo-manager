import { useNavigate } from "react-router-dom";
import dayGridPlugin from '@fullcalendar/daygrid';
import FullCalendar from "@fullcalendar/react";
import "../../styles/Analytics.css";

function AnalyticsCalendar({ calendary }){
    const navigate = useNavigate();

    const handleEventClick = (info) => {
      const todoId = info.event.extendedProps.id;
      navigate(`/todo/${todoId}`);
    };

    const customEventContent = (arg) => {
      const isCompleted = arg.event.extendedProps.completed;
      
      return {
        domNodes: [
          (() => {
            const el = document.createElement("div");
            el.className = `text-white text-sm px-1 rounded flex items-center gap-1 overflow-hidden text-ellipsis w-full`;
            el.innerHTML = `${isCompleted ? "✅" : "⏳"} ${arg.event.title}`;
            return el;
          })(),
        ],
      };
    };

    return <FullCalendar 
      initialView="dayGridMonth" 
      plugins={[dayGridPlugin]} 
      dayMaxEvents={3}
      events={calendary} 
      eventClick={handleEventClick}
      eventContent={customEventContent}
    />
}

export default AnalyticsCalendar;