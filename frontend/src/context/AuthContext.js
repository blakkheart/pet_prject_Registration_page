import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// устанавливаем jwt_decode, т.к мы хотим забирать из токена информацию, например, имя пользователя
// (заранее добавили в токен на бекэнде данную информацию)
import jwt_decode from 'jwt-decode';

// создаем контекст, в котором на протяжении всего приложения будем хранить и откуда будем получать
// необходимые данные
const AuthContext = createContext()
export default AuthContext


export const AuthProvider = ({ children }) => {

    // задаем переменную для перенаправления пользователя по сайту
    let navigate = useNavigate()
    //
    let [authToken, setAuthToken] = useState(() =>
        localStorage.getItem('authToken') ? JSON.parse(localStorage.getItem('authToken')) : null)
    //
    let [user, setUser] = useState(() =>
        localStorage.getItem('authToken') ? jwt_decode(localStorage.getItem('authToken')) : null)
    //
    let [loading, setLoading] = useState(true)

    //
    let loginUser = async (e) => {
        e.preventDefault()
        let response = await fetch('http://127.0.0.1:8000/api/auth/jwt/create/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'username': e.target.username.value, 'password': e.target.password.value })
        })
        let data = await response.json()
        if (response.status === 200) {
            setAuthToken(data)
            setUser(jwt_decode(data.access))
            localStorage.setItem('authToken', JSON.stringify(data))
            navigate('/')
        } else {
            alert('something wrong with api response')
        }
    }

    // функциия логаута
    // очищает токен через функцию {setAuthToken}
    // очищает юзера через функцию {setUser}
    // убирает токен пользователя из локального хранилища (бразуера)
    // перенаправляет пользователя на страницу логина
    let logoutUser = () => {
        setAuthToken(null)
        setUser(null)
        localStorage.removeItem('AuthToken')
        navigate('/login')
    }

    //
    let updateToken = async () => {
        let response = await fetch('http://127.0.0.1:8000/api/auth/jwt/refresh/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'refresh': authToken?.refresh })
        })
        let data = await response.json()

        if (response.status === 200) {
            setAuthToken(data)
            setUser(jwt_decode(data.access))
            localStorage.setItem('authToken', JSON.stringify(data))
        } else {
            alert('something is wrong with refresh token')
            logoutUser()
        }

        if (loading) {
            setLoading(false)
        }
    }

    // создаем контекст, в который занесем данные о пользователе,
    // его токен access и refresh, а так же функции логина и логаута
    let contextData = {
        user: user,
        authToken: authToken,
        loginUser: loginUser,
        logoutUser: logoutUser

    }

    useEffect(() => {

        if (loading) {
            updateToken()
        }

        let fourteenMinutes = 1000 * 60 * 14
        let interval = setInterval(() => {
            if (authToken) {
                updateToken()
            }
        }, fourteenMinutes)
        return () => clearInterval(interval)


    }, [authToken, loading])

    // 
    return (
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>

    )
}