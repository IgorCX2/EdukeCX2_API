require('dotenv').config();
const bcrypt = require('bcryptjs/dist/bcrypt');
const cors = require('cors');
const createDOMPurify = require('dompurify');
const express = require('express');
var jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { JSDOM } = require('jsdom');
const { RateLimiterMemory } = require('rate-limiter-flexible');

const router = express.Router();
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'X-PINGOTHER, Content-Type, Authorization');
  res.header('x-forwarded-for', '*');
  router.use(cors());
  next();
});

router.post('/cadastrar', async (req, res) => {
    console.log("(Cadastrar) Iniciando o usuario")
    console.log(req.body)
    return res.json({
        status: `200`,
        msg: `sucesso`,
    });
});
module.exports = router;