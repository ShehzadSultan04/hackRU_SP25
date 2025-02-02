import CalendarComponent from "@/components/CalendarComponent";
import { useState, useEffect } from "react";

const GOOGLE_API_KEY = "AIzaSyCeo1dpg_zeXTKgE9YV2PISBv3brnHf0fk";
const GOOGLE_CALENDAR_ID =
    "c_d9b7221ec3e541dceff75eabcbddd4c818039c47de0b73dbfcf8f3b05753a04e@group.calendar.google.com";

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

    useEffect(() => {
        const fetchGoogleCalendarEvents = async () => {
            try {
                const response = await fetch(
                    `https://www.googleapis.com/calendar/v3/calendars/${GOOGLE_CALENDAR_ID}/events?key=${GOOGLE_API_KEY}`
                );
                const data = await response.json();
                const googleEvents = data.items.map((event) => ({
                    id: event.id,
                    title: event.summary,
                    start: event.start.dateTime || event.start.date,
                    end: event.end?.dateTime || event.end?.date,
                    color: "purple",
                }));
                setEvents((prevEvents) => [...prevEvents, ...googleEvents]);
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
            color: "orange",
        };
        setEvents([...events, newEvent]);
    };

    const handleSelect = async (selectionInfo) => {
        const title = prompt("Enter Event Title:") || "Untitled Event"; //try {
        const newEvent = {
            title,
            start: selectionInfo.startStr,
            end: selectionInfo.endStr,
        };

        setEvents((prevEvents) => [...prevEvents, newEvent]);
        //     const response = await fetch(
        //         `https: www.googleapis.com/calendar/v3/calendars/${GOOGLE_CALENDAR_ID}/events?key=${GOOGLE_API_KEY}`,
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
        //         alert(`Event "${newEvent.title}" added to Google Calendar!`);
        //     } else {
        //         console.error("Failed to add event to Google Calendar.");
        //         alert(`Event "${newEvent.title}" failed `);
        //     }
        // } catch (error) {
        //     console.error("Error sending event to Google Calendar:", error);
        //     alert(`Error`);
        // }
    };
    return (
        <div style={{ display: "flex", height: "100vh", width: "100%" }}>
            {/* Sidebar */}
            <div
                style={{
                    padding: "1rem",
                    backgroundColor: "#f3f4f6",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    borderRadius: "8px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                    height: "100%",
                    width: "25%",
                    minWidth: "100px",
                    maxWidth: "150px",
                }}
            >
                <button
                    className="px-4 py-2 text-black rounded-lg bg-blue-500 hover:bg-blue-700"
                    onClick={addEvent}
                    style={{ display: "flex", flexDirection: "column" }}
                >
                    Add Class
                </button>
                <button
                    className="px-4 py-2 text-black rounded-lg bg-green-500 hover:bg-green-700"
                    onClick={addEvent}
                >
                    Add Task
                </button>
            </div>
            <div
                style={{
                    padding: "1rem",
                    backgroundColor: "#f3f4f6",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    borderRadius: "8px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                    height: "100%",
                    width: "25%",
                    minWidth: "100px",
                    maxWidth: "250px",
                }}
            ></div>

            {/* Calendar */}
            <div
                style={{
                    padding: "1rem",
                    backgroundColor: "white",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    borderRadius: "8px",
                    flexGrow: 1,
                }}
            >
                <CalendarComponent
                    events={events}
                    setEvents={setEvents}
                    handleSelect={handleSelect}
                />
            </div>
        </div>
    );
};

export default Calendar;
