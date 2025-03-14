import { snakeToCamelObject } from "../utils/utils";
import config from "config";
import { comparePasswords, cryptPassword } from "../utils/password/password";
import { differenceInMinutes } from "date-fns";
import { Op } from "sequelize";

/**
 * Table des utilisateurs
 */

export default (sequelizeInstance, Model) => {
  /**
   * Control des connection avec les règles de blockages pour les users et admin
   */
  Model.tryConnection = async (email, password, roles, andNull = false) => {
    email = (email || "").toLowerCase();
    const cleanUser = async (user) => {
      await user.update({
        nb_try_connection: null,
        first_try_connection: null,
      });
      user.dataValues.nb_try_connection = null;
      user.dataValues.first_try_connection = null;
      return user;
    };

    let options = { role: roles };
    if (andNull) {
      options = {
        [Op.or]: [
          {
            role: roles,
          },
          {
            role: { [Op.eq]: null },
          },
        ],
      };
    }

    let user = await Model.findOne({ where: { email, ...options } });
    if (user) {
      if (user.dataValues.status === 0) {
        return "Votre compte n'est plus accessible.";
      }

      if (user.dataValues.first_try_connection) {
        const now = new Date();
        const tryDate = new Date(user.dataValues.first_try_connection);
        let nbMinutes = differenceInMinutes(now, tryDate);

        if (nbMinutes >= config.securities.users.delaiAboutLockConnection) {
          user = await cleanUser(user);
        }
      }

      if (
        (user.dataValues.nb_try_connection || 0) >=
        config.securities.users.nbMaxTryConnection
      ) {
        const now = new Date();
        const tryDate = new Date(user.dataValues.first_try_connection);
        let nbMinutes = differenceInMinutes(now, tryDate);

        return `Votre compte est bloqué ! Vous devez attendre ${config.securities.users.delaiAboutLockConnection - nbMinutes} minutes pour vous reconnecter.`;
      }

      if (comparePasswords(password, user.dataValues.password)) {
        delete user.dataValues.password;
        user = await cleanUser(user);

        return user.dataValues;
      } else {
        // add to try connection
        const totalTryConnection = (user.dataValues.nb_try_connection || 0) + 1;
        user.update({
          nb_try_connection: totalTryConnection,
          first_try_connection:
            user.dataValues.first_try_connection || new Date(),
        });
        if (
          totalTryConnection / config.securities.users.nbMaxTryConnection <
          0.3
        ) {
          return "Email ou mot de passe incorrect.";
        } else {
          return `Email ou mot de passe incorrect. Essai ${totalTryConnection}/${config.securities.users.nbMaxTryConnection}`;
        }
      }
    }

    return "Email ou mot de passe incorrect";
  };

  /**
   * Change user password
   * @param {*} userId
   * @param {*} password
   * @returns
   */
  Model.updatePassword = async (userId, password, email) => {
    password = cryptPassword(password, email);

    return await Model.updateById(userId, {
      new_password_token: null,
      password,
    });
  };

  /**
   * Retourne les informations d'un utilisateur
   * @param {*} userId
   * @returns
   */
  Model.userPreview = async (userId) => {
    const user = await Model.findOne({
      attributes: ["email", "first_name", "last_name", "role", "id"],
      where: { id: userId },
      raw: true,
    });

    if (user) {
      user.access = await Model.models.UsersAccess.getUserAccess(userId);
      return snakeToCamelObject(user);
    }

    return null;
  };

  /**
   * Retourne les informations d'un utilisateur via l'email
   * @param {*} userId
   * @returns
   */
  Model.userPreviewWithEmail = async (userEmail) => {
    const user = await Model.findOne({
      attributes: ["id", "email", "first_name", "last_name", "role"],
      where: { email: userEmail },
      raw: true,
    });

    if (user) {
      user.access = await Model.models.UsersAccess.getUserAccess(user.id);
      return snakeToCamelObject(user);
    }

    return null;
  };

  /**
   * Crée un compte utilisateur
   * @param {*} param0
   */
  Model.createAccount = async ({
    email,
    password,
    firstName,
    lastName,
    tj,
    fonction,
  }) => {
    const user = await Model.findOne({ where: { email } });

    if (!user) {
      if (password) {
        password = cryptPassword(password, email);
      }

      return await Model.create({
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        tj,
        fonction,
        status: 1,
      });
    } else {
      throw 'Un compte existe déjà avec cet e-mail. Si vous avez oublié votre mot de passe, allez dans la section “Se connecter” et cliquez sur “Mot de passe oublié".';
    }
  };

  /**
   * Supprimer un compte utilisateur
   * @params {*} param0
   */
  Model.removeAccount = async (userId, options = {}) => {
    const user = await Model.findOne({
      where: {
        id: userId,
      },
    });

    if (user) {
      return await Model.destroyById(userId, options);
    }

    return null;
  };

  /**
   * Retourne la liste des tous les utilisateurs
   * @returns
   */
  Model.getAll = async () => {
    const list = await Model.findAll({
      attributes: [
        "id",
        "email",
        ["first_name", "firstName"],
        ["last_name", "lastName"],
        "role",
        "tj",
        "fonction",
      ],
      raw: true,
    });

    return list;
  };

  /**
   * Mise à jour des informations utilisateurs et informer en cas de changement d'attribution
   * @param {*} param0
   */
  Model.updateAccount = async ({ userId, access, ventilations }) => {
    const user = await Model.findOne({
      where: {
        id: userId,
      },
      raw: true,
    });

    if (!user) {
      throw "User not found";
    }
  };

  return Model;
};
