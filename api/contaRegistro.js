require('dotenv').config();
const bcrypt = require('bcryptjs/dist/bcrypt');
const cors = require('cors');
const createDOMPurify = require('dompurify');
const express = require('express');
var jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { JSDOM } = require('jsdom');
const { RateLimiterMemory } = require('rate-limiter-flexible');

const UserConfig = require('../models/UserConfig');
const criarDado = require('../utils/criaDados');
const UserInfo = require('../models/UserInfo');
const { EnviarEmailInicial } = require('../emails/EmailInicial');
const { default: erroReporte } = require('../utils/errorRegistro');
const { EnviarEmailAlerta } = require('../emails/EmailAlerta');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const { where } = require('sequelize');
const router = express.Router();
router.use(express.urlencoded({ extended: true }));
router.use(express.json());
router.use(cookieParser());

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

const maxAttempts = 3;
const windowMs = 300000;
const limiterLoginWronger = new RateLimiterMemory({
  points: maxAttempts,
  duration: windowMs,
});
function Codigo(tipo, user) {
  var stringCodigo = `${tipo}&${user}&`;
  const tamanhos = [8, 6, 6]
  var caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz056789';
  for (var i = 0; i < tamanhos[Number(tipo)]; i++) {
    stringCodigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return (stringCodigo)
}
router.post('/cadastrar', [body('seguranca.endereco').trim().notEmpty().isLength({ min: 10}).withMessage('Você não esta passando o ip para o servidor'),body('dados.email').trim().isEmail().withMessage('Email inválido'), body('dados.senha').trim().isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres'),body('dados.nome').trim().isLength({ min: 3 }).withMessage('O nome deve ter pelo menos 3 caracteres'),body('dados.escolaridade').trim().isLength({ min: 7, max: 7}).withMessage('Você deve informar a sua escolaridade corretamente')],async (req, res) => {
  console.log("(Cadastrar) Iniciando o cadastro do usuario"+ req.body.dados.email)
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ msg: errors.errors[0].msg });
  }
  const sanitizedData = {
    dados: {
      nome: DOMPurify.sanitize(req.body.dados.nome),
      email: DOMPurify.sanitize(req.body.dados.email),
      senha: DOMPurify.sanitize(req.body.dados.senha),
      escolaridade: DOMPurify.sanitize(req.body.dados.escolaridade),
      endereco: DOMPurify.sanitize(req.body.seguranca.endereco)
    }
  };
  try{
    const validarUsuario = await UserConfig.findOne({
      where: {
        email: sanitizedData.dados.email
      }
    })
    if(!validarUsuario){
      sanitizedData.dados.senha = await bcrypt.hash(sanitizedData.dados.senha, 8)
      sanitizedData.dados.endereco = await bcrypt.hash(sanitizedData.dados.endereco, 8)
      sanitizedData.dados.stats = '4'
      try{
        const novoUsuario = await UserConfig.create(sanitizedData.dados)
        await criarDado(UserInfo, 'banco de informações', novoUsuario.id, sanitizedData.dados.email, res, sanitizedData.dados.nome)
        EnviarEmailInicial(sanitizedData.dados.email, sanitizedData.dados.nome)
        console.log(`(Cadastrar) Usuario ${sanitizedData.dados.email} Cadastrado`)
        return res.status(200);
      }catch(error){
        console.error(`ERRO 1_CD#003 de ${sanitizedData.dados.email}: ${error}`)
        erroReporte('1_CD#003', sanitizedData.dados.email)
        return res.status(500).json({
          status: `1_CD#003`,
          msg: `Não foi possível criar o seu usuário. Por favor, tente novamente. Se o problema persistir, entre em contato com o nosso suporte.`,
        });
      }
    }else{
      return res.status(409).json({
        status: `1_CD#002`,
        msg: `O email informado já está cadastrado em nossos bancos de dados`,
      });
    }
  }catch(error){
    console.error(`ERRO 1_CD#001 de ${sanitizedData.dados.email}: ${error}`);
    erroReporte('1_CD#001', sanitizedData.dados.email)
    return res.status(500).json({
      status: '1_CD#001',
      msg: `Não foi possível conectar ao banco de dados`,
    });
  }
});
router.post('/login', [body('seguranca.endereco').trim().notEmpty().isLength({ min: 10}).withMessage('Você não esta passando o ip para o servidor'),body('dados.email').trim().isEmail().withMessage('Email inválido'), body('dados.senha').trim().isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres')],async (req, res) => {
  console.log("(Login) Entrando o usuario"+ req.body.dados.email)
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ msg: errors.errors[0].msg });
  }
  const sanitizedData = {
    dados: {
      nome: DOMPurify.sanitize(req.body.dados.nome),
      email: DOMPurify.sanitize(req.body.dados.email),
      senha: DOMPurify.sanitize(req.body.dados.senha),
      escolaridade: DOMPurify.sanitize(req.body.dados.escolaridade),
      endereco: DOMPurify.sanitize(req.body.seguranca.endereco)
    }
  };
  try{
    const validarUsuario = await UserConfig.findOne({
      where: {
        email: sanitizedData.dados.email
      }
    })
    if(validarUsuario){
      if(await bcrypt.compare(sanitizedData.dados.senha, validarUsuario.senha)){
        const diferencaData = (new Date(validarUsuario.updatedAt) - new Date()) / (1000 * 60 * 60 * 24)*(-1)
        if((validarUsuario.stats[0] == '4' || validarUsuario.stats[0] == '2' || validarUsuario.stats[0] == '1') ||  diferencaData > 15 || ( !bcrypt.compare(sanitizedData.dados.endereco, validarUsuario.endereco) && diferencaData > 1)){
          if(validarUsuario.stats[0] == '2'){
            console.log(`(Entrar) O ${sanitizedData.dados.email} lembrou da senha`)
            try{
              EnviarEmailAlerta(sanitizedData.dados.email, '2')
            }catch(error){
              console.error(`(Entrar) Erro ao enviar para ${sanitizedData.dados.email} o email de lembrou a senha: ${error}`)
            }
          }
          const newCodigo = Codigo(1, validarUsuario.id)
          try{
            EnviarEmailAlerta(sanitizedData.dados.email, '3', newCodigo)
            UserConfig.update(
              { endereco: await bcrypt.hash(sanitizedData.dados.endereco, 8), stats: newCodigo},
              { where: { id: validarUsuario.id} }
            )
            return res.status(200).json({
              status: `verificar`,
              id: validarUsuario.id
            });
          }catch(error){
            console.error(`ERRO 1_CD#0006 de ${sanitizedData.dados.email}: ${error}`);
            return res.status(500).json({
              status: `1_EN#0006`,
              msg: `Erro de atualização, tente realizar o login novamente`,
            });
          }
        }
        console.log(`o ${sanitizedData.dados.email} está logado`)
        var token = jwt.sign({id: validarUsuario.id, nome: validarUsuario.nome, plano: validarUsuario.plano}, process.env.Chave_Json)
        res.cookie('authToken', token, {
            httpOnly: true, // Mais seguro, pois o cookie não é acessível via JavaScript
            secure: true,   // Define como true se estiver usando HTTPS
            maxAge: 24 * 60 * 60 * 1000 // 24 horas
        });
        return res.status(200).json({
          status: `200`,
          token: token,
        });
      }else{
        try{
          const rateLimeterLogin = await limiterLoginWronger.consume(sanitizedData.dados.email)
          return res.status(409).json({
            status: `1_EN#0004`,
            msg: `Senha incorreta. Por favor, verifique suas credenciais.`,
          });
        }catch(error){
          EnviarEmailAlerta(sanitizedData.dados.email, '0')
          console.error(`ERRO 1_EN#0003 de ${sanitizedData.dados.email}: ${error}`);
          return res.status(429).json({
            status: '1_EN#0003',
            msg: 'Você excedeu o limite de tentativas de senha incorreta (mais de 3 vezes). Sua conta está temporariamente bloqueada. Por favor, aguarde 3 minutos antes de tentar novamente ou redefina sua senha.',
          });
        }
      }
    }
    return res.status(409).json({
      status: `1_EN#0002`,
      msg: `Erro, nenhum usuario com este email foi encontrado`,
    });
  }catch(error){
    console.error(`ERRO 1_EN#0001 de ${sanitizedData.dados.email}: ${error}`);
    erroReporte('1_EN#0001', sanitizedData.dados.email)
    return res.status(500).json({
      status: '1_EN#0001',
      msg: `Não foi possível conectar ao banco de dados`,
    });
  }
});
router.post('/validar', [body('seguranca.endereco').trim().notEmpty().isLength({ min: 10}).withMessage('Você não esta passando o ip para o servidor'),body('id').trim().isNumeric().withMessage('Id errado'),body('codigo.a').trim().isLength({ max: 1 }).withMessage('tem muitos digitos!'),body('codigo.b').trim().isLength({ max: 1 }).withMessage('tem muitos digitos!'),body('codigo.c').trim().isLength({ max: 1 }).withMessage('tem muitos digitos!'),body('codigo.d').trim().isLength({ max: 1 }).withMessage('tem muitos digitos!'),body('codigo.e').trim().isLength({ max: 1 }).withMessage('tem muitos digitos!'),body('codigo.f').trim().isLength({ max: 1 }).withMessage('tem muitos digitos!')], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ msg: errors.errors[0].msg });
  }
  const sanitizedData = {
    a: DOMPurify.sanitize(req.body.codigo.a),
    b: DOMPurify.sanitize(req.body.codigo.b),
    c: DOMPurify.sanitize(req.body.codigo.c),
    d: DOMPurify.sanitize(req.body.codigo.d),
    e: DOMPurify.sanitize(req.body.codigo.e),
    f: DOMPurify.sanitize(req.body.codigo.f),
    id: DOMPurify.sanitize(req.body.id)
  };
  try{
    const validarUsuario = await UserConfig.findOne({
      where:{
        id: sanitizedData.id
      }
    })
    if(validarUsuario){
      if(validarUsuario.stats[0] != "1"){
        console.log(`O usuario ${validarUsuario.email} tentou fazer uma validação com o status ${validarUsuario.stats} ativo`)
        var token = jwt.sign({id: validarUsuario.id, nome: validarUsuario.nome, plano: validarUsuario.plano}, process.env.Chave_Json)
        return res.status(200).json({
          status: "200",
          token: token
        })
      }
      const codValidar = validarUsuario.stats.split('&')[2].toString().toUpperCase()
      const codDigitado = sanitizedData.a+sanitizedData.b+sanitizedData.c+sanitizedData.d+sanitizedData.e+sanitizedData.f
      if(codValidar == codDigitado.toUpperCase()){
        try{
          UserConfig.update(
            {stats: "0"},
            {where: {id: req.body.id}}
          )
          var token = jwt.sign({id: validarUsuario.id, nome: validarUsuario.nome, plano: validarUsuario.plano}, process.env.Chave_Json)
          console.log(`O usuario ${validarUsuario.email} validou o login com sucesso`)
          return res.status(200).json({
            status: "200",
            token: token
          })
        }catch(error){
          console.error(`ERRO 1_VA#0003 de ${validarUsuario.email}: ${error}`);
          return res.status(500).json({
            status: `1_VA#0003`,
            msg: `Refaça o login novamente, não conseguimos atualizar o nosso banco de dados`,
          });
        }
      }
      try{
        const rateLimeterLogin = await limiterLoginWronger.consume(validarUsuario.email)
        return res.status(409).json({
          id: validarUsuario.id,
          status: `verificar`,
          msg: `Ops, código digitado é inválido. Por favor, verifique se há erros ou refaça o login.`,
        });
      }catch(error){
        EnviarEmailAlerta(validarUsuario.email, '0')
        console.error(`ERRO 1_EN#0003 de ${validarUsuario.email}: ${error}`);
        return res.status(429).json({
          status: '1_EN#0003',
          msg: 'Você excedeu o limite de tentativas de codigo incorreto(mais de 3 vezes). Sua conta está temporariamente bloqueada. Por favor, aguarde 3 minutos antes de tentar novamente',
        });
      }
    }
    return res.status(409).json({
      status: `1_VA#0002`,
      msg: `Erro, nenhum usuario foi encontrado, tente atualizar a pagina`,
    });
  }catch(error){
    return res.status(500).json({
      status: '1_VA#0001',
      msg: `Não foi possível conectar ao banco de dados`,
    });
  }
});
router.post('/solicitacao-recuperacao', [body('seguranca.endereco').trim().notEmpty().isLength({ min: 10}).withMessage('Você não esta passando o ip para o servidor'),body('dados').trim().isEmail().withMessage('Email inválido')], async (req, res) => {
  console.log(`O usuario ${req.body.dados} esta pedindo para recuperar a senha`)
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ msg: errors.errors[0].msg });
  }
  const sanitizedData = {
    email: DOMPurify.sanitize(req.body.dados),
  };
  try{
    const validarUsuario = await UserConfig.findOne({
      where:{
        email: sanitizedData.email
      }
    })
    if(validarUsuario){
      try{
        const rateLimeterLogin = await limiterLoginWronger.consume(validarUsuario.email)
        try{
          const codigoEmail = Codigo(2, validarUsuario.id)
          EnviarEmailAlerta(sanitizedData.email, '1', codigoEmail)
          UserConfig.update(
            {stats: codigoEmail},
            {where:{id: validarUsuario.id}}
          )
          return res.status(200).json({status: "200"});
        }catch(error){
          console.error(`ERRO 1_RS#0003 de ${sanitizedData.dados.email}: ${error}`);
          erroReporte('1_CD#001', sanitizedData.dados.email)
          return res.status(500).json({
            status: ``,
            msg: `Não conseguimos realizar esta operação, tenta mais tarde`,
          });
        }
      }catch(error){
        EnviarEmailAlerta(validarUsuario.email, '0')
        console.error(`ERRO 1_RS#0003 de ${validarUsuario.email}: ${error}`);
        return res.status(429).json({
          status: '1_RS#0003',
          msg: 'Você excedeu o limite de tentativas de recuperar a senha(mais de 3 vezes). Sua conta está temporariamente bloqueada. Por favor, aguarde 3 minutos antes de tentar novamente',
        });
      }
    }
    return res.status(409).json({
      status: `1_RS#0002`,
      msg: `Erro, nenhum usuario com este email encontrado`,
    });
  }catch(error){
    console.error(`ERRO 1_RS#0001 de ${sanitizedData.dados.email}: ${error}`);
    erroReporte('1_RS#0001', sanitizedData.dados.email)
    return res.status(500).json({
      status: '1_RS#0001',
      msg: `Não foi possível conectar ao banco de dados, tente novamente!`,
    });
  }
});
router.post('/nova-senha', [body('seguranca.endereco').trim().notEmpty().isLength({ min: 10}).withMessage('Você não esta passando o ip para o servidor'),body('cod').trim().isLength({ min: 13 }).withMessage('A codigo esta incorreto'),body('dados').trim().isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres')], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ msg: errors.errors[0].msg });
  }
  const sanitizedData = {
    cod: DOMPurify.sanitize(req.body.cod),
    senha:  DOMPurify.sanitize(req.body.dados),
  };
  const verificarCodigo = sanitizedData.cod.split("%26")
  if(verificarCodigo[0] != "2" && verificarCodigo[2].length != 8){
    return res.status(409).json({
      msg: "Link informado esta incorreto"
    })
  }
  try{
    const validarUsuario = await UserConfig.findOne({
      where:{ id: verificarCodigo[1], stats: verificarCodigo.join('&')}
    })
    if(validarUsuario){
      if(await bcrypt.compare(sanitizedData.senha, validarUsuario.senha)){
        return res.status(409).json({
          status: `1_NV#0003`,
          msg: `Você não pode utilizar a mesma senha já cadastrada!`,
        });
      }
      try{
        UserConfig.update(
          {stats: '0', senha:  await bcrypt.hash(sanitizedData.senha, 8)},
          {where:{id: verificarCodigo[1]}}
        )
        return res.json({
          status: `200`,
          msg: `sucesso`,
        });
      }catch(error){
        console.error(`ERRO 1_RS#0005 de ${validarUsuario.email}: ${error}`);
        erroReporte('1_RS#0005', validarUsuario.email)
        return res.status(500).json({
          status: `1_RS#0005`,
          msg: `refaça o login novamente, não conseguimos atualizar o nosso banco de dados`,
        });
      }
    }
    return res.status(409).json({
      status: `1_NV#0002`,
      msg: `Não conseguimos localizar este codigo, por favor verifique erros de digitação ou tente pedir um novo link`,
    });
  }catch(error){
    console.error(`ERRO 1_NS#0001`);
    return res.status(500).json({
      status: '1_NV#0001',
      msg: `Não foi possível conectar ao banco de dados, tente novamente!`,
    });
  }
});
module.exports = router;