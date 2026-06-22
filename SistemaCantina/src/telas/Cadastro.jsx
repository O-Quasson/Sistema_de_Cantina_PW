import React from "react";
import logo from '../assets/logo.png'
import { Link } from "react-router-dom";
import api from "../axios/api";

function Cadastroscreen() {

    const envia = async(e) => {

        e.preventDefault();

        let form = new FormData(e.target);

        if(Object.fromEntries(form.entries()).senha!=Object.fromEntries(form.entries()).Csenha){
            alert("As senhas devem ser iguais");
        }else{

            const dados = {
                RM: Object.fromEntries(form.entries()).RM,
                email: Object.fromEntries(form.entries()).email,
                senha: Object.fromEntries(form.entries()).senha
            }

            api.post('/cadastro', dados)
                .then((data) => {
                    console.log(data.data);
                    alert(data.data);
                });
            console.log(dados)

        }
    }

    return(
        <>
            <div className="cadastro-container">
                <h1 className="cadastro-title">Cadastrar</h1>

                <form onSubmit={envia} className="cadastro-form">
                    
                    <div className="form-group-container">
                        <div className="form-field">
                            <label htmlFor='RM' className="form-label">RM:</label>
                            <input type='number' id='RM' name='RM' className="form-input" />
                        </div>

                        <div className="form-field">
                            <label htmlFor='email' className="form-label">Email:</label>
                            <input type='email' id='email' name='email' className="form-input" />
                        </div>

                        <div className="form-field">
                            <label htmlFor='senha' className="form-label">Senha:</label>
                            <input type='password' id='senha' name='senha' className="form-input" />
                        </div>

                        <div className="form-field">
                            <label htmlFor='Csenha' className="form-label">Confirmar senha:</label>
                            <input type='password' id='Csenha' name='Csenha' className="form-input" />
                        </div>
                    </div>
                    
                    <input type='submit' value="Cadastrar" className="form-submit"/>
                
                </form>
            </div>

            <style>{`
                /* --- ESTILO PADRÃO (CELULAR) --- */
                .cadastro-container {
                    display: flex; 
                    justify-content: center; 
                    align-items: center; 
                    flex-direction: column; 
                    width: 100%;
                }
                .cadastro-title {
                    font-family: 'Dancing Script'; 
                    font-size: 400%; 
                    color: #6B0707; 
                    text-shadow: -1px -1px 0 #000;
                }
                .cadastro-form {
                    background-image: linear-gradient(180deg , #070048, #3A0202); 
                    padding: 7% 7%; 
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
                    height: 3.5rem; 
                    font-size: 125%;
                }

                /* --- ESTILO PARA COMPUTADOR (MEDIA QUERY) --- */
                @media (min-width: 769px) {
                    .cadastro-form {
                        padding: 2% 4%;
                        width: 25%;
                    }
                    .form-submit {
                        height: 4.5rem;
                    }
                }
            `}</style>
        </>
    )
}

export default Cadastroscreen;