import { DataTypes } from "sequelize";

export default (sequelize) => {
    const User = sequelize.define('User', {
        RM: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        senha: {
            type: DataTypes.STRING,
            allowNull: false
        },
        isCooking: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    }, {
        tableName: 'Usuario',
        timestamps: true
    });

    return User;
}