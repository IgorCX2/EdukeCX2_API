const { Sequelize } = require('sequelize');
const db = require('./db');
const LogsErros = db.define('logserros', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    codigo:{
        type: Sequelize.STRING(10),
        allowNull: false,
    },
    contato:{
        type: Sequelize.STRING(50),
        allowNull: false
    }
});
LogsErros.sync();
module.exports = LogsErros;