import {
  Background,
  BackgroundVariant,
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
import { FC } from "react";
import { useTheme } from "../ThemeProvider";
import { nodeTypes } from "@/components/Editor/components/canvas/nodes";
import {
  AppNode,
  NodeCategory,
  NodeType
} from "./components/canvas/nodes/types";
import { edgeTypes } from "./components/canvas/edges";
import { AppEdge } from "./components/canvas/edges/types";
import Nodes, { tagNode } from "./components/canvas/nodes/utils";
import { ConnectionNodeType } from "./components/canvas/nodes/ConnectionNode/types";
import { SpiceNodeType } from "./components/canvas/nodes/SpiceNode/types";
import {
  SpiceData,
  SpiceNodeDefinition
} from "../context/SpiceContext/SpiceContext";
import { useHotkeys } from "react-hotkeys-hook";
import { osHotkeys } from "@/utils/hotkeys";
import { useOs } from "../context/OsContext";
import { spiceNodes } from "../context/SpiceContext/nodes/nodes";
import { getBySelector, getCenter } from "@/utils/dom";
import { v4 as uuidv4 } from "uuid";
import { useMouse } from "@uidotdev/usehooks";
import { getNodeCount } from "@/utils/nodes";
import { Shortcuts } from "@/constants/shortcuts";

const Editor: FC = () => {
  const { theme } = useTheme();

  const [mousePosition] = useMouse();

  const { getState } = useStoreApi();
  const { getNode, screenToFlowPosition, fitView } = useReactFlow();

  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>(
    getState().nodes as AppNode[]
  );

  const [edges, setEdges, onEdgesChange] = useEdgesState<AppEdge>(
    getState().edges as AppEdge[]
  );

  const { R, C, L, Gnd, V, I, G, E, F, H, Q } = spiceNodes;

  const { os } = useOs();

  useHotkeys(osHotkeys(Shortcuts.CenterSchematic.osHotKeys, os), () => {
    fitView({ nodes, duration: 300 });
  });

  const createNewSpiceNode = (
    node: SpiceNodeDefinition & Partial<SpiceData>
  ): SpiceNodeType => ({
    type: NodeType.Spice,
    id: Nodes.tagElement(uuidv4()),
    position: screenToFlowPosition({ x: mousePosition.x, y: mousePosition.y }),
    data: {
      ...node,
      name: `${node.instance_name}${getNodeCount({
        nodes,
        type: NodeType.Spice,
        instanceName: node.instance_name
      })}`,
      data: node.data || {}
    }
  });

  const createNewConnectionNode = (): ConnectionNodeType => ({
    type: NodeType.ConnectionNode,
    id: uuidv4(),
    position: screenToFlowPosition({ x: mousePosition.x, y: mousePosition.y }),
    data: {
      name: `Node${getNodeCount({ nodes, type: NodeType.ConnectionNode })}`
    }
  });

  useHotkeys(osHotkeys(Shortcuts.PlaceResistor.osHotKeys, os), () => {
    if (!R) return;

    const newComponentNode = createNewSpiceNode(R);

    setNodes((nodes: AppNode[]) => [...nodes, newComponentNode]);
  });

  useHotkeys(osHotkeys(Shortcuts.PlaceCapacitor.osHotKeys, os), () => {
    if (!C) return;

    const newComponentNode = createNewSpiceNode(C);

    setNodes((nodes: AppNode[]) => [...nodes, newComponentNode]);
  });

  useHotkeys(osHotkeys(Shortcuts.PlaceInductor.osHotKeys, os), () => {
    if (!L) return;

    const newComponentNode = createNewSpiceNode(L);

    setNodes((nodes: AppNode[]) => [...nodes, newComponentNode]);
  });

  useHotkeys(osHotkeys(Shortcuts.PlaceGround.osHotKeys, os), () => {
    if (!Gnd) return;

    const newComponentNode = createNewSpiceNode(Gnd);

    setNodes((nodes: AppNode[]) => [...nodes, newComponentNode]);
  });

  useHotkeys(osHotkeys(Shortcuts.PlaceVoltageSource.osHotKeys, os), () => {
    if (!V) return;

    const newComponentNode = createNewSpiceNode(V);

    setNodes((nodes: AppNode[]) => [...nodes, newComponentNode]);
  });

  useHotkeys(osHotkeys(Shortcuts.PlaceCurrentSource.osHotKeys, os), () => {
    if (!I) return;

    const newComponentNode = createNewSpiceNode(I);

    setNodes((nodes: AppNode[]) => [...nodes, newComponentNode]);
  });

  useHotkeys(osHotkeys(Shortcuts.PlaceVCIS.osHotKeys, os), () => {
    if (!G) return;

    const newComponentNode = createNewSpiceNode(G);

    setNodes((nodes: AppNode[]) => [...nodes, newComponentNode]);
  });

  useHotkeys(osHotkeys(Shortcuts.PlaceVCVS.osHotKeys, os), () => {
    if (!E) return;

    const newComponentNode = createNewSpiceNode(E);

    setNodes((nodes: AppNode[]) => [...nodes, newComponentNode]);
  });

  useHotkeys(osHotkeys(Shortcuts.PlaceICIS.osHotKeys, os), () => {
    if (!F) return;

    const newComponentNode = createNewSpiceNode(F);

    setNodes((nodes: AppNode[]) => [...nodes, newComponentNode]);
  });

  useHotkeys(osHotkeys(Shortcuts.PlaceICVS.osHotKeys, os), () => {
    if (!H) return;

    const newComponentNode = createNewSpiceNode(H);

    setNodes((nodes: AppNode[]) => [...nodes, newComponentNode]);
  });

  useHotkeys(osHotkeys(Shortcuts.PlaceBJT.osHotKeys, os), () => {
    if (!Q) return;

    const newComponentNode = createNewSpiceNode(Q);

    setNodes((nodes: AppNode[]) => [...nodes, newComponentNode]);
  });

  useHotkeys(osHotkeys(Shortcuts.PlaceTag.osHotKeys, os), () => {
    const newComponentNode = createNewConnectionNode();

    setNodes((nodes: AppNode[]) => [...nodes, newComponentNode]);
  });

  const calculateConnectionNodePosition = (
    source: XYPosition,
    target: XYPosition
  ): XYPosition => {
    return {
      x: Math.round((source.x + target.x) / 2),
      y: Math.round((source.y + target.y) / 2)
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

    // TODO: Allow node to node connections
    const isSourceElement = Nodes.isOfCategory(source, NodeCategory.Element);
    const isTargetElement = Nodes.isOfCategory(target, NodeCategory.Element);

    if (
      sourceNode &&
      sourceHandleNode &&
      targetNode &&
      targetHandleNode &&
      isSourceElement &&
      isTargetElement
    ) {
      const uuid = uuidv4();
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

      const newConnectionNodeId = tagNode(uuid);

      const nodeNumber = getNodeCount({ nodes, type: NodeType.ConnectionNode });

      const newConnectionNode: ConnectionNodeType = {
        type: NodeType.ConnectionNode,
        data: {
          name: `Node${nodeNumber}`
        },
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
        <Background variant={BackgroundVariant.Dots} gap={20} size={2} />
      </ReactFlow>
    </div>
  );
};

export default Editor;
