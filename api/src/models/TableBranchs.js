export default (sequelizeInstance, Model) => {
  Model.list = async (parentId = null) => {
    const options = {};
    if (parentId !== false) {
      options.parent_id = parentId;
    }

    const list = await Model.findAll({
      attributes: ["id", "name", ["alias_name", "aliasName"], "version"],
      where: {
        ...options,
      },
    });

    return list;
  };

  Model.getDetails = async (id) => {
    const details = await Model.findByPk(id, {
      attributes: ["id", "name", ["alias_name", "aliasName"], "version"],
      raw: true,
    });

    if (details) {
    }

    return details;
  };

  Model.update = async ({ id, name, aliasName }) => {
    let branch = await Model.findByPk(id);

    if (branch) {
      branch.name = name;
      branch.alias_name = aliasName;

      await branch.save();
    } else {
      branch = await Model.create({
        name,
        alias_name: aliasName,
      });
    }

    return branch;
  };

  return Model;
};
