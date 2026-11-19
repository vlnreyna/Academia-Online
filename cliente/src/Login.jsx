import React, {useState} from 'react'

export default function Login() {

    //Creo una propiedad que va a estar asociado el cambio de estado
    //const [text, setText] = useState('')


    //Creo la propiedad Email
    const [email, setEmail] = useState('')

    const [password, setPassword] = useState('')

    const [updated, setUpdated] = useState('')

    // Va a llamar a la actualizacion de estado
    // Con lo que tenga el Event, el Target y en Value
    /*const textOnChange = (event) => {
        setText(event.target.value)
    }*/


    //Aqui va a llamar al Email
    const emailOnChange = (event) =>{
        setEmail(event.target.value)
    }

    //Aqui voy a llamar a PassWord
    const passwordOnChange = (event) => {
        setPassword(event.target.value)
    }

    const buttonOnClick = (event) =>{
        event.preventDefault()
        setUpdated(email)
    }
  return (
    <from>
        <div>
            <label htmlFor="email">Email:</label>
            <input type='email' value={email} onChange={emailOnChange}/>
        </div>
        
        <div>
            <label htmlFor="password">Password:</label>
            <input type='password' value={password} onChange={passwordOnChange} />
        </div>
        <button onClick={buttonOnClick}>Iniciar Sesion</button>
    </from>
  )
}


