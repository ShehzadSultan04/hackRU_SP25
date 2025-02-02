import React from "react";

const Sidebar = ({ addEvent, className }) => {
    return (
        <div
            className={`p-4 bg-gray-100 shadow-md rounded-lg flex flex-col space-y-4 h-full ${className}`}
        >
            <button
                style={{ display: "block" }}
                className="px-4 py-2 text-black rounded-lg bg-blue-500 hover:bg-blue-700"
                onClick={addEvent}
            >
                Add Class
            </button>
            <button
                style={{ display: "block" }}
                className="px-4 py-2 text-black rounded-lg bg-green-500 hover:bg-green-700"
                onClick={addEvent}
            >
                Add Event
            </button>
        </div>
    );
};

export default Sidebar;
