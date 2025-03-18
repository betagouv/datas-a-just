import path from "path";
import { Types } from "../utils/types";
import Route from "./Route";

export default class RouteDatas extends Route {
  // model de BDD
  model;

  /**
   * Constructeur
   * @param {*} params
   */
  constructor(params) {
    super(params);

    this.model = params.models.datasindex;
  }

  @Route.Get()
  async datasTypesList(ctx) {
    this.sendOk(ctx, await this.model.list());
  }

  @Route.Get({
    path: "/datas-list/:columnName",
  })
  async datasList(ctx) {
    const { columnName } = ctx.params;
    this.sendOk(ctx, await this.model.datasGrouped(columnName));
  }
}
