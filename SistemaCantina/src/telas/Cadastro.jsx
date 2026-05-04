import React from "react";
import logo from '../assets/logo.png'
import { isDesktop } from "react-device-detect";
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

    if(isDesktop){
        return(
            <>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', width: '100%'}}>
                    <h1 style={{fontFamily: 'Dancing Script', fontSize: '400%', color: '#6B0707', textShadow: '-1px -1px 0 #000'}}>Cadastrar</h1>

                    <form onSubmit={envia} style={{backgroundImage: 'linear-gradient(180deg , #070048, #3A0202)', padding: '2% 4%', borderRadius: 15, color: 'white', display: 'flex', flexDirection: 'column', gap: '3rem', width: '25%'}}>
                        
                        <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                            <div style={{display: 'flex', gap: '0.5rem', flexDirection: 'column'}}>
                                <label for='RM' style={{fontSize: '125%', fontFamily: 'sans-serif'}}>RM:</label>
                                <input type='number' id='RM' name='RM' style={{borderRadius: 5, outline: 'none', border: 'none', padding: '5%', width: '100%', boxSizing: 'border-box'}} />
                            </div>

                            <div style={{display: 'flex', gap: '0.5rem', flexDirection: 'column'}}>
                                <label for='email' style={{fontSize: '125%', fontFamily: 'sans-serif'}}>Email:</label>
                                <input type='email' id='email' name='email' style={{borderRadius: 5, outline: 'none', border: 'none', padding: '5%', width: '100%', boxSizing: 'border-box'}} />
                            </div>

                            <div style={{display: 'flex', gap: '0.5rem', flexDirection: 'column'}}>
                                <label for='senha' style={{fontSize: '125%', fontFamily: 'sans-serif'}}>Senha:</label>
                                <input type='password' id='senha' name='senha' style={{borderRadius: 5, outline: 'none', border: 'none', padding: '5%', width: '100%', boxSizing: 'border-box'}} />
                            </div>

                            <div style={{display: 'flex', gap: '0.5rem', flexDirection: 'column'}}>
                                <label for='Csenha' style={{fontSize: '125%', fontFamily: 'sans-serif'}}>Confirmar senha:</label>
                                <input type='password' id='Csenha' name='Csenha' style={{borderRadius: 5, outline: 'none', border: 'none', padding: '5%', width: '100%', boxSizing: 'border-box'}} />
                            </div>
                        </div>
                        
                        <input type='submit' value="Cadastrar" style={{backgroundColor: '#6B0707', outline: 'none', border: 'none', borderRadius: 12, color: 'white', height: '4.5rem', fontSize: '125%'}}/>
                    
                    </form>
                </div>
            </>
        )
    }else{
        return(
           <>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', width: '100%'}}>
                    <h1 style={{fontFamily: 'Dancing Script', fontSize: '400%', color: '#6B0707', textShadow: '-1px -1px 0 #000'}}>Cadastrar</h1>
                    <form onSubmit={envia} style={{backgroundImage: 'linear-gradient(180deg , #070048, #3A0202)', padding: '7% 7%', borderRadius: 15, color: 'white', display: 'flex', flexDirection: 'column', gap: '3rem', width: '75%'}}>
                       
                        <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                            <div style={{display: 'flex', gap: '0.5rem', flexDirection: 'column'}}>
                                <label for='RM' style={{fontSize: '125%', fontFamily: 'sans-serif'}}>RM:</label>
                                <input type='number' id='RM' name='RM' style={{borderRadius: 5, outline: 'none', border: 'none', padding: '5%', width: '100%', boxSizing: 'border-box'}} />
                            </div>

                            <div style={{display: 'flex', gap: '0.5rem', flexDirection: 'column'}}>
                                <label for='email' style={{fontSize: '125%', fontFamily: 'sans-serif'}}>Senha:</label>
                                <input type='email' id='email' name='email' style={{borderRadius: 5, outline: 'none', border: 'none', padding: '5%', width: '100%', boxSizing: 'border-box'}} />
                            </div>

                            <div style={{display: 'flex', gap: '0.5rem', flexDirection: 'column'}}>
                                <label for='senha' style={{fontSize: '125%', fontFamily: 'sans-serif'}}>Senha:</label>
                                <input type='password' id='senha' name='senha' style={{borderRadius: 5, outline: 'none', border: 'none', padding: '5%', width: '100%', boxSizing: 'border-box'}} />
                            </div>

                            <div style={{display: 'flex', gap: '0.5rem', flexDirection: 'column'}}>
                                <label for='Csenha' style={{fontSize: '125%', fontFamily: 'sans-serif'}}>Senha:</label>
                                <input type='password' id='Csenha' name='Csenha' style={{borderRadius: 5, outline: 'none', border: 'none', padding: '5%', width: '100%', boxSizing: 'border-box'}} />
                            </div>

                        </div>
                       
                        <input type='submit' value="Cadastrar" style={{backgroundColor: '#6B0707', outline: 'none', border: 'none', borderRadius: 12, color: 'white', height: '3.5rem', fontSize: '125%'}}/>
                   
                    </form>
                </div>
            </>
        )
    }
    
}

export default Cadastroscreen;