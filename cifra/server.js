require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const usuarioRoutes = require('./routes/usuarioRoutes');
const receitaRoutes = require('./routes/receitaRoutes');
const despesaRoutes = require('./routes/despesaRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/usuarios', usuarioRoutes);
app.use('/receitas', receitaRoutes);
app.use('/despesas', despesaRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Servidor rodando na porta ${PORT}`));