import React, { useState, useEffect } from "react";
import api from '../axios/api.js'

function TesteAPI() {
    let [dumb, setass] = useState('cum')

    const pega = async() => {
        api.get('/duh')
            .then((resposta) => {setass(resposta.data)})
            .catch((erro) => {console.log('dumbass error: ' + erro)})
    };

    const envia = async(e) => {

        e.preventDefault();

        let form = new FormData(e.target);

        if(Object.fromEntries(form.entries()).senha!=Object.fromEntries(form.entries()).Csenha){
            alert("sulfuric acid");
        }else{

            const dados = {
                RM: Object.fromEntries(form.entries()).RM,
                email: Object.fromEntries(form.entries()).email,
                senha: Object.fromEntries(form.entries()).senha
            }

            api.post('/cadastro', dados)
            alert('GG ez gng');
            console.log(dados)
        }
    }

    return(
        <>
            <button onClick={pega}>coiso api i guess</button>
            <p style={{marginBottom: 20}}>{dumb}</p>

            <form onSubmit={envia}>
                <label for='RM'>RM</label>
                <input id='RM' name='RM'></input>

                <label for='email'>email</label>
                <input id='email' name='email'></input>

                <label for='senha'>senha</label>
                <input id='senha' name='senha'></input>

                <label for='Csenha'>Csenha</label>
                <input id='Csenha' name='Csenha'></input>

                <input type="submit"></input>
            </form>
        </>
    )
}

export default TesteAPI;