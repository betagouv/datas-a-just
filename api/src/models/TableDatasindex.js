import { dbInstance } from "./index";

export default (sequelizeInstance, Model) => {
  Model.syncDataLine = async (header, line) => {
    const prepareValues = {};
    //console.log("header", header);
    //console.log("line", line);

    for (let i = 0; i < header.length; i++) {
      const key = header[i];
      const value = line[i] || null;

      if (key) {
        const findHeaderExist = await Model.findOne({
          where: { label: key },
          raw: true,
          logging: false,
        });
        if (findHeaderExist) {
          prepareValues[findHeaderExist.column_name] = value;
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
          prepareValues[newHeader.column_name] = value;
        }
      }
    }

    await Model.models.datasv1.create(prepareValues);
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
