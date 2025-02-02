import CalendarComponent from "@/components/CalendarComponent";
import { useState } from "react";


const Calendar = () => {
    const [events, setEvents] = useState([
        { title: "class 1", start: "2025-02-05T12:00:00", end: "2025-02-05T14:00:00", resourceId: "b", color: "green" }
    ]);

    const addEvent = () => {
        const newEvent = {
            title: "Hello Test",
            start: "2025-02-06T15:50:00",
            end: "2025-02-06T17:10:00",
            color: "orange"
        };
        setEvents([...events, newEvent]); 
    };

    const handleSelect = (selectInfo) => {
        const title = prompt("Enter Event Title:"); 
        if (title) {
            const newEvent = {
                title,
                start: selectInfo.startStr,
                end: selectInfo.endStr,
            };
            setEvents([...events, newEvent]); 
        }
    }

    return (
        <div className="p-4 bg-white shadow-md rounded-lg">
            <h1 className="text-black text-2xl font-bold mb-4">Calendar Page</h1>
            <button 
                onClick={addEvent} 
                className="mb-4 px-4 py-2 text-black rounded-lg">
                Add Event
            </button>
            <CalendarComponent
                events={events}
                handleSelect={handleSelect}
            />
        </div>
    );
};

export default Calendar;