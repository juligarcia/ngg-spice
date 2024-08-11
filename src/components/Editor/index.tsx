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
import { uniqueId } from "lodash";
import { calculateNodeCenter, findNode } from "./components/nodes/utils";
import { ConnectionNodeType } from "./components/nodes/ConnectionNode/types";

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

      let centerX = Math.round((centerXSource + centerXTarget) / 2);
      centerX = centerX - (centerX % 10);

      let centerY = Math.round((centerYSource + centerYTarget) / 2);
      centerY = centerY - (centerY % 10);

      const offsetX = centerXSource - centerXTarget;
      const offsetY = centerYSource - centerYTarget;

      const absOffsetX = Math.abs(offsetX);
      const absOffsetY = Math.abs(offsetY);

      const newConnectionNodeId = `connection-node-${uuid}`;

      const newConnectionNode: ConnectionNodeType = {
        type: NodeType.Connection,
        data: {},
        id: newConnectionNodeId,
        position: { x: centerX, y: centerY }
      };

      const newEdge1: AppEdge = {
        type: "floating",
        id: `e2e-${uuid}-1st`,
        source,
        target: newConnectionNode.id,
        sourceHandle,
        targetHandle:
          absOffsetX > absOffsetY
            ? offsetX > 0
              ? `handle-${newConnectionNodeId}-right`
              : `handle-${newConnectionNodeId}-left`
            : offsetY > 0
            ? `handle-${newConnectionNodeId}-bottom`
            : `handle-${newConnectionNodeId}-top`
      };

      const newEdge2: AppEdge = {
        type: "floating",
        id: `e2e-${uuid}-2nd`,
        source: target,
        sourceHandle: targetHandle,
        target: newConnectionNode.id,
        targetHandle:
          absOffsetX > absOffsetY
            ? offsetX > 0
              ? `handle-${newConnectionNodeId}-left`
              : `handle-${newConnectionNodeId}-right`
            : offsetY > 0
            ? `handle-${newConnectionNodeId}-top`
            : `handle-${newConnectionNodeId}-bottom`
      };

      setEdges((eds: AppEdge[]) => addEdge(newEdge1, eds));
      setEdges((eds: AppEdge[]) => addEdge(newEdge2, eds));
      setNodes((nodes: AppNode[]) => [...nodes, newConnectionNode]);
    } else {
      setEdges((eds: AppEdge[]) =>
        addEdge({ ...params, type: "floating" }, eds)
      );
    }
  };

  // TODO: Limitar self connections
  // TODO: permitir cambiar la conexíon de un nodo
  // TODO: habrá algún layout que me re ordene las cosas optimas para un circuito?
  // TODO: Componente general: .yaml

  return (
    <div className="w-full h-full grow">
      <ReactFlow
        snapToGrid
        snapGrid={[10, 10]}
        nodeOrigin={[0.5, 0.5]}
        connectionMode={ConnectionMode.Loose}
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
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
      </ReactFlow>
    </div>
  );
};

export default Editor;
