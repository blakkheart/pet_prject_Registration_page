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
    // задаем переменную токена и функцию для его задания
    // дефолтное зачение берем из локального хранилища (бразуера), в случае, если пользователь уже получал токен
    // если его нет, то ставим null
    let [authToken, setAuthToken] = useState(() =>
        localStorage.getItem('authToken') ? JSON.parse(localStorage.getItem('authToken')) : null)
    // задаем переменную пользоветеля и функцию для его задания
    // дефолтное зачение берем из локального хранилища (бразуера), в случае, если пользователь уже получал токен
    // с помощью фукнции {jwt_decode} вытаскиваем данные о пользователе, т.к. токен хранит id и username(назначили на стороне бэкенда)
    // если его нет, то ставим null
    let [user, setUser] = useState(() =>
        localStorage.getItem('authToken') ? jwt_decode(localStorage.getItem('authToken')) : null)
    // задаем переменную, которая проверяет первую загрузку страницы (маунт?), и функцию для ее задания 
    // нужна для того, чтобы при первой загрузке проверять, что токен точно создается
    let [loading, setLoading] = useState(true)

    // асинхронная функция логина, которая принимает в себя event
    let loginUser = async (e) => {
        // запрещаем дефолтное использование, иначе она будет срабатывать дважды каждый раз при вызове
        e.preventDefault()
        // отправляем POST запрос на получение токена по юзернейму и пассворду 
        // просим дождаться Promise через использование await
        let response = await fetch('http://127.0.0.1:8000/api/auth/jwt/create/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // ковертируем JavaScript object в формат JSON
            // юзернейма берем из ивента submit в форме в {LoginPage} компонента
            // забираем значение (value) поля username
            // аналогично для пароля 
            body: JSON.stringify({ 'username': e.target.username.value, 'password': e.target.password.value })
        })
        // получем данные из JSON, переведя в JS object
        // не забываем просить через await ждать до конца, пока Promise не будет реализован
        let data = await response.json()
        // проверяем, что ответ от сервера окей (запрос прошел успешно, статус == 200)
        // если так, то 
        // задаем {authToken} через {setAuthToken} как ответ от апи (два ключа - access и refresh)
        // задаем {user} через {setUser} как декодированные данные нашего access токен (будут присутстовать ключи id, username)
        // записываем в локальное хранилище (в бразуер) данные о токене
        //перенаправляем пользователя с помощью {navigate} на главную страницу
        if (response.status === 200) {
            setAuthToken(data)
            setUser(jwt_decode(data.access))
            localStorage.setItem('authToken', JSON.stringify(data))
            navigate('/')
        } else {
            // иначе уведомляем юзера, что что-то пошло не так на стороне апи
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

    // асинхронная фукнция обновления access токена через refresh токен
    let updateToken = async () => {
        // отправляем POST запрос на обновление access токена
        let response = await fetch('http://127.0.0.1:8000/api/auth/jwt/refresh/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // проверяем наличие autToken, если есть, то по ключу refresh получаем refresh токен
            body: JSON.stringify({ 'refresh': authToken?.refresh })
        })
        // получем данные из JSON, переведя в JS object
        // не забываем просить через await ждать до конца, пока Promise не будет реализован
        let data = await response.json()

        // проверяем, что ответ от сервера нас устраивает (запрос прошел успешно, статус == 200)
        // если все ок, то 
        // задаем {authToken} через {setAuthToken} как ответ от апи (два ключа - access и refresh)
        // задаем {user} через {setUser} как декодированные данные нашего access токен (будут присутстовать ключи id, username)
        // записываем в локальное хранилище (в бразуер) данные о токене
        if (response.status === 200) {
            setAuthToken(data)
            setUser(jwt_decode(data.access))
            localStorage.setItem('authToken', JSON.stringify(data))
        } else {
            // иначе уведомляем пользователя о проблеме с redresh токеном
            // и разлогиниваем его через функцию {lofoutUser}
            alert('something is wrong with refresh token')
            logoutUser()
        }

        // проверяем, первая ли загрузка страницы
        // если да, то изменяем {loading} на false
        if (loading) {
            setLoading(false)
        }
    }

    // создаем контекст, в который занесем данные о пользователе (id, username),
    // его токен access и refresh, а так же функции логина и логаута
    let contextData = {
        user: user,
        authToken: authToken,
        loginUser: loginUser,
        logoutUser: logoutUser

    }

    useEffect(() => {
        // если загрузка страницы первая
        // то просим заапдейтить токен 
        if (loading) {
            updateToken()
        }

        // делаем переменную, хранящюю в себе в милисекундах 14 минут
        // т.к. токен на бекенде истекает раз в 15 минут
        let fourteenMinutes = 1000 * 60 * 14
        // делаем интевал через встроенную в JS функцию {setInterval}, который каждые 14 минут
        // будет при наличии {authtoken} вызывает функцию обновления токена
        let interval = setInterval(() => {
            if (authToken) {
                updateToken()
            }
        }, fourteenMinutes)
        // обязательно должны очищать интервал, иначе будем при каждом обновлении {authToken}
        // создавать ДОПОЛНИТЕЛЬНЫЙ интервал, из-за чего будем через пару итераций улетать в ошибку
        return () => clearInterval(interval)

        // не забываем про зависимости!
    }, [authToken, loading])

    // 
    return (
        // просим предоставлять всем "детям" нашего компонента контекст {contextData}
        // заодно проверяем, если токен еще не получен (в таком случае {loading} == false), то 
        // никому не предоставялем словарь, иначе всем "детям"
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>

    )
}