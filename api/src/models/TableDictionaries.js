import { readdirSync, readFileSync, unlinkSync } from "fs";
import { getPathTmpDatas } from "../utils/datas";
const { XMLParser } = require("fast-xml-parser");

export default (sequelizeInstance, Model) => {
  Model.syncDatas = async () => {
    const files = readdirSync(getPathTmpDatas()).filter(
      (f) => f.endsWith(".xml") && f.includes("NOMENC")
    );
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      console.time(file);
      console.log("file name", file);

      const xml = readFileSync(`${getPathTmpDatas()}/${file}`, "utf-8");
      const parser = new XMLParser();
      let jObj = parser.parse(xml);

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

      // remove file
      unlinkSync(`${getPathTmpDatas()}/${file}`);
      console.timeEnd(file);
    }
  };

  return Model;
};
