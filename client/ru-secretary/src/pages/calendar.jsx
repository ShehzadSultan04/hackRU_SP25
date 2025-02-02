"use client";

import CalendarComponent from "@/components/CalendarComponent";
import { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useSession, signIn, signOut } from "next-auth/react";

const Calendar = () => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");
    const { data: session } = useSession();
    const [events, setEvents] = useState([]);

    useEffect(() => {
        console.log("Events: ", events);
    }, [events]);

    const [departments, setDepartments] = useState([]);
    const [classes, setClasses] = useState([]);

    useEffect(() => {
        if (!session?.accessToken) return;

        const fetchAllCalendars = async () => {
            try {
                const calendarListResponse = await fetch(
                    `https://www.googleapis.com/calendar/v3/users/me/calendarList`,
                    {
                        headers: {
                            Authorization: `Bearer ${session.accessToken}`,
                        },
                    }
                );
                const calendarListData = await calendarListResponse.json();

                if (
                    !calendarListData.items ||
                    calendarListData.items.length === 0
                ) {
                    console.error("No calendars found for this user.");
                    return;
                }

                const allCalendarIds = calendarListData.items.map(
                    (calendar) => calendar.id
                );

                const fetchEventsFromAllCalendars = async () => {
                    let allEvents = [];
                    for (const calendarId of allCalendarIds) {
                        let nextPageToken = null;
                        do {
                            try {
                                const response = await fetch(
                                    `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?maxResults=1000&singleEvents=true&orderBy=startTime${
                                        nextPageToken
                                            ? `&pageToken=${nextPageToken}`
                                            : ""
                                    }`,
                                    {
                                        headers: {
                                            Authorization: `Bearer ${session.accessToken}`,
                                        },
                                    }
                                );
                                const data = await response.json();

                                if (data.items) {
                                    const calendarEvents = data.items
                                        .map((event) => ({
                                            id: event.id,
                                            title:
                                                event.summary ||
                                                "Untitled Event",
                                            start:
                                                event.start?.dateTime ||
                                                event.start?.date ||
                                                null,
                                            end:
                                                event.end?.dateTime ||
                                                event.end?.date ||
                                                event.start?.dateTime ||
                                                event.start?.date ||
                                                null,
                                            color: "purple",
                                            calendarId: calendarId,
                                        }))
                                        .filter(
                                            (event) => event.start !== null
                                        );

                                    allEvents = [
                                        ...allEvents,
                                        ...calendarEvents,
                                    ];
                                }

                                nextPageToken = data.nextPageToken || null;
                            } catch (error) {
                                console.error(
                                    `Error fetching events from calendar ${calendarId}:`,
                                    error
                                );
                                nextPageToken = null;
                            }
                        } while (nextPageToken);
                    }
                    setEvents(allEvents);
                };

                fetchEventsFromAllCalendars();
            } catch (error) {
                console.error("Error fetching user's calendar list:", error);
            }
        };

        fetchAllCalendars();
    }, [session]);

    const addEvent = () => {
        const newEvent = {
            title: "Hello Test",
            start: "2025-02-06T15:50:00",
            end: "2025-02-06T17:10:00",
            color: "orange",
            calendarId: "primary",
        };
        setEvents([...events, newEvent]);

        if (session?.accessToken) {
            try {
                fetch(
                    `https://www.googleapis.com/calendar/v3/calendars/primary/events`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${session.accessToken}`,
                        },
                        body: JSON.stringify({
                            summary: newEvent.title,
                            start: {
                                dateTime: newEvent.start,
                                timeZone: "UTC",
                            },
                            end: { dateTime: newEvent.end, timeZone: "UTC" },
                        }),
                    }
                ).then((response) => {
                    if (response.ok) {
                        console.log(
                            "Event added to Google Calendar successfully!"
                        );
                        alert(
                            `Event "${newEvent.title}" added to Google Calendar!`
                        );
                    } else {
                        console.error(
                            "Failed to add event to Google Calendar."
                        );
                        alert(`Event "${newEvent.title}" failed`);
                    }
                });
            } catch (error) {
                console.error("Error sending event to Google Calendar:", error);
                alert("Error");
            }
        }
    };

    const addClass = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/getDeps");
            const data = await response.json();

            const departmentArray = Object.entries(data).map(
                ([departmentName, departmentCode]) =>
                    `${departmentName}(${departmentCode})`
            );

            setDepartments(departmentArray);
            console.log(departmentArray); // Check the result
        } catch (error) {
            console.error("Error fetching departments:", error);
        }
    };

    const handleSelect = async (selectionInfo) => {
        const title = prompt("Enter Event Title:") || "Untitled Event";
        const newEvent = {
            title,
            start: selectionInfo.startStr,
            end: selectionInfo.endStr,
            calendarId: "primary", // ✅ Ensure new events have a calendar ID
        };

        setEvents((prevEvents) => [...prevEvents, newEvent]);

        if (session?.accessToken) {
            try {
                const response = await fetch(
                    `https://www.googleapis.com/calendar/v3/calendars/primary/events`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${session.accessToken}`,
                        },
                        body: JSON.stringify({
                            summary: newEvent.title,
                            start: {
                                dateTime: newEvent.start,
                                timeZone: "UTC",
                            },
                            end: { dateTime: newEvent.end, timeZone: "UTC" },
                        }),
                    }
                );

                if (response.ok) {
                    console.log("Event added to Google Calendar successfully!");
                    alert(
                        `Event "${newEvent.title}" added to Google Calendar!`
                    );
                } else {
                    console.error("Failed to add event to Google Calendar.");
                    alert(`Event "${newEvent.title}" failed`);
                }
            } catch (error) {
                console.error("Error sending event to Google Calendar:", error);
                alert("Error");
            }
        }
    };

    const fetchClassesForDepartment = async (departmentName) => {
        try {
            // Extract department name only (e.g., "QM" from "QM(123)")
            const depName = departmentName.split("(")[0];

            const response = await fetch(
                "http://127.0.0.1:5000/getClassFromDep",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ dep: depName }),
                }
            );
            const data = await response.json();
            console.log("PRINTING DATA: ", data);

            // Process and set the class information
            const classData = Object.entries(data).map(
                ([className, classInfo]) => {
                    const credits = classInfo[0]; // First number represents credits
                    return {
                        name: className,
                        credits: credits,
                    };
                }
            );

            setClasses(classData);
        } catch (error) {
            console.error("Error fetching classes:", error);
        }
    };

    const handleDepartmentSelect = (departmentName) => {
        setValue(departmentName);
        setOpen(false);
        fetchClassesForDepartment(departmentName);
    };

    const handleEventDelete = async (eventId) => {
        const eventToDelete = events.find((event) => event.id === eventId);

        if (!eventToDelete || !eventToDelete.calendarId) {
            console.error("Calendar ID is missing for event:", eventId);
            alert("Error: Calendar ID is missing. Cannot delete this event.");
            return;
        }

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this event?"
        );
        if (!confirmDelete) return;

        setEvents((prevEvents) =>
            prevEvents.filter((event) => event.id !== eventId)
        );

        if (session?.accessToken) {
            try {
                const response = await fetch(
                    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
                        eventToDelete.calendarId
                    )}/events/${encodeURIComponent(eventId)}`,
                    {
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${session.accessToken}`,
                        },
                    }
                );

                if (response.ok) {
                    console.log(
                        "Event deleted from Google Calendar successfully!"
                    );
                    alert("Event deleted!");
                } else {
                    const errorData = await response.json();
                    console.error(
                        "Failed to delete event from Google Calendar:",
                        errorData
                    );
                    alert(
                        `Failed to delete event: ${errorData.error?.message}`
                    );
                }
            } catch (error) {
                console.error(
                    "Error deleting event from Google Calendar:",
                    error
                );
                alert("Error deleting event.");
            }
        }
    };

    return (
        <div style={{ display: "flex", height: "100vh", width: "100%" }}>
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
                    onClick={addClass}
                >
                    Add Class
                </button>
                <button
                    className="px-4 py-2 text-black rounded-lg bg-green-500 hover:bg-green-700"
                    onClick={addClass}
                >
                    Add Task
                </button>
                <div
                    style={{
                        padding: "1rem",
                        backgroundColor: "white",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        borderRadius: "8px",
                        flexGrow: 1,
                    }}
                >
                    <button
                        className="mb-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-700"
                        onClick={() => (session ? signOut() : signIn("google"))}
                    >
                        {session
                            ? "Disconnect Google Calendar"
                            : "Connect to Google Calendar"}
                    </button>
                    <button
                        className="px-4 py-2 text-black rounded-lg bg-green-500 hover:bg-green-700"
                        onClick={addEvent}
                    >
                        Add Task
                    </button>
                </div>
            </div>

            {/* Departments Dropdown */}
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
                    maxWidth: "320px",
                }}
            >
                {/* Combobox for Departments */}
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-[200px] justify-between"
                        >
                            {value || "Select Department..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        className="w-[200px] p-0"
                        style={{ backgroundColor: "#ffffff", opacity: 1 }}
                    >
                        <Command>
                            <CommandInput placeholder="Search department..." />
                            <CommandList>
                                <CommandEmpty>
                                    No department found.
                                </CommandEmpty>
                                <CommandGroup>
                                    {departments.map((department, index) => (
                                        <CommandItem
                                            key={index}
                                            value={department}
                                            onSelect={() =>
                                                handleDepartmentSelect(
                                                    department
                                                )
                                            }
                                        >
                                            <Check
                                                className={`mr-2 h-4 w-4 ${
                                                    value === department
                                                        ? "opacity-100"
                                                        : "opacity-0"
                                                }`}
                                            />
                                            {department}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>

                {classes.length > 0 ? (
                    classes.map((classItem, index) => (
                        <div
                            key={index}
                            className="p-4 bg-white shadow-md rounded-md flex justify-between items-center"
                        >
                            <span>{classItem.name}</span>
                            <span> {classItem.credits} credits</span>
                        </div>
                    ))
                ) : (
                    <p>No classes available.</p>
                )}
            </div>

            {/* Classes List */}
            {/* <div
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
                    maxWidth: "320px",
                }}
            >
            </div> */}

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
                    handleEventDelete={handleEventDelete}
                />
            </div>
        </div>
    );
};

export default Calendar;
