import { dbInstance } from "./index";

export default (sequelizeInstance, Model) => {
  Model.syncDataLine = async (header, datas) => {
    const allDatas = [];
    const cacheColumn = {};

    for (let i = 0; i < header.length; i++) {
      const key = header[i];

      if (key) {
        const findHeaderExist = await Model.findOne({
          where: { label: key },
          raw: true,
          logging: false,
        });
        if (findHeaderExist) {
          cacheColumn[key] = findHeaderExist.column_name;
        } else {
          const countHeader = await Model.count({
            logging: false,
          });
          dbInstance.options.logging = false;
          const newHeader = await Model.create({
            type: "string",
            label: key,
            column_name: "data_" + (countHeader + 1),
          });
          dbInstance.options.logging = true;
          cacheColumn[key] = newHeader.column_name;
        }
      }
    }

    for (let z = 0; z < datas.length; z++) {
      const prepareValues = {};
      const line = datas[z];
      //console.log("header", header);
      //console.log("line", line);

      for (let i = 0; i < header.length; i++) {
        const key = header[i];
        const value = line[i] || null;

        prepareValues[cacheColumn[key]] = value;
      }

      allDatas.push(prepareValues);
    }

    await Model.models.datasv1.bulkCreate(allDatas, {
      logging: false,
    });
  };

  Model.list = async () => {
    const list = await Model.findAll({
      attributes: ["id", "label", "type", ["column_name", "columnName"]],
    });

    return list;
  };

  Model.datasGrouped = async (columnName) => {
    const list = await Model.models.datasv1.findAll({
      attributes: [
        [columnName, "value"],
        [Model.sequelize.fn("COUNT", columnName), "count"],
      ],
      group: [columnName],
      raw: true,
    });

    for (let i = 0; i < list.length; i++) {
      const findToDoctionary = await Model.models.dictionaries.findOne({
        where: {
          code: list[i].value,
        },
        raw: true,
      });

      list[i].fullLabel = findToDoctionary ? findToDoctionary.label : "";
    }

    return list;
  };

  return Model;
};
