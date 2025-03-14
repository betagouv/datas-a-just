import { Op } from "sequelize";

export default (sequelizeInstance, Model) => {
  Model.sync = async (datasFilters, leafId) => {
    const ids = [];
    for (let i = 0; i < datasFilters.length; i++) {
      const { id, columnName, include, columnFilter, type } = datasFilters[i];
      const findElement = await Model.findOne({
        where: { column_name: columnName, leaf_id: leafId },
      });

      if (findElement) {
        await findElement.update({
          include: include,
          column_name: columnName,
          column_filter: columnFilter,
          type: type,
        });
        ids.push(id);
      } else {
        const newElement = await Model.create({
          leaf_id: leafId,
          include: include,
          column_name: columnName,
          column_filter: columnFilter,
          type: type,
        });
        ids.push(newElement.id);
      }
    }

    await Model.destroy({
      where: {
        leaf_id: leafId,
        id: {
          [Op.notIn]: ids,
        },
      },
    });
  };

  Model.listByLeafId = async (leafId) => {
    const list = await Model.findAll({
      where: { leaf_id: leafId },
      attributes: [
        "id",
        ["column_name", "columnName"],
        "include",
        ["column_filter", "columnFilter"],
        "type",
      ],
      raw: true,
    });

    for (let i = 0; i < list.length; i++) {
      const findElement = await Model.models.datasindex.findOne({
        where: { column_name: list[i].columnName },
      });
      list[i].label = findElement ? findElement.label : list[i].columnName;
    }

    return list;
  };

  Model.previewDatas = async (datasFilters) => {
    let allDatas = await Model.models.datasv1.findAll({
      raw: true,
    });
    for (let i = 0; i < datasFilters.length; i++) {
      const { columnName, include, columnFilter, type } = datasFilters[i];
      const findElement = await Model.models.datasindex.findOne({
        where: { column_name: columnName },
        raw: true,
      });

      if (findElement) {
        const realColumName = findElement.column_name;
        allDatas = allDatas.filter((data) => {
          const regex = new RegExp(columnFilter, "g");
          return regex.test(data[realColumName] || "");
        });
      }
    }

    return allDatas;
  };

  return Model;
};
