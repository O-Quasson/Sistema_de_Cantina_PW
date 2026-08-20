import React from "react";
import logo from '../assets/logo.png'
import { Link } from "react-router-dom";

function Loginscreen() {
    return(
        <>
            <div className="login-container">
                <h1 className="login-title">Login</h1>

                <form className="login-form">
                    
                    <div className="form-group-container">
                        <div className="form-field">
                            <label htmlFor='RM' className="form-label">RM:</label>
                            <input type='number' id='RM' name='RM' className="form-input" />
                        </div>

                        <div className="form-field">
                            <label htmlFor='senha' className="form-label">Senha:</label>
                            <input type='password' id='senha' name='senha' className="form-input" />
                        </div>
                    </div>
                    
                    <input type='submit' value="Entrar" className="form-submit"/>
                
                </form>
            </div>

            <style>{`
                /* --- ESTILO PADRÃO (CELULAR) --- */
                .login-container {
                    display: flex; 
                    justify-content: center; 
                    align-items: center; 
                    flex-direction: column; 
                    width: 100%;
                }
                .login-title {
                    font-family: 'Dancing Script'; 
                    font-size: 400%; 
                    color: #6B0707; 
                    text-shadow: -1px -1px 0 #000;
                }
                .login-form {
                    background-image: linear-gradient(180deg , #070048, #3A0202); 
                    padding: 5% 7%; 
                    border-radius: 15px; 
                    color: white; 
                    display: flex; 
                    flex-direction: column; 
                    gap: 3rem; 
                    width: 75%;
                }
                .form-group-container {
                    display: flex; 
                    flex-direction: column; 
                    gap: 1rem;
                }
                .form-field {
                    display: flex; 
                    gap: 0.5rem; 
                    flex-direction: column;
                }
                .form-label {
                    font-size: 125%; 
                    font-family: sans-serif;
                }
                .form-input {
                    border-radius: 5px; 
                    outline: none; 
                    border: none; 
                    padding: 5%; 
                    width: 100%; 
                    box-sizing: border-box;
                }
                .form-submit {
                    background-color: #6B0707; 
                    outline: none; 
                    border: none; 
                    border-radius: 12px; 
                    color: white; 
                    height: 4.5rem; 
                    font-size: 125%;
                }

                /* --- ESTILO PARA COMPUTADOR (MEDIA QUERY) --- */
                @media (min-width: 769px) {
                    .login-form {
                        padding: 2% 4%;
                        width: 25%;
                    }
                }
            `}</style>
        </>
    )
}

export default Loginscreen;