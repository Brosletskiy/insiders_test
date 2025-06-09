import type { FC } from 'react';

interface SidebarProps {
    searchValue: string;
    onSearchChange: (value: string) => void;
    openModal: () => void;
}

const Sidebar: FC<SidebarProps> = ({ searchValue, onSearchChange, openModal }) => {
    return (
        <aside className="w-full sm:w-1/4 md:w-1/5 lg:w-1/5 bg-white p-4 border-r shadow-md">
            <button
                onClick={openModal}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition mb-4"
            >
                Add todoList
            </button>

            <input
                type="text"
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Пошук за назвою"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </aside>
    );
};

export default Sidebar;