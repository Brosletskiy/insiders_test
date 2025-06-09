import React from 'react';
import type { Task } from '../../types';

interface TaskItemProps {
    task: Task;
    isAdmin: boolean;
    onEdit: () => void;
    onDelete: () => void;
    onToggle: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, isAdmin, onEdit, onDelete, onToggle }) => {
    return (
        <div className="flex items-start justify-between border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
            <div className="flex items-start gap-3">
                <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={onToggle}
                    className="mt-1"
                />
                <div>
                    <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                        {task.title}
                    </h3>
                    {task.description && (
                        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                    )}
                </div>
            </div>

            {isAdmin && (
                <div className="flex items-center gap-2">
                    <button
                        onClick={onEdit}
                        className="text-blue-600 hover:underline text-sm"
                    >
                        Редагувати
                    </button>
                    <button
                        onClick={onDelete}
                        className="text-red-500 hover:underline text-sm"
                    >
                        Видалити
                    </button>
                </div>
            )}
        </div>
    );
};

export default TaskItem;
