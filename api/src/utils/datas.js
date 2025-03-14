export const getPathTmpDatas = (key) => {
  var path = __dirname + "/../../../datas/";

  try {
    //mkdirSync(path, { recursive: true });
  } catch (e) {}
  return path;
};

export const getXMLTagName = (stringNotFormated) => {
  let tag = stringNotFormated.trim().split(">")[0].replace(/(<|>)/g, "");
  return tag.split(" ")[0];
};

export const getXMLTagValue = (stringNotFormated) => {
  let tab = stringNotFormated.trim().split(">");
  if (tab.length > 1) {
    return tab[1].trim().split("<")[0];
  }
  return " ";
};
