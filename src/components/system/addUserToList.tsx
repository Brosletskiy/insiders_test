import React, { useEffect, useState } from 'react';
import type { User } from '../../types';
import { getAllUsers } from '../../firebase/userService';

interface AddUserToListProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (user: User) => void;
}

const AddUserToList: React.FC<AddUserToListProps> = ({ isOpen, onClose, onAdd }) => {
    const [email, setEmail] = useState('');
    const [users, setUsers] = useState<User[]>([]);
    const [filtered, setFiltered] = useState<User[]>([]);

    useEffect(() => {
        if (!isOpen) return;
        const fetchUsers = async () => {
            const data = await getAllUsers();
            setUsers(data);
        };
        fetchUsers();
    }, [isOpen]);

    useEffect(() => {
        const trimmed = email.trim().toLowerCase();
        if (trimmed.length < 2) {
            setFiltered([]);
        } else {
            const matches = users.filter(user =>
                user.email.toLowerCase().includes(trimmed)
            );
            setFiltered(matches);
        }
    }, [email, users]);

    const handleSelect = (user: User) => {
        onAdd(user);
        setEmail('');
        setFiltered([]);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Додати учасника</h2>

                <input
                    type="email"
                    placeholder="Введіть email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md mb-2 focus:ring-2 focus:ring-blue-500"
                />

                {filtered.length > 0 && (
                    <ul className="border rounded-md max-h-40 overflow-y-auto">
                        {filtered.map(user => (
                            <li
                                key={user.uid}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleSelect(user)}
                            >
                                {user.email} — {user.name || 'Без імені'}
                            </li>
                        ))}
                    </ul>
                )}

                <div className="flex justify-end gap-2 mt-4">
                    <button
                        onClick={onClose}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                    >
                        Скасувати
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddUserToList;
