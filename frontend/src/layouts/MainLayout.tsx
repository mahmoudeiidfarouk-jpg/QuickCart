import type { ReactNode } from "react";import Navbar from "../components/Navbar";

interface MainLayoutProps {
    children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
    return (
        <div className="app">
            <Navbar />

            <main className="main-content">
                {children}
            </main>

            <footer className="footer">
                <p>© 2026 QuickCart. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default MainLayout;