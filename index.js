const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const fs = require('fs');
const https = require('https');
const { RateLimiterMemory } = require('rate-limiter-flexible');
const MiddlewareSeguranca = require('./middlewares/segurancaMiddleware');
const app = express();
const whitelist = ['http://localhost:3000', 'https://aprendacomeduke.com.br'];

app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      "script-src": ["'self'", "http://localhost:3000"],
    },
  },
  frameguard: { action: 'deny' },
  hsts: { maxAge: 31536000, includeSubDomains: true },
  xssFilter: true,
  noSniff: true,
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log(`Origin not allowed by CORS policy: ${origin}`);
        callback(new Error('Acesso negado pela política!'));
      }
    },
  })
);

app.use(MiddlewareSeguranca);

app.use('/api/contaRegistro', require('./api/contaRegistro'));


const PORT = 8080;

// const privateKey = fs.readFileSync('/etc/letsencrypt/archive/api.aprendacomeduke.com.br/privkey1.pem', 'utf8');
// const certificate = fs.readFileSync('/etc/letsencrypt/archive/api.aprendacomeduke.com.br/fullchain1.pem', 'utf8');
// const credentials = { key: privateKey, cert: certificate };

// const httpsServer = https.createServer(credentials, app);

// httpsServer.listen(PORT, () => {
//   console.log(`Servidor HTTPS iniciado na porta ${PORT}`);
// });

app.listen(PORT, () => console.log(`Servidor iniciado na porta ${PORT}`));