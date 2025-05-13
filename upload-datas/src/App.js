import { getPathTmpDatas, getXMLTagName, getXMLTagValue } from "./utils/datas";
import lineByLine from "n-readlines";
import { readdirSync, unlinkSync } from "fs";
import { pushDatas } from "./utils/axios";
import { migrationAllOfDatabase } from "./utils/database";

const NB_LINES = 100000;

export default class App {
  constructor() {}

  async start() {
    await this.migrateDatas();
  }

  migrateDatas = async () => {
    await migrationAllOfDatabase({
      from: {
        user: process.env.OLD_SERVER_USER,
        url: process.env.OLD_SERVER_URL,
        port: process.env.OLD_SERVER_PORT,
        db: process.env.OLD_SERVER_DB,
        password: process.env.OLD_SERVER_PASSWORD,
      },
      to: {
        user: process.env.NEW_SERVER_USER,
        url: process.env.NEW_SERVER_URL,
        port: process.env.NEW_SERVER_PORT,
        db: process.env.NEW_SERVER_DB,
        password: process.env.NEW_SERVER_PASSWORD,
      },
    });

    await this.syncDatas();

    await migrationAllOfDatabase({
      from: {
        user: process.env.NEW_SERVER_USER,
        url: process.env.NEW_SERVER_URL,
        port: process.env.NEW_SERVER_PORT,
        db: process.env.NEW_SERVER_DB,
        password: process.env.NEW_SERVER_PASSWORD,
      },
      to: {
        user: process.env.OLD_SERVER_USER,
        url: process.env.OLD_SERVER_URL,
        port: process.env.OLD_SERVER_PORT,
        db: process.env.OLD_SERVER_DB,
        password: process.env.OLD_SERVER_PASSWORD,
      },
    });
  };

  syncDatas = async () => {
    console.time("SYNC NEW DATAS");
    console.log("SYNC NEW DATAS", getPathTmpDatas());

    const files = readdirSync(getPathTmpDatas()).filter(
      (f) => !f.includes("NOMENC") && (f.endsWith(".xml") || f.endsWith(".csv"))
    );
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      console.time(file);
      console.log("file name", file);

      if (file.endsWith(".csv")) {
        let liner = new lineByLine(`${getPathTmpDatas()}/${file}`);
        let line = null;
        let header = null;
        let getSeparator = null;
        while ((line = liner.next().toString()) !== "false") {
          const lineFormated = line.toString("ascii").trim();

          if (getSeparator === null) {
            const nbVirgule = (lineFormated.match(/,/g) || []).length;
            const nbDotVirgule = (lineFormated.match(/;/g) || []).length;
            if (nbVirgule > nbDotVirgule) {
              getSeparator = ",";
            } else {
              getSeparator = ";";
            }
          }

          const lineSplited = lineFormated.split(getSeparator);
          if (!header) {
            header = ["file-name", ...lineSplited];
          } else {
            await this.syncDataLine(header, [file, ...lineSplited]);
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
            dataLines[0] = file;
          } else if (`</${secondTag}>` === lineFormated) {
            await this.syncDataLine(headerMap, dataLines);
          } else if (nbLine > 2) {
            const index = headerMap.indexOf(tag);
            if (index !== -1) {
              dataLines[index] = getXMLTagValue(lineFormated);
            }
          }

          nbLine++;
        }
      }

      await this.syncDataLine(null, null);
      // remove file
      unlinkSync(`${getPathTmpDatas()}/${file}`);
      console.timeEnd(file);
    }
  };

  cacheColumn = {};
  datasLine = [];
  totalLine = 0;
  syncDataLine = async (header, line) => {
    let sendDatas = false;

    if (header) {
      this.cacheColumn = header;
      this.datasLine.push(line);
      this.totalLine++;
    } else {
      sendDatas = true;
    }

    if (this.datasLine.length >= NB_LINES) {
      sendDatas = true;
    }

    if (sendDatas) {
      console.log("sendDatas", this.datasLine.length, this.totalLine);
      await pushDatas(this.cacheColumn, this.datasLine);
      this.cacheColumn = {};
      this.datasLine = [];
    }
  };
}
