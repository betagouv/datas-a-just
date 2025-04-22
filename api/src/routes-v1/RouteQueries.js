import Route from "./Route";
import config from "config";

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
    let type = queries.type || "branch";

    if (type === "html") {
      ctx.redirect(`${config.frontURL}/preview/html/${queries.b}`); // redirect to another page
      return;
    }

    this.sendOk(ctx, await this.model.request(queries));
  }
}
