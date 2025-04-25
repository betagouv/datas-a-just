import { Op } from "sequelize";
import { snakeToCamelObject } from "../utils/utils";

export default (sequelizeInstance, Model) => {
  Model.sync = async (leafs, branchId) => {
    const ids = [];
    for (let i = 0; i < leafs.length; i++) {
      const findConnection = await Model.findOne({
        where: {
          from_id_branch: branchId,
          to_id_leaf: leafs[i].id,
        },
        raw: true,
      });

      if (!findConnection) {
        const connection = await Model.create({
          from_id_branch: branchId,
          to_id_leaf: leafs[i].id,
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

  Model.listLeafs = async (branchId) => {
    const leafs = await Model.findAll({
      include: [
        {
          model: Model.models.leafs,
          as: "leaf",
          required: true,
        },
      ],
      where: {
        from_id_branch: branchId,
      },
    });

    for (let i = 0; i < leafs.length; i++) {
      leafs[i] = snakeToCamelObject(leafs[i].leaf.dataValues);
    }

    return leafs;
  };

  return Model;
};
