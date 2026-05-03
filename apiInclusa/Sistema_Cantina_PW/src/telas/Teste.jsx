import React, { useState, useEffect } from "react";
import api from '../axios/api.js'

function TesteAPI() {
    let [dumb, setass] = useState('cum')

    const pega = () => {
        api.get('/duh')
            .then((resposta) => {setass(resposta.data)})
            .catch((erro) => {console.log('dumbass error: ' + erro)})
    };

    return(
        <>
            <button onClick={pega}>coiso api i guess</button>
            <p>{dumb}</p>
        </>
    )
}

export default TesteAPI;