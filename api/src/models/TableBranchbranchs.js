import { Op } from "sequelize";
import { snakeToCamelObject } from "../utils/utils";

export default (sequelizeInstance, Model) => {
  Model.sync = async (branchs, branchId) => {
    const ids = [];
    for (let i = 0; i < branchs.length; i++) {
      const findConnection = await Model.findOne({
        where: {
          from_id_branch: branchId,
          to_id_branch: branchs[i].id,
        },
        raw: true,
      });

      if (!findConnection) {
        const connection = await Model.create({
          from_id_branch: branchId,
          to_id_branch: branchs[i].id,
        });
        ids.push(connection.id);
      } else {
        ids.push(findConnection.id);
      }
    }

    await Model.destroy({
      where: {
        from_id_branch: branchId,
        id: {
          [Op.notIn]: ids,
        },
      },
    });
  };

  Model.listBranchs = async (branchId) => {
    const branchs = await Model.findAll({
      where: {
        from_id_branch: branchId,
      },
      raw: true,
    });

    for (let i = 0; i < branchs.length; i++) {
      branchs[i] = await Model.models.branchs.getDetails(
        branchs[i].to_id_branch
      );
    }

    return branchs;
  };

  return Model;
};
