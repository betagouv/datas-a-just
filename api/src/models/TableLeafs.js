import { parse } from "yaml";
import { readFileSync } from "fs";

export default (sequelizeInstance, Model) => {
  Model.list = async () => {
    const list = await Model.findAll({
      attributes: ["id", "name", ["alias_name", "aliasName"], "version"],
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

  Model.syncDatas = async (file) => {
    const readedFile = readFileSync(file.filepath, "utf8");
    const yamlParse = parse(readedFile);

    const datasQueries = Object.values(yamlParse["categories"]);
    for (let y = 0; y < datasQueries.length; y++) {
      const row = datasQueries[y];
      const types = Object.keys(row.filtres || {});
      const filterByFileName = row.fichier || null;

      for (let z = 0; z < types.length; z++) {
        const type = types[z];
        const filters = row.filtres[type];

        const findExist = await Model.findOne({
          where: {
            name: row.label,
            alias_name: type,
          },
        });
        let version = 0;
        if (findExist) {
          version = findExist.version + 1;
        }

        console.log("filters", filters);

        const leaf = await Model.create({
          name: row.label,
          alias_name: type,
          version,
        });

        const typeOfFilters = Object.keys(filters);

        if (filterByFileName) {
          // add filter by file name
          await Model.models.leafsqueries.create({
            leaf_id: leaf.id,
            column_name: "data_1",
            column_filter: filterByFileName,
            include: true,
            type: "filter",
          });
        }

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
            let getDBColumn = await Model.models.datasindex.findOne({
              where: { label: typeOfFilter },
              raw: true,
            });

            if (!getDBColumn) {
              const countHeader = await Model.models.datasindex.count();
              getDBColumn = await Model.models.datasindex.create({
                type: "string",
                label: typeOfFilter,
                column_name: "data_" + (countHeader + 1),
              });
              getDBColumn = getDBColumn.dataValues;
            }
            const columnName = getDBColumn.column_name;
            let firstId = null;
            for (let z = 0; z < filter.length; z++) {
              const filterValue = (filter[z] + "").replace(/  /g, " ");
              console.log("filterValue", filterValue);
              const findDictionary = await Model.models.dictionaries.findOne({
                where: {
                  label: filterValue.replace("<>", "").replace(/"/g, "").trim(),
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
  };

  return Model;
};
