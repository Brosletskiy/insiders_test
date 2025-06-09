import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center space-y-6">
                <h1 className="text-3xl font-bold text-gray-800">Ласкаво просимо!</h1>
                <p className="text-gray-600">Увійдіть або створіть акаунт, щоб почати користуватись To-Do додатком.</p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button
                        onClick={() => navigate('/login')}
                        className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition"
                    >
                        Увійти
                    </button>
                    <button
                        onClick={() => navigate('/register')}
                        className="px-6 py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition"
                    >
                        Зареєструватися
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HomePage;