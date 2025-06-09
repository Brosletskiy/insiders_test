import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loginUser } from '../../features/auth/authSlice';

const LoginPage = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);

    const [form, setForm] = useState({ email: '', password: '' });
    const [formErrors, setFormErrors] = useState({ email: '', password: '', general: '' });

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setFormErrors({ ...formErrors, [e.target.name]: '', general: '' });
    };

    const validate = () => {
        const errors = { email: '', password: '', general: '' };
        let isValid = true;

        if (!form.email) {
            errors.email = 'Введіть електронну пошту';
            isValid = false;
        }

        if (!form.password) {
            errors.password = 'Введіть пароль';
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        dispatch(loginUser(form));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md space-y-5"
                noValidate
            >
                <h2 className="text-2xl font-bold text-center text-gray-800">Вхід</h2>

                {(formErrors.general || error) && (
                    <p className="text-red-500 text-sm text-center">{formErrors.general || error}</p>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700">Електронна пошта</label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-4 py-2 border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Пароль</label>
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-4 py-2 border ${formErrors.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {formErrors.password && <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                >
                    {loading ? 'Завантаження...' : 'Увійти'}
                </button>
                <div className="text-center">
                    <span className="text-sm text-gray-600">Ще не маєте акаунту? </span>
                    <a
                        href="/register"
                        className="text-sm text-blue-600 hover:underline"
                    >
                        Зареєструватися
                    </a>
                </div>
            </form>
        </div>
    );
};

export default LoginPage;