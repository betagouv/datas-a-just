import path from "path";
import { Types } from "../utils/types";
import Route from "./Route";

export default class RouteBranchs extends Route {
  // model de BDD
  model;

  /**
   * Constructeur
   * @param {*} params
   */
  constructor(params) {
    super(params);

    this.model = params.models.branchs;
  }

  @Route.Get()
  async list(ctx) {
    this.sendOk(ctx, await this.model.list());
  }

  @Route.Post({
    bodyType: Types.object().keys({
      id: Types.number(),
    }),
  })
  async allList(ctx) {
    const { id } = this.body(ctx);
    this.sendOk(ctx, await this.model.list(false));
  }

  @Route.Get({
    path: "/get-details/:id",
  })
  async getDetails(ctx) {
    const { id } = ctx.params;
    this.sendOk(ctx, await this.model.getDetails(id));
  }

  @Route.Put({
    bodyType: Types.object().keys({
      id: Types.number(),
      name: Types.string(),
      aliasName: Types.string(),
      leafs: Types.array(),
      children: Types.array(),
    }),
  })
  async save(ctx) {
    const { id, name, aliasName, leafs, children } = this.body(ctx);
    this.sendOk(
      ctx,
      await this.model.update({
        id,
        name,
        aliasName,
        leafs,
        children,
      })
    );
  }
}
