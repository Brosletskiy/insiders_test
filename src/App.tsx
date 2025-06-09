import { Routes, Route, Navigate } from 'react-router-dom';
import { routes } from './routes/routes';
import { useAppSelector } from './store/hooks';

const App = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

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
