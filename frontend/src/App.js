import './App.css';

import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import Header from './components/Header';
import PrivateRoute from './utils/PrivateRoute';

// {BrowserRouter} содержит внутри себя все остальные раутеры
// используем наш компонент {AuthProvider}, для реализации всей логики приложения,
// т.к. все дети данного компонента имеют доступ к контексту, назначенному внутри {AuthProvider}
// любой {Route} обязан быть внутри {Routes} (react-router-dom-v6)
// если мы хотим что-то защитить проверкой на авторизацию, то мы должны
// заносить данный компонент внутрь "тега" {PrivateRoute}
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <Header />
          <Routes>
            <Route element={<PrivateRoute />} path='/' exact>
              <Route element={<HomePage />} path='/' exact />
            </Route>
            <Route element={<LoginPage />} path='/login' />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
