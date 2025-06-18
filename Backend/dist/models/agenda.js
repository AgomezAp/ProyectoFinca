"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Agenda = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
class Agenda extends sequelize_1.Model {
}
exports.Agenda = Agenda;
Agenda.init({
    Aid: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    correo: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        references: {
            model: "User",
            key: "correo",
        },
    },
    numero_documento: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        references: {
            model: "Paciente",
            key: "numero_documento",
        },
    },
    fecha_cita: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    hora_cita: {
        type: sequelize_1.DataTypes.TIME,
        allowNull: false,
    },
    estado: {
        type: sequelize_1.DataTypes.ENUM("Confirmada", "Cancelada", "Programada", "Pendiente"),
        defaultValue: "Pendiente",
        allowNull: false,
    },
    descripcion: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    duracion: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize: connection_1.default,
    tableName: "Agenda",
    timestamps: false,
});
