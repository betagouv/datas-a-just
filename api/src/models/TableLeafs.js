import { parse } from "yaml";
import { readdirSync, readFileSync, unlinkSync } from "fs";
import { getPathTmpDatas } from "../utils/datas";

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

  Model.syncDatas = async () => {
    const files = readdirSync(getPathTmpDatas()).filter((f) =>
      f.endsWith(".yml")
    );
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      console.time(file);
      console.log("file name", file);

      const readedFile = readFileSync(`${getPathTmpDatas()}/${file}`, "utf8");
      const yamlParse = parse(readedFile);

      const datasQueries = Object.values(yamlParse["categories"]);
      for (let y = 0; y < datasQueries.length; y++) {
        const row = datasQueries[y];
        const types = Object.keys(row.filtres);

        for (let z = 0; z < types.length; z++) {
          const type = types[z];
          const filters = row.filtres[type];

          const findExist = await Model.findOne({
            where: {
              name: row.label,
              alias_name: type,
            },
          });

          if (!findExist) {
            const leaf = await Model.create({
              name: row.label,
              alias_name: type,
            });

            const typeOfFilters = Object.keys(filters);

            for (let j = 0; j < typeOfFilters.length; j++) {
              const typeOfFilter = typeOfFilters[j];
              let filter = filters[typeOfFilter];
              if (!Array.isArray(filter)) {
                filter = [filter];
              }

              if (typeOfFilter === "TOTAL") {
                await Model.models.leafsqueries.create({
                  leaf_id: leaf.id,
                  column_name: filter[0],
                  type: "counted",
                });
              } else {
                const getDBColumn = await Model.models.datasindex.findOne({
                  where: { label: typeOfFilter },
                  raw: true,
                });

                if (!getDBColumn) {
                  throw new Error(
                    `Column ${typeOfFilter} not found in datasindex`
                  );
                }
                const columnName = getDBColumn.column_name;
                let firstId = null;
                for (let z = 0; z < filter.length; z++) {
                  const filterValue = filter[z].replace(/  /g, " ");
                  const findDictionary =
                    await Model.models.dictionaries.findOne({
                      where: {
                        label: filterValue
                          .replace("<>", "")
                          .replace(/"/g, "")
                          .trim(),
                      },
                      raw: true,
                    });

                  const newQuery = await Model.models.leafsqueries.create({
                    leaf_id: leaf.id,
                    column_name: columnName,
                    column_filter: findDictionary
                      ? findDictionary.code
                      : filterValue.replace("<>", "").replace(/"/g, "").trim(),
                    include: filterValue.includes("<>") ? false : true,
                    type: "filter",
                    parent_leaf_query_id: firstId,
                  });
                  if (!firstId) {
                    firstId = newQuery.id;
                  }
                }
              }
            }
          }
        }
      }

      // remove file
      unlinkSync(`${getPathTmpDatas()}/${file}`);
      console.timeEnd(file);
    }
  };

  setTimeout(() => {
    Model.syncDatas();
  }, 1000);

  return Model;
};
