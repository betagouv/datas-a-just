import { readFileSync } from "fs";
const { XMLParser } = require("fast-xml-parser");

export default (sequelizeInstance, Model) => {
  Model.syncDictionary = async (file) => {
    const xml = readFileSync(file.filepath, "utf-8");
    const parser = new XMLParser();
    let jObj = parser.parse(xml);

    await Model.destroy({
      where: {},
      force: true,
    });

    for (let y = 0; y < jObj["ROWSET"]["ROW"].length; y++) {
      const row = jObj["ROWSET"]["ROW"][y];
      const findExist = await Model.findOne({
        where: {
          type: row["TYPE_NOMENC"],
          juridiction: row["TYPE_JURID"],
          code: row["CODE"] + "",
          label: row["LIBELLE"],
        },
      });

      if (!findExist) {
        await Model.create({
          type: row["TYPE_NOMENC"],
          juridiction: row["TYPE_JURID"],
          code: row["CODE"],
          label: row["LIBELLE"].replace(/  /g, " "),
        });
      }
    }
  };

  return Model;
};
