import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  addEdge,
  useEdgesState,
  useNodesState,
  OnConnect,
  Panel,
  NodeToolbar,
  Handle,
  Position,
  NodeToolbarProps,
  NodeTypes,
  ConnectionMode,
  applyNodeChanges,
  Edge,
  Node,
  getNodesBounds,
  useNodesInitialized,
  useStore,
  useInternalNode
} from "@xyflow/react";
import { ComponentType, FC, useCallback } from "react";
import { useTheme } from "../ThemeProvider";
import { nodeTypes } from "@/components/Editor/components/nodes";
import { AppNode, NodeType } from "./components/nodes/types";
import { edgeTypes } from "./components/edges";
import { AppEdge, EdgeType } from "./components/edges/types";
import { SortAsc } from "lucide-react";
import { ConnectionNodeType } from "./components/nodes/ConnectionNode/types";
import { uniqueId } from "lodash";
import { calculateNodeCenter, findNode } from "./components/nodes/utils";

const Editor: FC = () => {
  const { theme } = useTheme();

  const initialNodes: AppNode[] = [
    {
      id: "element-resistance-1",
      data: { value: 1000, unit: "k" },
      type: NodeType.Resistance,
      position: { x: 0, y: 0 }
    },
    {
      id: "element-resistance-2",
      data: { value: 1000, unit: "k" },
      type: NodeType.Resistance,
      position: { x: 200, y: 200 }
    },
    {
      id: "element-resistance-3",
      data: { value: 1000, unit: "k" },
      type: NodeType.Resistance,
      position: { x: -200, y: -200 }
    },
    {
      id: "element-resistance-4",
      data: { value: 1000, unit: "k" },
      type: NodeType.Resistance,
      position: { x: -300, y: 400 }
    }
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<AppEdge>([]);

  const onConnect: OnConnect = ({ ...params }) => {
    const { source, target, sourceHandle, targetHandle } = params;

    const sourceNode = findNode(nodes, "id", source);
    const targetNode = findNode(nodes, "id", target);

    const isSourceElement = source.includes("element-");
    const isTargetElement = target.includes("element-");

    // TODO: emprolijar esta logica

    const uuid = uniqueId();

    if (sourceNode && targetNode && isSourceElement && isTargetElement) {
      const [centerXSource, centerYSource] = calculateNodeCenter(sourceNode);
      const [centerXTarget, centerYTarget] = calculateNodeCenter(targetNode);

      const centerX = (centerXSource + centerXTarget) / 2;

      const centerY = (centerYSource + centerYTarget) / 2;

      const offsetX = centerXSource - centerXTarget;
      const offsetY = centerYSource - centerYTarget;

      const absOffsetX = Math.abs(offsetX);
      const absOffsetY = Math.abs(offsetY);

      const newConnectionNode: ConnectionNodeType = {
        type: NodeType.Connection,
        data: {},
        id: `connection-node-${uuid}`,
        position: { x: centerX, y: centerY }
      };

      const newEdge1: AppEdge = {
        type: "smoothstep",
        id: `e2e-${uuid}-1st`,
        source,
        target: newConnectionNode.id,
        sourceHandle,
        targetHandle:
          absOffsetX > absOffsetY
            ? offsetX > 0
              ? "right"
              : "left"
            : offsetY > 0
            ? "bottom"
            : "top"
      };

      const newEdge2: AppEdge = {
        type: "smoothstep",
        id: `e2e-${uuid}-2nd`,
        source: target,
        sourceHandle: targetHandle,
        target: newConnectionNode.id,
        targetHandle:
          absOffsetX > absOffsetY
            ? offsetX > 0
              ? "left"
              : "right"
            : offsetY > 0
            ? "top"
            : "bottom"
      };

      setEdges((eds: AppEdge[]) => addEdge(newEdge1, eds));
      setEdges((eds: AppEdge[]) => addEdge(newEdge2, eds));
      setNodes((nodes: AppNode[]) => [...nodes, newConnectionNode]);
    } else {
      setEdges((eds: AppEdge[]) =>
        addEdge({ ...params, type: "smoothstep" }, eds)
      );
    }
  };

  /*
  
  - Puedo usar Paneles para mostrar las especifidades de cada cosa, o también puedo hacerlo con toolbars...
  - Deberia usar toolbars en base al tipo de nodo
  
  */

  // TODO: Limitar self connections, permitir cambiar de lado la conexíon en un nodo, o hacer que sea automatico
  // TODO: autocompensar el nodo de conexión?

  return (
    <div className="w-full h-full grow">
      <ReactFlow
        nodeOrigin={[0.5, 0.5]}
        connectionMode={ConnectionMode.Loose}
        // snapGrid={[20, 20]}
        // snapToGrid
        colorMode={theme}
        fitView
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
      >
        <Controls />
        <Background variant={BackgroundVariant.Dots} gap={20} size={0.5} />
      </ReactFlow>
    </div>
  );
};

export default Editor;
