import { Routes, Route, Navigate } from 'react-router-dom';
import { routes } from './routes/routes';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { clearUser, setUser } from './features/auth/authSlice';
import { firebaseAuth } from './firebase/config';

const App = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        dispatch(setUser({
          uid: user.uid,
          displayName: user.displayName || '',
          email: user.email || '',
        }));
      } else {
        dispatch(clearUser());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);
  return (
    <Routes>
      {routes.map(({ path, element, protected: isProtected }) => {
        if (isProtected) {
          return (
            <Route
              key={path}
              path={path}
              element={isAuthenticated ? element : <Navigate to="/login" />}
            />
          );
        }

        return <Route key={path} path={path} element={element} />;
      })}
    </Routes>
  );
};

export default App;
