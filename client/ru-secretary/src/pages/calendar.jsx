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
    };

    return (
        <div className="p-4 bg-white shadow-md rounded-lg">
            <h1 className="text-black text-2xl font-bold mb-4">
                Calendar Page
            </h1>
            <CalendarComponent
                events={events}
                setEvents={setEvents}
                handleSelect={handleSelect}
            />
        </div>
    );
};

export default Calendar;
