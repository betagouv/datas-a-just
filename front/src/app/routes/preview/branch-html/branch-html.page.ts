import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import * as dagre from "dagre";
import { QueriesService } from "../../../services/queries/queries.service";
import { ActivatedRoute } from "@angular/router";
import { BranchInterface } from "../../../interfaces/branch.interfaces";

export class Box {
  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number,
    public label: string,
  ) {
  }
}

export interface IPoint {
  x: number;
  y: number;
}

export class Edge {
  constructor(private points: IPoint[]) {
  }
  public get path(): string {
    if (this.points.length < 2) return "";
    var result = "M ";
    this.points.forEach(pt => {
      result += `${pt.x} ${pt.y} L`;
    });
    return result.substr(0, result.length - 2);
  }
}

export class Node {
  constructor(
    public id: string,
    public parentId: string | null,
  ) {
  }
}

@Component({
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './branch-html.page.html',
  styleUrls: ['./branch-html.page.scss'],
})
export class BranchHTMLPage implements OnInit {
  queriesService = inject(QueriesService);
  activatedRoute = inject(ActivatedRoute);
  title = inject(Title);
  boxes: Box[] = [];
  edges: Edge[] = [];

  /**
   * Constructeur
   */
  constructor() {
    this.title.setTitle('Prévisualisation de la page blanche');
  }

  ngOnInit() {
    this.onLoad();
  }

  async onLoad() {
    const branch = this.activatedRoute.snapshot.params['id']
    const f = this.activatedRoute.snapshot.queryParams['f']
    const queriesTab = [];
    if (f) {
      queriesTab.push(`f=${encodeURIComponent(f)}`);
    }

    const branche = await this.queriesService.getBranchPreview(+branch, queriesTab.join('&'))
    this.onGenerateGprah(branche);
  }

  onGenerateGprah(branche: BranchInterface) {
    var nodes = [];
    nodes.push(new Node(branche.id + "", null));
    /*nodes.push(new Node("root", null));
    nodes.push(new Node("Node A", "root"));
    nodes.push(new Node("Node B", "root"));
    nodes.push(new Node("Node C", "root"));
    nodes.push(new Node("Node D", "Node C"));*/

    var g = new dagre.graphlib.Graph();
    g.setGraph({});
    nodes.forEach(node => {
      g.setNode(node.id, { width: 200, height: 40 });
      if (node.parentId != null) {
        g.setEdge(node.parentId, node.id, {});
      }
    });
    dagre.layout(g);
    this.boxes = [];
    g.nodes().forEach(nodeId => {
      var node = g.node(nodeId);
      var box = new Box(node.x - node.width / 2, node.y - node.height / 2, node.width, node.height, nodeId)
      this.boxes.push(box);
    });
    this.edges = [];
    g.edges().forEach(e => {
      this.edges.push(new Edge(g.edge(e).points));
    });
  }
}
