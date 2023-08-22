import React, { useContext } from 'react'
import AuthContext from '../context/AuthContext'


const RegistrationPage = () => {
    let { registerUser } = useContext(AuthContext)
    return (
        <div>
            <form onSubmit={registerUser}>
                <input type='text' name='username' placeholder='enter username' />
                <input type='password' name='password' placeholder='enter password' />
                <input type='submit' />
            </form>
        </div>
    )
}

export default RegistrationPage