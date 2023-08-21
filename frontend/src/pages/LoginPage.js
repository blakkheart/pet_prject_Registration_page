import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';


// страница логина юзера
const LoginPage = () => {
    // забираем функцию {loginUser} из контекста
    let { loginUser } = useContext(AuthContext)

    // форма, при сабмите вызывается функция {loginUser}
    // три поля: логин, пароль, кнопка сабмита
    return (
        <div>
            <form onSubmit={loginUser}>
                <input type='text' name='username' placeholder='enter username' />
                <input type='password' name='password' placeholder='enter password' />
                <input type='submit' />
            </form>
        </div>
    )
}

export default LoginPage