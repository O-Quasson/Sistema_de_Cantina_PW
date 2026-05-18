import express from 'express';
import cors from 'cors';
import { Sequelize } from 'sequelize';

import UserModel from './tabela/userModel.js';

const app = express();
const porta = 3000;

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite'
});

const User = UserModel(sequelize);

const connectDB = async () => {
    
    await sequelize.sync();

    await sequelize.authenticate();

    console.log("De blutu dwice is ridi tu pel");
};

app.use(express.json());
app.use(cors());

app.post('/cadastro', async (req, res) => {
    try{
        const dados = {
            RM: req.body.RM,
            email: req.body.email,
            senha: req.body.senha,
            isCooking: false
        }

        const userExiste = await User.findByPk(dados.RM);

        if(!userExiste){
            const userNovo = await User.create(dados);
            res.json({ mensagem: 'fizei gng', user: userNovo });
        }else{
            res.send('cai fora, doppelganger do caralho');
        }

    }catch(error){
        res.send('i guess bruh' + error);
    }
})

app.post('/loginA', async (req, res) => {
    try{

        const dados = {
            RM: req.body.RM,
            senha: req.body.senha
        }

        const procuraUser = await User.findByPk(dados.RM);

        if(!procuraUser){
            res.send('Usuário n existe, otário')
        }else{
            if(procuraUser.senha==dados.senha){
                res.send('tudo certo, pode entrar chefia');
            }else{
                res.send("OMAE WA... TOJI-KUN WANAI!")
            }
        }

    }catch(error){
        res.send('i guess bruh' + error)
    }
})

app.post('/loginF', async (req, res) => {
    try{

        const dados = {
            email: req.body.email,
            senha: req.body.senha
        }

        const procuraUser = await User.findByPk(dados.RM);

        if(!procuraUser){
            res.send("You don't think")
        }else{
            if((procuraUser.senha==dados.senha)&&(procuraUser.isCooking==true)){
                res.send('bem vinda e obrigado por seus serviços');
            }else{
                res.send("Tu não é tia da cantina. Estarei mandando um esquadrão de bombardeio para sua localização nesse exato momento")
            }
        }

    }catch(error){
        res.send('i guess bruh' + error)
    }
})

app.get('/duh', (req, res) => {
    res.send('duh uh');
})

app.listen(porta, () => {
    connectDB();
    console.log(`Servidor rodando em http://localhost:${porta}`);
});