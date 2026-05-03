import express from 'express';
import cors from 'cors';

const app = express();
const porta = 3000;

app.use(express.json());
app.use(cors());

app.post('/post', (req, res) => {
    res.send('i guess');
})

app.get('/duh', (req, res) => {
    res.send('duh uh');
})

app.listen(porta, () => {
    console.log(`Servidor rodando em http://localhost:${porta}`);
});