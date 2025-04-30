import "dotenv/config";

module.exports = {
  /**
   * Url du serveur (idéal pour le contenu des mails)
   */
  serverUrl: process.env.SERVER_URL || "http://localhost:8081/api",
};
