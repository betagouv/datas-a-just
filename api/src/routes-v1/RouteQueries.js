import Route from "./Route";

export default class RouteQueries extends Route {
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
  async request(ctx) {
    const queries = ctx.request.query;

    this.sendOk(ctx, await this.model.request(queries));
  }
}
