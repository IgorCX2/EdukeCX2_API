const { Sequelize } = require('sequelize');
const db = require('./db');
const CupomAtivos = db.define('logserros', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    idCupom:{
        type: Sequelize.STRING(35),
        allowNull: false,
    },
    userEspecifico:{
        type: Sequelize.INTEGER,
    },
    descricao:{
        type: Sequelize.STRING(35),
    },
    quantidade:{
        type: Sequelize.INTEGER,
        defaultValue: 1,
    },
    vencimentoHoras:{
        type: Sequelize.INTEGER,
        defaultValue: 12,
    },
    situacao:{
        type: Sequelize.ENUM,
        values: ['ABERTA', 'USADA', 'VENCIDA'],
        defaultValue: 'ABERTA',
    }
});
CupomAtivos.sync();
module.exports = CupomAtivos;