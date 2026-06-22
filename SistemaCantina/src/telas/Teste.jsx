import React, { useState, useEffect } from "react";
import api from '../axios/api.js'
import Cookies from 'js-cookie'

function TesteAPI() {
    let [dumb, setass] = useState('cum');
    let [escolha, setescolha] = useState('aluno');

    const pega = async() => {
        api.get('/duh')
            .then((resposta) => {setass(resposta.data)})
            .catch((erro) => {console.log('dumbass error: ' + erro)})
    };

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

                if(data.status==200){
                    Cookies.set('logado', {logado: true, admin: 'twin'}, {expires: 1/720});
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

                if(data.status==200){
                    Cookies.set('logado', {logado: true, admin: 'twin'}, {expires: 1/720});
                }
            })

    }

    function Larp(){
        if(escolha=="aluno"){
            return(
                <form onSubmit={loginA}>
                    <label for="RM">RM</label>
                    <input id="RM" name="RM"></input>

                    <label for="senha">senha</label>
                    <input id="senha" name="senha"></input>

                    <input type="submit"></input>
                </form>
            )
        }else if(escolha=="func"){
            return(
                <form onSubmit={loginF}>
                    <label for="email">Email</label>
                    <input id="email" name="email" type="email"></input>

                    <label for="senha">senha</label>
                    <input id="senha" name="senha"></input>

                    <input type="submit"></input>
                </form>
            )
        }
    }

    function bahh(){

        let turu = Cookies.get('logado');
        if(turu.logado==true){
            return(
                <img src="https://media.tenor.com/wuvUII8rKY0AAAAM/to-online-to.gif"></img>
            )
        }else{
            return(
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZ4VIE2iyw4NMpr0jKXYfZXBJCP5rk7xO02Etus-sOvw&s"></img>
            )
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
            <br />

            <label for='escolha' />
            <select name='escolha' id='escolha' defaultValue={'aluno'} onChange={(e) => setescolha(e.target.value)}>
                <option value="aluno">Betinha</option>x
                <option value="func">Cozinheiro Sigma e Chad</option>
            </select>

            {Larp()}

            {bahh()}
        </>
    )
}

export default TesteAPI;