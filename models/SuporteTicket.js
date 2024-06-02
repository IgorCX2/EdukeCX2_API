const { Sequelize } = require('sequelize');
const db = require('./db');
const SuporteTicket = db.define('logserros', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    contato:{
        type: Sequelize.STRING(50),
        allowNull: false
    },
    codigo:{
        type: Sequelize.STRING(10),
        allowNull: false,
    },
    descricao:{
        type: Sequelize.TEXT,
    },
    abertura:{
        type: Sequelize.ENUM,
        values: ['MAN', 'AUT'],
        allowNull: false,
    },
    situacao:{
        type: Sequelize.ENUM,
        values: ['ABERTA', 'FINALIZADA', 'ARQUIVADA', 'ATENDIDA', 'ATENDENDO'],
        defaultValue: 'ABERTA',
    }
});
SuporteTicket.sync();
module.exports = SuporteTicket;