import { useState } from 'react';
import './SingUp.css';

export default function SingUp(){

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [phone, setPhone] = useState('')
    const [street, setStreet] = useState('')
    const [dni, setDni] = useState('')

    const emailOnChange = (event) => {
        setEmail(event.target.value)
    }

    const passwordOnChange = (event) => {
        setPassword(event.target.value)
    }

    const phoneOnChange = (event) => {
        setPhone(event.target.value)
    }

    const streetOnChange = (event) => {
        setStreet(event.target.value)
    }

    const dniOnChange = (event) => {
        setDni(event.target.value)
    }

    const buttonOnClick = (event) =>{
        event.preventDefault()
        setUpdated(email)
    }

    return(
        <form>
            <div>
                <label htmlFor="email">Email:</label>
                <input id="email" type='email' value={email} onChange={emailOnChange}/>
            </div>
            <div>
                <label htmlFor="password">Password:</label>
                <input id="password" type='password' value={password} onChange={passwordOnChange}/>
            </div>
            <div>
                <label htmlFor='phone'>Phone:</label>
                <input id="phone" type='tel' value={phone} onChange={phoneOnChange}/>
            </div>
            <div>
                <label htmlFor='street'>Street:</label>
                <input id="street" type='text' value={street} onChange={streetOnChange}/>
            </div>
            <div>
                <label htmlFor='dni'>DNI:</label>
                <input id="dni" type='text' value={dni} onChange={dniOnChange}/>
            </div>

            <button onClick={buttonOnClick}>Crear Cuenta</button>
        </form>
    )
}