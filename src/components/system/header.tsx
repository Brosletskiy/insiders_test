import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';
import { logoutUser } from '../../features/auth/authSlice';

const Header: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleLogout = async () => {
        await dispatch(logoutUser());
        navigate('/login');
    };

    return (
        <header className="w-full bg-white shadow p-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-800">To-Do App</h1>
            <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
                Вийти
            </button>
        </header>
    );
};

export default Header;