import NavigationBar from "./NavigationBar";

const Layout = ({ children }) => {
    return (
        <div className="bg-white h-screen w-full">
            <NavigationBar />
            <main className="flex-grow p-6 overflow-auto">
                <div className="w-full flex-grow">{children}</div>
            </main>
        </div>
    );
};

export default Layout;
