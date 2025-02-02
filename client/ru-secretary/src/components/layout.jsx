import NavigationBar from "./NavigationBar";

const Layout = ({ children }) => {
    return (
        <div className="bg-white h-screen w-full flex flex-col">
            <NavigationBar />
            <main className="flex flex-grow p-6 overflow-auto">{children}</main>
        </div>
    );
};

export default Layout;
