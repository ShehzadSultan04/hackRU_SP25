import Image from "next/image";
import { useState } from "react";

export default function Directions() {
    const [index1, setIndex1] = useState("");
    const [index2, setIndex2] = useState("");
    const [mapUrl, setMapUrl] = useState(null); // Store map URL

    const handleSubmit = async () => {
        if (!index1 || !index2) {
            alert("Please enter both class indexes.");
            return;
        }

        const requestBody = {
            index1: parseInt(index1, 10),
            index2: parseInt(index2, 10),
        };

        try {
            const response = await fetch("http://127.0.0.1:5000/map", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Response:", data);
                console.log("Map URL:", data.mapurl);
                setMapUrl(data.mapurl);
            } else {
                console.error("Error:", response.statusText);
                alert("Failed to get directions.");
            }
        } catch (error) {
            console.error("Error sending request:", error);
            alert("An error occurred.");
        }
    };

    return (
        <div
            style={{ padding: "1rem" }}
            className="flex flex-col items-center justify-center min-h-screen bg-white"
        >
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
                Directions
            </h1>

            {mapUrl ? (
                <Image
                    src={mapUrl}
                    alt="Generated Map"
                    className="w-full max-w-3xl rounded-lg shadow-lg mb-6"
                    width={400}
                    height={400}
                />
            ) : (
                <p className="text-gray-500 mb-6 ">
                    Enter class indexes to generate a map.
                </p>
            )}

            <div className="mb-4 w-80 p-6">
                <label className="block text-gray-700 font-semibold mb-2">
                    Index of First Class
                </label>
                <input
                    type="number"
                    value={index1}
                    onChange={(e) => setIndex1(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                    placeholder="Enter first class index"
                />
            </div>

            <div className="mb-4 w-80">
                <label className="block text-gray-700 font-semibold mb-2">
                    Index of Second Class
                </label>
                <input
                    type="number"
                    value={index2}
                    onChange={(e) => setIndex2(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                    placeholder="Enter second class index"
                />
            </div>

            <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-800 transition duration-200"
            >
                Submit
            </button>
        </div>
    );
}
