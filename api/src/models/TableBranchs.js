export default (sequelizeInstance, Model) => {
  Model.list = async (parentId = null) => {
    const options = {};
    if (parentId !== false) {
      options.parent_id = parentId;
    }

    const list = await Model.findAll({
      attributes: ["id", "name", ["alias_name", "aliasName"], "version"],
      where: {
        ...options,
      },
    });

    return list;
  };

  Model.getDetails = async (id) => {
    const details = await Model.findByPk(id, {
      attributes: ["id", "name", ["alias_name", "aliasName"], "version"],
      raw: true,
    });

    if (details) {
      details.leafs = await Model.models.branchleafs.listLeafs(id);
    }

    return details;
  };

  Model.update = async ({ id, name, aliasName, leafs }) => {
    let branch = await Model.findByPk(id);

    if (branch) {
      branch.name = name;
      branch.alias_name = aliasName;

      await branch.save();
    } else {
      branch = await Model.create({
        name,
        alias_name: aliasName,
      });
    }

    await Model.models.branchleafs.sync(leafs, branch.id);

    return branch;
  };

  Model.request = async (queries) => {
    let { b: id, f, type } = queries;
    const branchDetails = await Model.getDetails(id);
    let calculateDatas = true;

    if (!branchDetails) {
      return null;
    }

    if (!type) {
      type = "branch";
    }

    if (type === "branchs-preview") {
      calculateDatas = false;
    }

    const moreFilter = [];
    if (!f) {
      f = [];
    } else if (f && !Array.isArray(f)) {
      f = [f];
    }

    for (let i = 0; i < f.length; i++) {
      const found = f[i].split("]");
      if (found.length > 1) {
        moreFilter.push({
          columnLabel: found[0].replace("[", ""),
          columnFilter: found.slice(1).join("]"),
        });
      }
    }

    const leafs = branchDetails.leafs || [];
    if (calculateDatas) {
      for (let i = 0; i < leafs.length; i++) {
        const leaf = leafs[i];
        const leafDetails = await Model.models.leafs.getDetails(leaf.id);
        const datasFilters = leafDetails.datasFilters || [];
        const datasCounted = leafDetails.datasCounted || [];
        const datas = await Model.models.leafsqueries.previewDatas(
          [...datasFilters, ...moreFilter],
          datasCounted
        );

        leafs[i] = { ...leafDetails, datas };
        //console.log(leafDetails, datas);
      }
    }

    switch (type) {
      case "preview": {
        const preview = {
          id: branchDetails.id,
          name: branchDetails.name,
        };
        const leafs = branchDetails.leafs || [];
        leafs.forEach((leaf) => {
          preview[leaf.aliasName] = leaf.datas.total;
        });
        return preview;
      }
      case "branchs-preview": {
        const preview = {
          id: branchDetails.id,
          name: branchDetails.name,
        };

        return preview;
      }
      default:
        return branchDetails;
    }
  };

  return Model;
};
