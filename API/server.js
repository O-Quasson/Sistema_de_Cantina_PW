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

        const userExiste = await User.findOne({ where: { RM: dados.RM }});
        const emailExiste = await User.findOne({ where: { email: dados.email }});

        if(!userExiste){
            if(!emailExiste){
                const userNovo = await User.create(dados);
                res.status(201).send('fizei gng');
            }else{
                res.status(409).send('tu tem 2 email agora é, filho da puta?');
            }
        }else{
            res.status(409).send('cai fora, doppelganger do caralho');
        }

    }catch(error){
        res.status(500).send('i guess bruh' + error);
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
            res.status(404).send('Usuário n existe, otário')
        }else{
            if(procuraUser.senha==dados.senha){
                res.status(201).send('tudo certo, pode entrar chefia');
            }else{
                res.status(401).send("OMAE WA... TOJI-KUN WANAI!")
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

        const procuraUser = await User.findOne({ where: { email: dados.email }});

        if(!procuraUser){
            res.status(404).send("You don't think")
        }else{
            if((procuraUser.senha==dados.senha)&&(procuraUser.isCooking==true)){
                res.status(201).send('bem vindo(a) e obrigado por seus serviços');
            }else{
                res.status(401).send("Tu não é tia da cantina. Estarei mandando um esquadrão de bombardeio para sua localização nesse exato momento")
            }
        }

    }catch(error){
        res.status(500).send('i guess bruh' + error)
    }
})

app.get('/duh', (req, res) => {
    res.send('duh uh');
})

app.listen(porta, () => {
    connectDB();
    console.log(`Servidor rodando em http://localhost:${porta}`);
});