import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext'


// делаем header для страницы
const Header = () => {
    // забираем пользователя и функцию логаута из контекста
    let { user, logoutUser } = useContext(AuthContext)


    // проверяем, есть ли пользователь
    // если есть, то даем использовать функцию {logoutUser}
    // если нет, то даем использовать кнопку логина
    // выводим в теле при наличии юзера приветствие к юзеру
    return (
        <div>
            <Link to='/'>Home</Link>
            <span> / </span>
            {user ? (
                <p onClick={logoutUser}>Logout</p>
            ) : (
                <Link to='/login'>Login</Link>
            )}

            {user && <p>Hello {user.username}</p>}

        </div>
    )
}

export default Header