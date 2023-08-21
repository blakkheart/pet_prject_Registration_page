import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

// создаем приватный раутер,
// который проверяет аутентификацию и пропускает дальше в случае успеха
const PrivateRoute = ({ children, ...rest }) => {
    // забираем пользователя из контеста
    let { user } = useContext(AuthContext)
    // проверяаем наличие пользователя
    // если нет, возвращаем на страницу логина через Navigate
    // иначе пропускаем к детям данного раутера через {Outlet}
    return (
        user ? <Outlet /> : <Navigate to='login' />
    )
}

export default PrivateRoute