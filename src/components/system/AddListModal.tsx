import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../../store';
import { createTodoList } from '../../features/todoLists/todoListSlice';

interface AddListModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddListModal: React.FC<AddListModalProps> = ({ isOpen, onClose }) => {
    const dispatch = useDispatch<AppDispatch>();
    const userId = useSelector((state: RootState) => state.auth.user?.uid);

    const [title, setTitle] = useState('');

    const handleCreate = () => {
        console.log('Creating list with:', title.trim(), userId);
        if (title.trim() && userId) {
            dispatch(createTodoList({ title: title.trim(), ownerId: userId }));
            setTitle('');
            onClose();
        }
    };

    const handleCancel = () => {
        setTitle('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Новий список</h2>

                <input
                    type="text"
                    placeholder="Назва списку"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
                />

                <div className="flex justify-end space-x-2">
                    <button
                        onClick={handleCancel}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                    >
                        Відмінити
                    </button>
                    <button
                        onClick={handleCreate}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Створити
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddListModal;
