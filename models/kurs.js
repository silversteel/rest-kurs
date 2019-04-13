'use strict';
module.exports = (sequelize, DataTypes) => {
  const Kurs = sequelize.define('Kurs', {
    symbol: DataTypes.STRING,
    jual: DataTypes.STRING,
    beli: DataTypes.STRING,
    type: DataTypes.STRING,
    date: DataTypes.DATEONLY
  }, {});
  Kurs.associate = function(models) {
    // associations can be defined here
  };
  return Kurs;
};