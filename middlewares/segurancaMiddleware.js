const { RateLimiterMemory } = require('rate-limiter-flexible');
const whitelistMiddleware = [];
const maxAttempts = 10;
const windowMs = 180000;
const limiterLoginWronger = new RateLimiterMemory({
  points: maxAttempts,
  duration: windowMs / 1000,
});
async function MiddlewareSeguranca(req, res, next) {
  console.log(`Tipo de requisição para ${req.path}: ${req.method} (${req.headers['x-forwarded-for']})`);
  if(whitelistMiddleware.indexOf(req.path) !== -1 || req.method === "GET") {
    return next();
  }
  try{
    const clientIP = req.headers['x-forwarded-for'];
    await limiterLoginWronger.consume(clientIP);
    req.body.seguranca = {}
    req.body.seguranca.endereco = "clientIP12314564";
    return next(); 
  }catch (error) {
    console.error(`Limite exedido para: ${req.headers['x-forwarded-for'] || req.connection.remoteAddress}:`, error);
    return res.status(429).json({
      status: '1_EN#0003',
      msg: 'Sua conta está temporariamente bloqueada. Por favor, aguarde 3 minutos antes de tentar novamente. Isso aconteceu pois você tentou realizar muitas solicitações em pouco tempo.',
    });
  }
}
module.exports = MiddlewareSeguranca;