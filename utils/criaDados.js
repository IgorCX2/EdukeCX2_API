async function criarDado(model, msg, infoId, emailUser, res, nome){
    try {
        await model.create({ id_user: infoId })
      } catch (error) {
        console.error(`ERRO 1_CD#0004 ${msg} de ${emailUser}: ${error}`)
        erroReporte('1_CD#004', emailUser, nome)
        return res.status(500).json({
          status: `1_CD#0004`,
          msg: `Não foi possivel criar o seu ${msg}, entre em contato com nossa equipe(você pode usar a plataforma normalmente)`,
        });
    }
}
module.exports = criarDado;