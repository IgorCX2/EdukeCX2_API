const { EmailSuporteAuto } = require("../emails/EmailSuporteAutomatico");
const CupomAtivos = require("../models/CupomAtivos");
const LogsErros = require("../models/LogsErros");
const SuporteTicket = require("../models/SuporteTicket");

async function erroReporte(cod, userEmail, nome){
    try{
        const novoErro = await LogsErros.create({codigo: cod, contato: userEmail})
        if(nome) {
            try{
                const abrirSuporte = await SuporteTicket.create({codigo: cod, contato: userEmail, abertura: 'AUT'})
                const abrirCupom = await CupomAtivos.create({idCupom: abrirSuporte.id+nome, userEspecifico: userEmail})
                EmailSuporteAuto(userEmail, nome, abrirSuporte.id)
            }catch(error){
                console.error(`NÃO FOI POSSIVEL ABRIR SUPORTE PARA ${error} | ${cod} | ${userEmail}`)
            }
        }
    }catch(error){
        console.error(`NÃO FOI POSSIVEL ATUALIZAR OS ERROS: ${error} | ${cod} | ${userEmail}`)
    }
}
module.exports = erroReporte