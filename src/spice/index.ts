import { AppEdge } from "@/components/Editor/components/edges/types";
import { SpiceNodeType } from "@/components/Editor/components/nodes/SpiceNode/types";
import { AppNode, NodeType } from "@/components/Editor/components/nodes/types";
import { getIncomers, getOutgoers } from "@xyflow/react";

interface SpiceConfig {}

export class Spice {
  nodes: Array<AppNode>;
  edges: Array<AppEdge>;
  nodesMap: Map<string, AppNode> = new Map();
  edgesMap: Map<string, AppEdge> = new Map();
  config: SpiceConfig = {}; // TODO: default configuration
  buffer: Array<string> = [];

  constructor(
    nodes: Array<AppNode>,
    edges: Array<AppEdge>,
    config?: Partial<SpiceConfig>
  ) {
    this.nodes = nodes;
    this.edges = edges;
    this.nodesMap = new Map(nodes.map((node) => [node.id, node]));
    this.edgesMap = new Map(edges.map((edge) => [edge.id, edge]));
    this.config = { ...this.config, ...config };
  }

  clearLineBuffer() {
    this.buffer = [];
  }

  appendStartingLines() {
    this.buffer.push("TEMP TITLE"); // TODO: Add title to editor, filename
  }

  appendFinishingLines() {
    this.buffer.push(".end"); // TODO: Add title to editor, filename
  }

  appendInstanceLines() {
    // We don't care about connection nodes or gnd nodes
    // we just want to know to what nodes are elements connected

    const spiceElementNodes = this.nodes.filter((node) => {
      const { type } = node;

      return (
        type !== NodeType.ConnectionNode &&
        (node as SpiceNodeType).data.instance_name !== "gnd"
      );
    }) as Array<SpiceNodeType>;

    const groundNodes = this.nodes.filter((node) => {
      const { type } = node;

      return (
        type !== NodeType.ConnectionNode &&
        (node as SpiceNodeType).data.instance_name === "gnd"
      );
    });

    const groundAlias = groundNodes
      .map((groundNode) => getOutgoers(groundNode, this.nodes, this.edges))
      .flat()
      .map(({ id }) => id);

    spiceElementNodes.forEach((spiceElement) => {
      // According to ngspice documentation, there should always be at least 2 connection
      // except some specific cases

      const nodeConnections = getOutgoers(spiceElement, this.nodes, this.edges)
        .map((node) => node.id)
        .map((nodeId) => (groundAlias.includes(nodeId) ? "gnd" : nodeId))
        .join(" ");

      const spiceElementWithData = this.nodesMap.get(spiceElement.id);

      if (!spiceElementWithData) return;

      const {
        data: { name, instance_name, data }
      } = spiceElementWithData as SpiceNodeType;

      console.log(
        nodeConnections,
        getIncomers(spiceElement, this.nodes, this.edges)
      );

      // TODO: esto claramente no funciona siempre, como hago con los transistores?
      // Tengo los elementos básicos que si tienen un valor
      // Tengo los modelos que se configuran previamente = transistores
      // Tengo los de entradas impares o distintas a 2
      // Puedo identificarlos con una categoría o tipo aca
      // por ahora esto basta
      const hasValue = data.has("value") || true; // TODO: HARDCODEADO
      const value = data.get("value") || 10;

      this.buffer.push(
        `${instance_name}${name} ${nodeConnections}${
          hasValue ? ` ${value}` : ""
        }`
      );
    });
  }

  buildTopology() {
    this.appendStartingLines();
    this.appendInstanceLines();
    this.appendFinishingLines();

    return this.buffer.join("\n");
  }
}
