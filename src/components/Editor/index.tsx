import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  addEdge,
  useEdgesState,
  useNodesState,
  OnConnect,
  Position,
  ConnectionMode
} from "@xyflow/react";
import { FC, useMemo, useRef, useState } from "react";
import { useTheme } from "../ThemeProvider";
import { nodeTypes } from "@/components/Editor/components/nodes";
import { AppNode, NodeCategory, NodeType } from "./components/nodes/types";
import { edgeTypes } from "./components/edges";
import { AppEdge } from "./components/edges/types";
import { uniqueId } from "lodash";
import Nodes, { tagNode } from "./components/nodes/utils";
import { ConnectionNodeType } from "./components/nodes/ConnectionNode/types";
import { SpiceNodeType } from "./components/nodes/SpiceNode/types";
import {
  SpiceInstanceName,
  SpiceNode,
  useSpice
} from "../context/SpiceContext";
import { useHotkeys } from "react-hotkeys-hook";
import { osHotkeys } from "@/utils/hotkeys";
import { useOs } from "../context/OsContext";

const Editor: FC = () => {
  const { theme } = useTheme();

  const [snapToGrid, setSnapToGrid] = useState(false);

  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<AppEdge>([]);

  const refCounter = useRef<Map<string, number>>(new Map());

  const { components } = useSpice();

  const [resistor, capacitor, inductor, ground, vcc] = useMemo(() => {
    const R = components.find(
      ({ instance_name }) => instance_name === SpiceInstanceName.Resistor
    );

    const C = components.find(
      ({ instance_name }) => instance_name === SpiceInstanceName.Capacitor
    );

    const L = components.find(
      ({ instance_name }) => instance_name === SpiceInstanceName.Inductor
    );

    const G = components.find(
      ({ instance_name }) => instance_name === SpiceInstanceName.Ground
    );

    const V = components.find(
      ({ instance_name }) => instance_name === SpiceInstanceName.VoltageSource
    );

    return [R, C, L, G, V];
  }, [components]);

  const { os } = useOs();

  useHotkeys(
    osHotkeys({ macos: "shift" }, os),
    () => {
      setSnapToGrid(!snapToGrid);
    },
    { keyup: true, keydown: true }
  );

  const createNewSpiceNode = (node: SpiceNode): SpiceNodeType => ({
    type: NodeType.Spice,
    id: Nodes.tagElement(uniqueId()),
    position: { x: 0, y: 0 },
    data: {
      ...node,
      name: `${node.instance_name}${refCounter.current.get(
        node.instance_name
      )}`,
      data: Object.fromEntries(
        node.fields.map((field) => [field.name, undefined])
      )
    }
  });

  useHotkeys(osHotkeys({ macos: "r", windows: "r", linux: "r" }, os), () => {
    if (!resistor) return;

    const counter = refCounter.current.get(SpiceInstanceName.Resistor);

    if (counter === undefined)
      refCounter.current.set(SpiceInstanceName.Resistor, 1);
    else refCounter.current.set(SpiceInstanceName.Resistor, counter + 1);

    const newComponentNode = createNewSpiceNode(resistor);

    setNodes((nodes: AppNode[]) => [...nodes, newComponentNode]);
  });

  useHotkeys(osHotkeys({ macos: "c", windows: "c", linux: "c" }, os), () => {
    if (!capacitor) return;

    const counter = refCounter.current.get(SpiceInstanceName.Capacitor);

    if (counter === undefined)
      refCounter.current.set(SpiceInstanceName.Capacitor, 1);
    else refCounter.current.set(SpiceInstanceName.Capacitor, counter + 1);

    const newComponentNode = createNewSpiceNode(capacitor);

    setNodes((nodes: AppNode[]) => [...nodes, newComponentNode]);
  });

  useHotkeys(osHotkeys({ macos: "l", windows: "l", linux: "l" }, os), () => {
    if (!inductor) return;

    const counter = refCounter.current.get(SpiceInstanceName.Inductor);

    if (counter === undefined)
      refCounter.current.set(SpiceInstanceName.Inductor, 1);
    else refCounter.current.set(SpiceInstanceName.Inductor, counter + 1);

    const newComponentNode = createNewSpiceNode(inductor);

    setNodes((nodes: AppNode[]) => [...nodes, newComponentNode]);
  });

  useHotkeys(osHotkeys({ macos: "g", windows: "g", linux: "g" }, os), () => {
    if (!ground) return;

    const newComponentNode = createNewSpiceNode(ground);

    setNodes((nodes: AppNode[]) => [...nodes, newComponentNode]);
  });

  useHotkeys(osHotkeys({ macos: "v", windows: "v", linux: "v" }, os), () => {
    if (!vcc) return;

    const counter = refCounter.current.get(SpiceInstanceName.VoltageSource);

    if (counter === undefined)
      refCounter.current.set(SpiceInstanceName.VoltageSource, 1);
    else refCounter.current.set(SpiceInstanceName.VoltageSource, counter + 1);

    const newComponentNode = createNewSpiceNode(vcc);

    setNodes((nodes: AppNode[]) => [...nodes, newComponentNode]);
  });

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

      const offsetX = centerXSource - centerXTarget;
      const offsetY = centerYSource - centerYTarget;

      const absOffsetX = Math.abs(offsetX);
      const absOffsetY = Math.abs(offsetY);

      const newConnectionNodeId = tagNode(uuid);

      const newConnectionNode: ConnectionNodeType = {
        type: NodeType.ConnectionNode,
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

  // TODO: Limitar self connections
  // TODO: permitir cambiar la conexíon de un nodo
  // TODO: habrá algún layout que me re ordene las cosas optimas para un circuito?
  // TODO: Componente general: .yaml
  // TODO: Elementos que le falta conexiones
  // TODO: Elementos que no están totalmente configurados

  return (
    <div className="w-full h-full grow">
      <ReactFlow
        selectNodesOnDrag={false}
        snapToGrid={true}
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
        <Controls showZoom={false} showInteractive={false}></Controls>
        <Background variant={BackgroundVariant.Dots} gap={20} size={2} />
      </ReactFlow>
    </div>
  );
};

export default Editor;
