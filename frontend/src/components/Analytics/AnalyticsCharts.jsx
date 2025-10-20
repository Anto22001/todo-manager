import { Chart } from "react-google-charts";
import "../../styles/Analytics.css";

function AnalyticsCharts({ completed }){
    const chartOptions = {
        title: "Completed Tasks Analytics",
        pieHole: 0.4, 
        is3D: true, 
        pieStartAngle: 100, 
        sliceVisibilityThreshold: 0.02, 
        legend: {
          position: "bottom",
          alignment: "center",
          textStyle: {
            color: "#fff",
            fontSize: 14,
          },
        },
        titleTextStyle: {
            color: "#fff",
        },
        backgroundColor: { fill:'transparent' },
        colors: ["#8AD1C2", "#D18A99"],
    };

    const completedPercentage = Math.round((completed.done / (completed.done + completed.todo)) * 100) || 0;
    return <>
        {completed && <Chart
            className="analytics-chart"
            chartType="PieChart"
            data={[
                ['Task Status', 'Task Completati'],
                ["Done", completed.done || 0],
                ["Todo", completed.todo || 100],
            ]}
            options={chartOptions}
            width={"100%"}
            height={"400px"}
        />}
        <h3 className="font-bold text-sm">
            { completedPercentage > 0 ? 
                `Hai completato il ${completedPercentage}% di impegni, complimenti!🔥` : 
                "Non ci sono progressi da monitorare😞" 
            }
        </h3>
    </>
}

export default AnalyticsCharts;