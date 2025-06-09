import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchTasks, addTask, removeTask, editTask } from '../../features/tasks/taskSlice';
import TaskItem from '../../components/system/taskItem';
import TaskEditorModal from '../../components/system/taskEditorModal';
import { Role, type Task } from '../../types';
import { fetchTodoLists } from '../../features/todoLists/todoListSlice';

const TodoListPage = () => {
    const { listId } = useParams<{ listId: string }>();
    const dispatch = useAppDispatch();

    const allTasks = useAppSelector(state => state.task.tasks);
    const currentUserId = useAppSelector(state => state.auth.user?.uid);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const currentList = useAppSelector(state =>
        state.todoLists.items.find(list => list.id === listId)
    );

    const memberRoles = useAppSelector(state =>
        state.todoLists.items.find(list => list.id === listId)?.memberRoles || {}
    );

    const isAdmin = memberRoles[currentUserId || ''] === Role.Admin;

    const tasks = allTasks.filter(task => task.todoListId === listId);


    useEffect(() => {
        if (currentUserId && !currentList) {
            dispatch(fetchTodoLists(currentUserId));
        }
    }, [dispatch, currentUserId, currentList]);

    useEffect(() => {
        if (listId) dispatch(fetchTasks(listId));
    }, [dispatch, listId]);

    const handleEdit = (task: Task) => {
        setEditingTask(task);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setEditingTask(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingTask(null);
    };

    if (!listId) return <div>Помилка: список не знайдено</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold">Список завдань</h1>
                {isAdmin && (
                    <div className="flex gap-2">
                        <button
                            onClick={handleCreate}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                            Додати завдання
                        </button>
                        <button
                            onClick={() => {
                                // TODO: модалка для додавання viewer
                                console.log('Open add viewer modal');
                            }}
                            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                        >
                            Додати учасника
                        </button>
                    </div>
                )}
            </div>

            <div className="space-y-4">
                {tasks.map(task => (
                    <TaskItem
                        key={task.id}
                        task={task}
                        isAdmin={isAdmin}
                        onEdit={() => handleEdit(task)}
                        onDelete={() => dispatch(removeTask({ listId: listId!, taskId: task.id }))}
                        onToggle={() =>
                            dispatch(editTask({
                                listId: listId!,
                                taskId: task.id,
                                updates: { completed: !task.completed }
                            }))
                        }
                    />
                ))}
            </div>

            {isModalOpen && (
                <TaskEditorModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={(title, description) => {
                        if (editingTask) {
                            dispatch(editTask({
                                listId,
                                taskId: editingTask.id,
                                updates: { title, description }
                            }));
                        } else {
                            dispatch(addTask({
                                listId,
                                task: {
                                    title,
                                    description,
                                    completed: false,
                                    todoListId: listId
                                }
                            }));
                        }
                    }}
                    initialData={editingTask ? {
                        title: editingTask.title,
                        description: editingTask.description || ''
                    } : undefined}
                />

            )}
        </div>
    );
};

export default TodoListPage;