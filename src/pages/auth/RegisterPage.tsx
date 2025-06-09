import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { registerUser } from '../../features/auth/authSlice';
import { db } from '../../firebase/config';

const RegisterPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { user, loading, error, isAuthenticated } = useAppSelector(state => state.auth);

    const [form, setForm] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        username: '',
    });

    const [errors, setErrors] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        username: '',
        general: '',
    });

    useEffect(() => {
        if (isAuthenticated && user) {
            const createUserDoc = async () => {
                await setDoc(doc(db, 'users', user.uid), {
                    email: user.email,
                    username: form.username,
                    createdAt: serverTimestamp(),
                });
                navigate('/dashboard');
            };
            createUserDoc();
        }
    }, [isAuthenticated, user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '', general: '' });
    };

    const validate = () => {
        const newErrors = {
            email: '',
            password: '',
            confirmPassword: '',
            username: '',
            general: '',
        };
        let isValid = true;

        if (!form.email) {
            newErrors.email = 'Введіть електронну пошту';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(form.email)) {
            newErrors.email = 'Некоректна електронна пошта';
            isValid = false;
        }

        if (!form.username) {
            newErrors.username = 'Введіть імʼя користувача';
            isValid = false;
        }

        if (!form.password) {
            newErrors.password = 'Введіть пароль';
            isValid = false;
        } else if (form.password.length < 6) {
            newErrors.password = 'Пароль має містити щонайменше 6 символів';
            isValid = false;
        }

        if (form.confirmPassword !== form.password) {
            newErrors.confirmPassword = 'Паролі не співпадають';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            await dispatch(
                registerUser({
                    email: form.email,
                    password: form.password,
                    username: form.username,
                })
            ).unwrap();
            navigate('/dashboard');
        } catch (error: any) {
            setErrors((prev) => ({
                ...prev,
                general: error.message || 'Помилка реєстрації',
            }));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md space-y-5"
                noValidate
            >
                <h2 className="text-2xl font-bold text-center text-gray-800">Реєстрація</h2>

                {(errors.general || error) && (
                    <p className="text-red-500 text-sm text-center">{errors.general || error}</p>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700">Електронна пошта</label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'
                            } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Імʼя користувача</label>
                    <input
                        type="text"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-4 py-2 border ${errors.username ? 'border-red-500' : 'border-gray-300'
                            } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Пароль</label>
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-4 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'
                            } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Повторіть пароль</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-4 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                            } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {errors.confirmPassword && (
                        <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2 rounded-md transition 
                        ${loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                >
                    {loading ? 'Реєстрація...' : 'Зареєструватися'}
                </button>
                <div className="text-center">
                    <span className="text-sm text-gray-600">Вже маєте акаунт? </span>
                    <a
                        href="/login"
                        className="text-sm text-blue-600 hover:underline"
                    >
                        Увійти
                    </a>
                </div>
            </form>
        </div>
    );
};

export default RegisterPage;
