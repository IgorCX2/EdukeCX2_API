const { RateLimiterMemory } = require('rate-limiter-flexible');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const app = express();
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const contaRegistro = require('./api/contaRegistro');
app.use('/api/contaRegistro', contaRegistro);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Servidor iniciado na porta ${PORT}`));