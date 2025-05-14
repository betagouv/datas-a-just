import axios from "axios";
import config from "config";

export const pushDatas = async (columns, datas) => {
  return axios.post(`${config.serverUrl}/datas/upload-datas`, {
    datas,
    columns,
  });
};

export const cleanDatas = async (fileName) => {
  return axios.post(`${config.serverUrl}/datas/clean-datas`, {
    fileName,
  });
};
