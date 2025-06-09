import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import type { TodoList } from '../../types';

interface Props {
    list: TodoList;
}

const TodoListCard: FC<Props> = ({ list }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/list/${list.id}`);
    };

    return (
        <div
            onClick={handleClick}
            className="cursor-pointer bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition"
        >
            <h3 className="text-lg font-semibold mb-2">{list.title}</h3>
            <p className="text-sm text-gray-500">Оновлено: {list.updatedAt?.toDate().toLocaleString()}</p>
        </div>
    );
};

export default TodoListCard;