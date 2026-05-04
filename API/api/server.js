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
            senha: req.body.senha
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

app.get('/duh', (req, res) => {
    res.send('duh uh');
})

app.listen(porta, () => {
    connectDB();
    console.log(`Servidor rodando em http://localhost:${porta}`);
});