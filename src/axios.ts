import { AxiosStatic, AxiosRequestConfig } from "./types";
import Axios from "./core/Axios";
import { extend } from "./utils";
import defaults from "./defaults";
import mergeConfig from "./core/mergeConfig";
import Cancel from "./cancel/Cancel";
import CancelToken from "./cancel/CancelToken";
import { isCancel } from "./cancel/isCancel";
import { spread } from "./helpers/spread";

function createInstance<T>(config: AxiosRequestConfig): AxiosStatic<T> {
  const context = new Axios(config);
  const instance = Axios.prototype.request.bind(context);
  extend(instance, context);
  return instance as AxiosStatic<T>;
}

const axios = createInstance(defaults);

axios.create = function create(config) {
  return createInstance(mergeConfig(defaults, config));
};

axios.CancelToken = CancelToken;
axios.Cancel = Cancel;
axios.isCancel = isCancel;

axios.all = function all(promises) {
  return Promise.all(promises);
};

axios.spread = spread;

axios.Axios = Axios;

export default axios;
