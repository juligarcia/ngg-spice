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
import { AppNode, NodeCategory, NodeType } from "./components/nodes/types";
import { edgeTypes } from "./components/edges";
import { AppEdge, EdgeType } from "./components/edges/types";
import { SortAsc } from "lucide-react";
import { uniqueId } from "lodash";
import Nodes from "./components/nodes/utils";
import { ConnectionNodeType } from "./components/nodes/ConnectionNode/types";

const Editor: FC = () => {
  const { theme } = useTheme();

  const initialNodes: AppNode[] = [
    {
      id: "element-1",
      data: { value: 1000, unit: "k" },
      type: NodeType.Resistance,
      position: { x: 0, y: 0 }
    },
    {
      id: "element-2",
      data: { value: 1000, unit: "k" },
      type: NodeType.Resistance,
      position: { x: 200, y: 200 }
    },
    {
      id: "element-3",
      data: { value: 1000, unit: "k" },
      type: NodeType.Resistance,
      position: { x: -200, y: -200 }
    },
    {
      id: "element-4",
      data: { value: 1000, unit: "k" },
      type: NodeType.Resistance,
      position: { x: -300, y: 400 }
    }
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<AppEdge>([]);

  const onConnect: OnConnect = ({ ...params }) => {
    const { source, target, sourceHandle, targetHandle } = params;

    const sourceNode = Nodes.findNode(nodes, "id", source);
    const targetNode = Nodes.findNode(nodes, "id", target);

    const isSourceElement = Nodes.isOfCategory(source, NodeCategory.Element);
    const isTargetElement = Nodes.isOfCategory(target, NodeCategory.Element);

    const uuid = uniqueId();

    if (sourceNode && targetNode && isSourceElement && isTargetElement) {
      const [centerXSource, centerYSource] =
        Nodes.calculateNodeCenter(sourceNode);

      const [centerXTarget, centerYTarget] =
        Nodes.calculateNodeCenter(targetNode);

      let centerX = Math.round((centerXSource + centerXTarget) / 2);
      centerX = centerX - (centerX % 10);

      let centerY = Math.round((centerYSource + centerYTarget) / 2);
      centerY = centerY - (centerY % 10);

      console.log(centerX, centerY);

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
              ? Nodes.tagPort(newConnectionNodeId, Position.Right)
              : Nodes.tagPort(newConnectionNodeId, Position.Left)
            : offsetY > 0
            ? Nodes.tagPort(newConnectionNodeId, Position.Bottom)
            : Nodes.tagPort(newConnectionNodeId, Position.Top)
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
              ? Nodes.tagPort(newConnectionNodeId, Position.Left)
              : Nodes.tagPort(newConnectionNodeId, Position.Right)
            : offsetY > 0
            ? Nodes.tagPort(newConnectionNodeId, Position.Top)
            : Nodes.tagPort(newConnectionNodeId, Position.Bottom)
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

  console.log(nodes);

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
        <Background variant={BackgroundVariant.Dots} gap={20} size={2} />
      </ReactFlow>
    </div>
  );
};

export default Editor;
