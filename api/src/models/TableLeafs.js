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
      details.datasFilters = await Model.models.leafsqueries.listByLeafId(
        id,
        "filter"
      );
      details.datasCounted = await Model.models.leafsqueries.listByLeafId(
        id,
        "counted"
      );
    }

    return details;
  };

  Model.update = async ({
    id,
    name,
    aliasName,
    datasFilters,
    datasCounted,
  }) => {
    const leaf = await Model.findByPk(id);

    if (leaf) {
      leaf.name = name;
      leaf.alias_name = aliasName;

      await leaf.save();

      await Model.models.leafsqueries.sync(datasFilters || [], id, "filter");
      await Model.models.leafsqueries.sync(datasCounted || [], id, "counted");
    }

    return leaf;
  };

  Model.previewDatas = async ({ datasFilters, datasCounted }) => {
    return await Model.models.leafsqueries.previewDatas(
      datasFilters,
      datasCounted
    );
  };

  return Model;
};
