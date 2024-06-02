const { Sequelize } = require('sequelize');
const db = require('./db');
const UserConfig = db.define('userconfig', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nome:{
        type: Sequelize.STRING(20),
        allowNull: false
    },
    email:{
        type: Sequelize.STRING(50),
        allowNull: false
    },
    senha:{
        type: Sequelize.STRING(60),
        allowNull: false
    },
    endereco:{
        type: Sequelize.STRING(60),
        allowNull: false
    },
    escolaridade:{
        type: Sequelize.STRING(8),
        allowNull: false
    },
    stats:{
        type: Sequelize.STRING(10),
        defaultValue: '0',
    },
    skin:{
        type: Sequelize.STRING(60),
    },
});
UserConfig.sync({ alter: true });
module.exports = UserConfig;