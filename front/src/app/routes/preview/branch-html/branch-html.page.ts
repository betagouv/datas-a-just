import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import * as dagre from "dagre"; // doc https://github.com/dagrejs/dagre/wiki
import { QueriesService } from "../../../services/queries/queries.service";
import { ActivatedRoute } from "@angular/router";
import { BranchInterface } from "../../../interfaces/branch.interfaces";
import { Box, Edge, Node } from "../../../interfaces/graph.interface";
import Drawflow from 'drawflow'
import "drawflow/dist/drawflow.min.css";

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

    const id = document.getElementById("drawflow");
    if (id) {
      const editor = new Drawflow(id);
      editor.start();
      // https://github.com/jerosoler/Drawflow/issues/20
      // regarder ici
      //editor.editor_mode = 'fixed'; // Only scroll
      //editor.draggable_inputs = false;

      var html = document.createElement("div");
      html.innerHTML = "Hello Drawflow!!";
      editor.registerNode('test', html, null, null);
      var data = { "name": 'Name' };

      const node1 = editor.addNode('github', 0, 1, 20, 50, 'github', data, 'test', true);
      const node2 = editor.addNode('github', 1, 2, 100, 150, 'github', data, 'test', true);

      console.log('node1', node1);
      console.log('node2', node2);
      editor.addConnection(node1, node2, 'output_1', 'input_1')
    }
  }

  onGenerateGprah(branche: BranchInterface) {
    const allNodes: BranchInterface[] = []
    allNodes.push(branche)

    var nodes = [];
    nodes.push(new Node(branche.id, null));
    const resursiveBranches = (parentId: number, branches: BranchInterface[]) => {
      branches.forEach(branch => {
        allNodes.push(branch)
        nodes.push(new Node(branch.id, parentId));
        if (branch.children) {
          resursiveBranches(branch.id, branch.children);
        }
      })
    }
    if (branche.children) {
      resursiveBranches(branche.id, branche.children);
    }

    // génération du graph en théorie
    var g = new dagre.graphlib.Graph();
    g.setGraph({
    });
    nodes.forEach(node => {
      g.setNode(node.id + "", { width: 200, height: 40 });
      if (node.parentId != null) {
        g.setEdge(node.parentId + "", node.id + "", { labelpos: 'l' });
      }
    });
    dagre.layout(g);

    // récupération des positions des nodes et des edges
    this.boxes = [];
    g.nodes().forEach(nodeId => {
      var node = g.node(nodeId);
      const nodeData = allNodes.find(n => n.id == +nodeId);
      var box = new Box(node.x - node.width / 2, node.y - node.height / 2, node.width, node.height, nodeData?.aliasName || nodeData?.name || '');
      this.boxes.push(box);
    });
    this.edges = [];
    g.edges().forEach(e => {
      this.edges.push(new Edge(g.edge(e).points));
    });
  }
}
