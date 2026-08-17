import React, { useState } from "react";
import logo from '../assets/logo.png'
import api from '../axios/api.js'
import { Link } from "react-router-dom";
import Cookies from 'js-cookie'

function Loginscreen() {

    const [escolha, setescolha] = useState('aluno');
    const [login, setlogin] = useState();
    const [senha, setsenha] = useState();

    const loginA = async(e) => {
        e.preventDefault();

        let form = new FormData(e.target);

        const dados = {
            RM: Object.fromEntries(form.entries()).RM,
            senha: Object.fromEntries(form.entries()).senha
        }

        api.post('/loginA', dados)
            .then((data) => {
                console.log(data.data);
                alert(data.data);

                console.log(data.data.status)
                console.log("-------------")
                if(data.status==201){
                    Cookies.set('logado', JSON.stringify({logado: true, isCooking: false}), {expires: 1/720});
                }
            })

        }

    const loginF = async(e) => {
        e.preventDefault();

        let form = new FormData(e.target);

        const dados = {
            email: Object.fromEntries(form.entries()).email,
            senha: Object.fromEntries(form.entries()).senha
        }

        api.post('/loginF', dados)
            .then((data) => {
                console.log(data.data);
                alert(data.data);

                if(data.status==201){
                    Cookies.set('logado', JSON.stringify({logado: true, isCooking: true}), {expires: 1/720});
                }
            })

    }

    function Formulario(){
        if(escolha=="aluno"){
            return(
                <form onSubmit={loginA} className="login-form">
                    <div className="form-group-container">
                        <div className="form-field">
                            <label for="RM" className="form-label">RM:</label>
                            <input id="RM" name="RM" type="number" className="form-input" onChange={setlogin}></input>
                        </div>

                        <div className="form-field">
                            <label for="senha" className="form-label">Senha:</label>
                            <input id="senha" name="senha" type="password" className="form-input" onChange={setsenha}></input>
                        </div>
                        
                    </div>

                    <input type='submit' value="Entrar" className="form-submit"/>
                    
                </form>
            )
        }else if(escolha=="func"){
            return(

                <form onSubmit={loginF} className="login-form">
                    <div className="form-group-container">
                        <div className="form-field">
                            <label for="email" className="form-label">Email:</label>
                            <input id="email" name="email" type="email" className="form-input" onChange={setlogin}></input>
                        </div>

                        <div className="form-field">
                            <label for="senha" className="form-label">Senha:</label>
                            <input id="senha" name="senha" type="password" className="form-input" onChange={setsenha}></input>
                        </div>
                        
                    </div>

                    <input type='submit' value="Entrar" className="form-submit"/>
                    
                </form>

            )
        }
    }

    return(
        <>
            <div className="login-container">
                <h1 className="login-title">Login</h1>

                <div style={{marginBottom: 25}}>
                    <select name='escolha' id='escolha' defaultValue={'aluno'} onChange={(e) => setescolha(e.target.value)} style={{textAlign: 'center', width: 200, fontSize: 20, height: 40}}>
                        <option value="aluno">Aluno</option>
                        <option value="func">Cozinheiro</option>
                    </select>
                </div>

                {Formulario()}

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