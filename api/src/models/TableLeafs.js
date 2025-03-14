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

  return Model;
};
