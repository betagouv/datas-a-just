import "dotenv/config";

module.exports = {
  /**
   * String pour préfixer le nom de l'environement (idéal pour les mails de test)
   */
  envName: "",
  /**
   * String pour préfixer le nom de l'environement (idéal pour les mails de test)
   */
  displayEnvName: "",
  /**
   * Url du serveur (idéal pour le contenu des mails)
   */
  serverUrl: process.env.SERVER_URL || "http://localhost:8081/api",
  /**
   * Url du cors
   */
  corsUrl: process.env.FRONT_URL || null,
  /**
   * Port utilisé pour démarrer le serveur
   */
  port: process.env.PORT || 8081,
  /**
   * Path de la base
   */
  database: {
    url: process.env.DATABASE_URL,
    logging: (msg) => console.log(msg),
    //logging: false,
  },
  /**
   * Code du cryptage JWT
   */
  jsonwebtoken: {
    private_key: process.env.JSON_WEB_TOKEN,
  },
};
