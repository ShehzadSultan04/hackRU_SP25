import CalendarComponent from "@/components/CalendarComponent";
import { useState, useEffect } from "react";


const GOOGLE_API_KEY = "AIzaSyCeo1dpg_zeXTKgE9YV2PISBv3brnHf0fk";
const GOOGLE_CALENDAR_ID = "c_d9b7221ec3e541dceff75eabcbddd4c818039c47de0b73dbfcf8f3b05753a04e@group.calendar.google.com";


const Calendar = () => {
    const [events, setEvents] = useState([
        { title: "class 1", start: "2025-02-05T12:00:00", end: "2025-02-05T14:00:00", resourceId: "b", color: "green" }
    ]);

    useEffect(() => {
        const fetchGoogleCalendarEvents = async () => {
            try {
                const response = await fetch(
                    `https://www.googleapis.com/calendar/v3/calendars/${GOOGLE_CALENDAR_ID}/events?key=${GOOGLE_API_KEY}`
                );
                const data = await response.json();
                const googleEvents = data.items.map(event => ({
                    id: event.id,
                    title: event.summary,
                    start: event.start.dateTime || event.start.date,
                    end: event.end?.dateTime || event.end?.date,
                    color: "purple"
                }));
                setEvents(prevEvents => [...prevEvents, ...googleEvents]);
            } catch (error) {
                console.error("Error fetching Google Calendar events:", error);
            }
        };

        fetchGoogleCalendarEvents();
    }, []);


    const addEvent = () => {
        const newEvent = {
            title: "Hello Test",
            start: "2025-02-06T15:50:00",
            end: "2025-02-06T17:10:00",
            color: "orange"
        };
        setEvents([...events, newEvent]); 
    };

    const handleSelect = async (selectInfo) => {
        const title = prompt("Enter Event Title:"); 
        if (title) {
            const newEvent = {
                title: title | "Untitled Event",
                start: selectInfo.startStr,
                end: selectInfo.endStr,
            };
            setEvents([...events, newEvent]); 

            
        }

        // try {
        //     const response = await fetch(
        //         `https://www.googleapis.com/calendar/v3/calendars/${GOOGLE_CALENDAR_ID}/events?key=${GOOGLE_API_KEY}`,
        //         {
        //             method: "POST",
        //             headers: {
        //                 "Content-Type": "application/json",
        //             },
        //             body: JSON.stringify({
        //                 summary: newEvent.title,
        //                 start: { dateTime: newEvent.start, timeZone: "UTC" },
        //                 end: { dateTime: newEvent.end, timeZone: "UTC" },
        //             }),
        //         }
        //     );
    
        //     if (response.ok) {
        //         console.log("Event added to Google Calendar successfully!");
        //     } else {
        //         console.error("Failed to add event to Google Calendar.");
        //     }
        // } catch (error) {
        //     console.error("Error sending event to Google Calendar:", error);
        // }
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
