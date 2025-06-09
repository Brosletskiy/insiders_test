import type { ReactNode } from 'react';
import Header from './header';

interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <main className="flex flex-1">{children}</main>
        </div>
    );
};

export default Layout;
