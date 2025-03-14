export default (sequelizeInstance, Model) => {
  Model.list = async () => {
    const list = await Model.findAll({
      attributes: ["id", "name", ["alias_name", "aliasName"]],
    });

    return list;
  };

  Model.add = async ({ name }) => {
    return await Model.create({ name });
  };

  Model.getDetails = async (id) => {
    const details = await Model.findByPk(id, {
      attributes: ["id", "name", ["alias_name", "aliasName"]],
      raw: true,
    });

    if (details) {
      details.datasFilters = await Model.models.leafsqueries.listByLeafId(id);
    }

    return details;
  };

  Model.update = async ({ id, name, aliasName, datasFilters }) => {
    const leaf = await Model.findByPk(id);

    if (leaf) {
      leaf.name = name;
      leaf.alias_name = aliasName;

      await leaf.save();

      await Model.models.leafsqueries.sync(datasFilters, id);
    }

    return leaf;
  };

  Model.previewDatas = async ({ datasFilters }) => {
    return await Model.models.leafsqueries.previewDatas(datasFilters);
  };

  return Model;
};
