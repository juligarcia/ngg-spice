import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  addEdge,
  useEdgesState,
  useNodesState,
  OnConnect,
  ConnectionMode,
  useStoreApi,
  useReactFlow,
  XYPosition
} from "@xyflow/react";
import { FC, useRef } from "react";
import { useTheme } from "../ThemeProvider";
import { nodeTypes } from "@/components/Editor/components/canvas/nodes";
import {
  AppNode,
  NodeCategory,
  NodeType
} from "./components/canvas/nodes/types";
import { edgeTypes } from "./components/canvas/edges";
import { AppEdge } from "./components/canvas/edges/types";
import { uniqueId } from "lodash";
import Nodes, { tagNode } from "./components/canvas/nodes/utils";
import { ConnectionNodeType } from "./components/canvas/nodes/ConnectionNode/types";
import { SpiceNodeType } from "./components/canvas/nodes/SpiceNode/types";
import {
  SpiceData,
  SpiceInstanceName,
  SpiceNodeDefinition
} from "../context/SpiceContext/SpiceContext";
import { useHotkeys } from "react-hotkeys-hook";
import { osHotkeys } from "@/utils/hotkeys";
import { useOs } from "../context/OsContext";
import { spiceNodes } from "../context/SpiceContext/nodes/nodes";
import { getBySelector, getCenter } from "@/utils/dom";
import { Button } from "../ui/Button";
import toast from "react-hot-toast";

const Editor: FC = () => {
  const { theme } = useTheme();

  const { getState } = useStoreApi();
  const { getNode, screenToFlowPosition } = useReactFlow();

  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>(
    getState().nodes as AppNode[]
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState<AppEdge>(
    getState().edges as AppEdge[]
  );

  const refCounter = useRef<Map<string, number>>(new Map());

  const { R, C, L, Gnd, V, I, G, E, F, H, Q } = spiceNodes;

  const { os } = useOs();

  const createNewSpiceNode = (
    node: SpiceNodeDefinition & Partial<SpiceData>
  ): SpiceNodeType => ({
    type: NodeType.Spice,
    id: Nodes.tagElement(uniqueId()),
    position: { x: 0, y: 0 },
    data: {
      ...node,
      name: `${node.instance_name}${refCounter.current.get(
        node.instance_name
      )}`,
      data: node.data || {}
    }
  });

  useHotkeys(osHotkeys({ macos: "r", windows: "r", linux: "r" }, os), () => {
    if (!R) return;

    const counter = refCounter.current.get(SpiceInstanceName.Resistor);

    if (counter === undefined)
      refCounter.current.set(SpiceInstanceName.Resistor, 1);
    else refCounter.current.set(SpiceInstanceName.Resistor, counter + 1);

    const newComponentNode = createNewSpiceNode(R);

    setNodes((nodes: AppNode[]) => [...nodes, newComponentNode]);
  });

  useHotkeys(osHotkeys({ macos: "c", windows: "c", linux: "c" }, os), () => {
    if (!C) return;

    const counter = refCounter.current.get(SpiceInstanceName.Capacitor);

    if (counter === undefined)
      refCounter.current.set(SpiceInstanceName.Capacitor, 1);
    else refCounter.current.set(SpiceInstanceName.Capacitor, counter + 1);

    const newComponentNode = createNewSpiceNode(C);

    setNodes((nodes: AppNode[]) => [...nodes, newComponentNode]);
  });

  useHotkeys(osHotkeys({ macos: "l", windows: "l", linux: "l" }, os), () => {
    if (!L) return;

    const counter = refCounter.current.get(SpiceInstanceName.Inductor);

    if (counter === undefined)
      refCounter.current.set(SpiceInstanceName.Inductor, 1);
    else refCounter.current.set(SpiceInstanceName.Inductor, counter + 1);

    const newComponentNode = createNewSpiceNode(L);

    setNodes((nodes: AppNode[]) => [...nodes, newComponentNode]);
  });

  useHotkeys(osHotkeys({ macos: "0", windows: "0", linux: "0" }, os), () => {
    if (!Gnd) return;

    const newComponentNode = createNewSpiceNode(Gnd);

    setNodes((nodes: AppNode[]) => [...nodes, newComponentNode]);
  });

  useHotkeys(osHotkeys({ macos: "v", windows: "v", linux: "v" }, os), () => {
    if (!V) return;

    const counter = refCounter.current.get(SpiceInstanceName.VoltageSource);

    if (counter === undefined)
      refCounter.current.set(SpiceInstanceName.VoltageSource, 1);
    else refCounter.current.set(SpiceInstanceName.VoltageSource, counter + 1);

    const newComponentNode = createNewSpiceNode(V);

    setNodes((nodes: AppNode[]) => [...nodes, newComponentNode]);
  });

  useHotkeys(osHotkeys({ macos: "i", windows: "i", linux: "i" }, os), () => {
    if (!I) return;

    const counter = refCounter.current.get(SpiceInstanceName.CurrentSource);

    if (counter === undefined)
      refCounter.current.set(SpiceInstanceName.CurrentSource, 1);
    else refCounter.current.set(SpiceInstanceName.CurrentSource, counter + 1);

    const newComponentNode = createNewSpiceNode(I);

    setNodes((nodes: AppNode[]) => [...nodes, newComponentNode]);
  });

  useHotkeys(osHotkeys({ macos: "g", windows: "g", linux: "g" }, os), () => {
    if (!G) return;

    const counter = refCounter.current.get(SpiceInstanceName.VCIS);

    if (counter === undefined)
      refCounter.current.set(SpiceInstanceName.VCIS, 1);
    else refCounter.current.set(SpiceInstanceName.VCIS, counter + 1);

    const newComponentNode = createNewSpiceNode(G);

    setNodes((nodes: AppNode[]) => [...nodes, newComponentNode]);
  });

  useHotkeys(osHotkeys({ macos: "e", windows: "e", linux: "e" }, os), () => {
    if (!E) return;

    const counter = refCounter.current.get(SpiceInstanceName.VCVS);

    if (counter === undefined)
      refCounter.current.set(SpiceInstanceName.VCVS, 1);
    else refCounter.current.set(SpiceInstanceName.VCVS, counter + 1);

    const newComponentNode = createNewSpiceNode(E);

    setNodes((nodes: AppNode[]) => [...nodes, newComponentNode]);
  });

  useHotkeys(osHotkeys({ macos: "f", windows: "f", linux: "f" }, os), () => {
    if (!F) return;

    const counter = refCounter.current.get(SpiceInstanceName.ICIS);

    if (counter === undefined)
      refCounter.current.set(SpiceInstanceName.ICIS, 1);
    else refCounter.current.set(SpiceInstanceName.ICIS, counter + 1);

    const newComponentNode = createNewSpiceNode(F);

    setNodes((nodes: AppNode[]) => [...nodes, newComponentNode]);
  });

  useHotkeys(osHotkeys({ macos: "h", windows: "h", linux: "h" }, os), () => {
    if (!H) return;

    const counter = refCounter.current.get(SpiceInstanceName.ICVS);

    if (counter === undefined)
      refCounter.current.set(SpiceInstanceName.ICVS, 1);
    else refCounter.current.set(SpiceInstanceName.ICVS, counter + 1);

    const newComponentNode = createNewSpiceNode(H);

    setNodes((nodes: AppNode[]) => [...nodes, newComponentNode]);
  });

  useHotkeys(osHotkeys({ macos: "q", windows: "q", linux: "q" }, os), () => {
    if (!Q) return;

    const counter = refCounter.current.get(SpiceInstanceName.BJT);

    if (counter === undefined) refCounter.current.set(SpiceInstanceName.BJT, 1);
    else refCounter.current.set(SpiceInstanceName.BJT, counter + 1);

    const newComponentNode = createNewSpiceNode(Q);

    setNodes((nodes: AppNode[]) => [...nodes, newComponentNode]);
  });

  const calculateConnectionNodePosition = (
    source: XYPosition,
    target: XYPosition
  ): XYPosition => {
    const diffX = Math.abs(target.x - source.x);
    const diffY = Math.abs(target.y - source.y);

    const xOffsetSign = Math.sign(target.x - source.x);
    const yOffsetSign = Math.sign(target.y - source.y);

    console.log(target.x - source.x, target.y - source.y);

    return {
      x:
        diffY > diffX
          ? target.x - xOffsetSign * 20
          : source.x + xOffsetSign * 20,
      y: diffX > diffY ? target.y : source.y
    };
  };

  const onConnect: OnConnect = ({ ...params }) => {
    const { source, target, sourceHandle, targetHandle } = params;

    const sourceNode = getNode(source);
    const targetNode = getNode(target);

    const sourceHandleNode =
      sourceHandle &&
      (getBySelector("data-handleid", sourceHandle) as HTMLElement);

    const targetHandleNode =
      targetHandle &&
      (getBySelector("data-handleid", targetHandle) as HTMLElement);

    const isSourceElement = Nodes.isOfCategory(source, NodeCategory.Element);
    const isTargetElement = Nodes.isOfCategory(target, NodeCategory.Element);

    const uuid = uniqueId();

    if (
      sourceNode &&
      sourceHandleNode &&
      targetNode &&
      targetHandleNode &&
      isSourceElement &&
      isTargetElement
    ) {
      const centerSource = screenToFlowPosition({
        x: getCenter(sourceHandleNode).x,
        y: getCenter(sourceHandleNode).y
      });

      const centerTarget = screenToFlowPosition({
        x: getCenter(targetHandleNode).x,
        y: getCenter(targetHandleNode).y
      });

      const position = calculateConnectionNodePosition(
        centerSource,
        centerTarget
      );

      console.log(centerSource, centerTarget, position);

      const newConnectionNodeId = tagNode(uuid);

      const newConnectionNode: ConnectionNodeType = {
        type: NodeType.ConnectionNode,
        data: {},
        id: newConnectionNodeId,
        position
      };

      const newEdge1: AppEdge = {
        type: "floating",
        id: `e2e-${uuid}-1st`,
        source,
        target: newConnectionNode.id,
        sourceHandle,
        targetHandle: Nodes.tagPort(newConnectionNodeId)
      };

      const newEdge2: AppEdge = {
        type: "floating",
        id: `e2e-${uuid}-2nd`,
        source: target,
        sourceHandle: targetHandle,
        target: newConnectionNode.id,
        targetHandle: Nodes.tagPort(newConnectionNodeId)
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

  return (
    <div
      id="canvas-wrapper"
      className="w-full h-full border-2 border-accent rounded-lg overflow-hidden"
    >
      <ReactFlow<AppNode, AppEdge>
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
