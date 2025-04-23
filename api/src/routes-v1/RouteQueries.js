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
    const type = queries.type || "branch";
    const f = queries.f || "";

    if (type === "html") {
      let url = `${config.frontURL}/preview/html/${queries.b}`;
      const queriesTab = [];
      if (f) {
        queriesTab.push(`f=${encodeURIComponent(f)}`);
      }
      if (queriesTab.length) {
        url += `?${queriesTab.join("&")}`;
      }
      console.log(url);
      ctx.redirect(url); // redirect to another page
      return;
    }

    this.sendOk(ctx, await this.model.request(queries));
  }
}
