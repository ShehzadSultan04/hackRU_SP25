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

const GOOGLE_API_KEY = "AIzaSyCeo1dpg_zeXTKgE9YV2PISBv3brnHf0fk";
const GOOGLE_CALENDAR_ID =
    "c_d9b7221ec3e541dceff75eabcbddd4c818039c47de0b73dbfcf8f3b05753a04e@group.calendar.google.com";

const Calendar = () => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");
    const [events, setEvents] = useState([
        {
            title: "class 1",
            start: "2025-02-05T12:00:00",
            end: "2025-02-05T14:00:00",
            resourceId: "b",
            color: "green",
        },
    ]);

    const [departments, setDepartments] = useState([]);
    const [classes, setClasses] = useState([]);

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
        };

        setEvents((prevEvents) => [...prevEvents, newEvent]);
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
                ([className, credits]) => ({
                    name: className,
                    credits: credits,
                })
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
                    onClick={addClass}
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
                />
            </div>
        </div>
    );
};

export default Calendar;
