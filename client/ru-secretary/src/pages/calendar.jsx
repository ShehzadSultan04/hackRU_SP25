import CalendarComponent from "@/components/CalendarComponent";
import { useState } from "react";

const Calendar = () => {
    const [events, setEvents] = useState([
        {
            title: "class 1",
            start: "2025-02-05T12:00:00",
            end: "2025-02-05T14:00:00",
            resourceId: "b",
            color: "green",
        },
    ]);

    return (
        <div className="flex h-screen w-full">
            {/* Sidebar */}
            <div className="w-1/4 p-4 bg-gray-100 shadow-md rounded-lg flex flex-col space-y-4">
                <button className="px-4 py-2 text-black rounded-lg bg-blue-500 hover:bg-blue-700">
                    Add Class
                </button>
                <button className="px-4 py-2 text-black rounded-lg bg-green-500 hover:bg-green-700">
                    Add Task
                </button>
            </div>

            {/* Calendar */}
            {/* <div className="w-3/4 p-4 bg-white shadow-md rounded-lg">
                <CalendarComponent events={events} setEvents={setEvents} />
            </div> */}
        </div>
    );
};

export default Calendar;
