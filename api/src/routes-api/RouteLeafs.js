import { Types } from "../utils/types";
import Route from "./Route";

export default class RouteLeafs extends Route {
  // model de BDD
  model;

  /**
   * Constructeur
   * @param {*} params
   */
  constructor(params) {
    super(params);

    this.model = params.models.leafs;
  }

  @Route.Get()
  async list(ctx) {
    this.sendOk(ctx, await this.model.list());
  }

  @Route.Post({
    bodyType: Types.object().keys({
      name: Types.string(),
    }),
  })
  async add(ctx) {
    const { name } = this.body(ctx);
    this.sendOk(ctx, await this.model.add({ name }));
  }
}
