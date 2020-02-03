module.exports = {
  // docs.sequelizejs.com - dialects
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'aproximepw',
  database: 'aproxime',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
