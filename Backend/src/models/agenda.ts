import { DataTypes, Model } from "sequelize";

import sequelize from "../database/connection";

export class Agenda extends Model {
  public Aid!: number;
  public nombre_completo!: string;
  public numero_documento!: string;
  public correo!: string;
  public Telefono!: string;
  public fecha_inicio!: Date;
  public fecha_fin!: Date;
  public estado!: "Confirmada" | "Cancelada" | "Programada";
  public descripcion!: string;
  public duracion!: number;
}
Agenda.init(
  {
    Aid: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    correo: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "User",
        key: "correo",
      },
    },
    numero_documento: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "Paciente",
        key: "numero_documento",
      },
    },

    fecha_cita: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    hora_cita: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    estado: {
      type: DataTypes.ENUM("Confirmada", "Cancelada", "Programada","Pendiente"),
      defaultValue: "Pendiente",
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    duracion: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "Agenda",
    timestamps: false,
  }
);


