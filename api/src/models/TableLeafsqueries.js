import { Op } from "sequelize";

export default (sequelizeInstance, Model) => {
  Model.sync = async (datasFilters, leafId, type) => {
    const ids = [];
    for (let i = 0; i < datasFilters.length; i++) {
      const { id, columnName, include, columnFilter } = datasFilters[i];
      const findElement = await Model.findOne({
        where: { column_name: columnName, leaf_id: leafId },
      });

      if (findElement) {
        await findElement.update({
          include: include,
          column_name: columnName,
          column_filter: columnFilter,
          type,
        });
        ids.push(id);
      } else {
        const newElement = await Model.create({
          leaf_id: leafId,
          include: include,
          column_name: columnName,
          column_filter: columnFilter,
          type,
        });
        ids.push(newElement.id);
      }
    }

    await Model.destroy({
      where: {
        leaf_id: leafId,
        type,
        id: {
          [Op.notIn]: ids,
        },
      },
    });
  };

  Model.listByLeafId = async (leafId, type = "", parentLeafQueryId = null) => {
    const list = await Model.findAll({
      where: { leaf_id: leafId, type, parent_leaf_query_id: parentLeafQueryId },
      attributes: [
        "id",
        ["column_name", "columnName"],
        "include",
        ["column_filter", "columnFilter"],
        "type",
        ["or_group", "orGroup"],
        ["parent_leaf_query_id", "parentLeafQueryId"],
      ],
      raw: true,
    });

    for (let i = 0; i < list.length; i++) {
      const findElement = await Model.models.datasindex.findOne({
        where: { column_name: list[i].columnName },
      });
      list[i].label = findElement ? findElement.label : list[i].columnName;
      const children = await Model.listByLeafId(leafId, type, list[i].id);
      if (children && children.length > 0) {
        list[i].children = children;
      }
    }

    return list;
  };

  Model.previewDatas = async (datasFilters, datasCounted) => {
    const andFilters = [];

    for (let i = 0; i < datasFilters.length; i++) {
      const { columnName, columnLabel, include, columnFilter, type } =
        datasFilters[i];
      const where = {};
      if (columnName) {
        where.column_name = columnName;
      }
      if (columnLabel) {
        where.label = columnLabel;
      }
      const findElement = await Model.models.datasindex.findOne({
        where,
        raw: true,
      });

      if (findElement) {
        const realColumName = findElement.column_name;
        andFilters[realColumName] = {
          [Op.regexp]: columnFilter,
        };
      }
    }

    const allDatas = await Model.models.datasv1.findAll({
      where: {
        ...andFilters,
      },
      raw: true,
    });

    let total = 0;
    if (datasCounted && datasCounted.length > 0) {
      for (let i = 0; i < datasCounted.length; i++) {
        const { columnName, columnLabel, include, columnFilter, type } =
          datasCounted[i];
        const where = {};
        if (columnName) {
          where.column_name = columnName;
        }
        if (columnLabel) {
          where.label = columnLabel;
        }
        const findElement = await Model.models.datasindex.findOne({
          where,
          raw: true,
        });

        if (findElement) {
          const realColumName = findElement.column_name;
          allDatas.forEach((element) => {
            const value = element[realColumName] ? +element[realColumName] : 0;
            if (value) {
              total += value;
            }
          });
        }
      }
    }

    return { lines: allDatas, total };
  };

  return Model;
};
