const Dashboard = () => {
    return (
        <div style={{ display: "flex" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
                <button>Button 1</button>
                <button>Button 2</button>
            </div>
            <div style={{ marginLeft: "20px" }}>
                <p>Text View</p>
            </div>
        </div>
    );
};

export default Dashboard;
