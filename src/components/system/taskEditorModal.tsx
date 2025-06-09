import React, { useEffect, useState } from 'react';
import type { Task } from '../../types';

interface TaskEditorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (title: string, description: string) => void;
    initialData?: Pick<Task, 'title' | 'description'>;
}

const TaskEditorModal: React.FC<TaskEditorModalProps> = ({
    isOpen,
    onClose,
    onSave,
    initialData
}) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title || '');
            setDescription(initialData.description || '');
        } else {
            setTitle('');
            setDescription('');
        }
    }, [initialData, isOpen]);

    const handleSubmit = () => {
        if (!title.trim()) return;
        onSave(title.trim(), description.trim());
        onClose();
    };

    const handleCancel = () => {
        setTitle('');
        setDescription('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                    {initialData ? 'Редагувати завдання' : 'Нове завдання'}
                </h2>

                <input
                    type="text"
                    placeholder="Назва"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full mb-3 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                />

                <textarea
                    placeholder="Опис (необов’язково)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full mb-4 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                />

                <div className="flex justify-end gap-2">
                    <button
                        onClick={handleCancel}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                    >
                        Відмінити
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Зберегти
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaskEditorModal;
