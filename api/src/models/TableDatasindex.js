import { readdirSync, unlinkSync } from "fs";
import { getPathTmpDatas, getXMLTagName, getXMLTagValue } from "../utils/datas";
import lineByLine from "n-readlines";
import { dbInstance } from "./index";

export default (sequelizeInstance, Model) => {
  Model.syncDatas = async () => {
    console.time("SYNC NEW DATAS");
    console.log("SYNC NEW DATAS", getPathTmpDatas());

    const files = readdirSync(getPathTmpDatas()).filter(
      (f) => f.endsWith(".xml") || f.endsWith(".csv")
    );
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      console.time(file);
      console.log("file name", file);

      if (file.endsWith(".csv")) {
        let liner = new lineByLine(`${getPathTmpDatas()}/${file}`);
        let line = null;
        let header = null;
        while ((line = liner.next().toString()) !== "false") {
          const lineFormated = line.toString("ascii").trim();
          const lineSplited = lineFormated.split(",");
          if (!header) {
            header = ["file-name", ...lineSplited];
          } else {
            await Model.syncDataLine(header, [file, ...lineSplited]);
          }
        }
      } else if (file.endsWith(".xml")) {
        let headerMap = ["file-name"];
        // generate header

        let liner = new lineByLine(`${getPathTmpDatas()}/${file}`);
        let line;
        let nbLine = 0;
        let secondTag = "";
        let isEnd = false;

        // get header
        while ((line = liner.next()) !== false && !isEnd) {
          const lineFormated = line.toString("ascii").trim();

          if (nbLine === 2) {
            secondTag = getXMLTagName(lineFormated);
          } else if (`</${secondTag}>` === lineFormated) {
            isEnd = true;
          } else if (nbLine > 2) {
            const newTag = getXMLTagName(lineFormated);
            // merge all columns name
            if (headerMap.indexOf(newTag) === -1) {
              headerMap.push(newTag);
            }
          }

          nbLine++;
        }

        // complete file
        liner = new lineByLine(`${getPathTmpDatas()}/${file}`);
        let dataLines = headerMap.map(() => ""); // create empty map
        dataLines[0] = file;
        nbLine = 0;
        line;
        secondTag = "";
        while ((line = liner.next()) !== false) {
          const lineFormated = line.toString("ascii").trim();
          const tag = getXMLTagName(lineFormated);

          if (nbLine === 2) {
            secondTag = getXMLTagName(lineFormated);
          } else if (tag === secondTag) {
            secondTag = getXMLTagName(lineFormated);
            dataLines = headerMap.map(() => ""); // create empty map
          } else if (`</${secondTag}>` === lineFormated) {
            await Model.syncDataLine(headerMap, dataLines);
          } else if (nbLine > 2) {
            const index = headerMap.indexOf(tag);
            if (index !== -1) {
              dataLines[index] = getXMLTagValue(lineFormated);
            }
          }

          nbLine++;
        }
      }

      // remove file
      unlinkSync(`${getPathTmpDatas()}/${file}`);
      console.timeEnd(file);
    }

    console.timeEnd("SYNC NEW DATAS");
    // tests duration 8:35.003
    // S06_men_20250226-002025_RGC-TGI_f03.xml duration 26:00.000
  };

  Model.syncDataLine = async (header, line) => {
    const prepareValues = {};

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

    dbInstance.options.logging = false;
    await Model.models.datasv1.create(prepareValues);
    dbInstance.options.logging = true;
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

    return list;
  };

  setTimeout(() => {
    Model.syncDatas();
  }, 1000);

  return Model;
};
