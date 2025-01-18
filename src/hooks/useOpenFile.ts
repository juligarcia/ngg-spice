import { useSimulationStore } from "@/store/simulation";
import {
  ContractEdge,
  ContractNode,
  ContractSimulationsToRun
} from "@/utils/contract";
import { listen } from "@tauri-apps/api/event";
import { useReactFlow } from "@xyflow/react";
import { useEffect } from "react";

type OpenFile = {
  nodes: ContractNode[];
  edges: ContractEdge[];
  config: ContractSimulationsToRun;
};

const useOpenFile = () => {
  const { setNodes, setEdges } = useReactFlow();

  const setSimulationsToRun = useSimulationStore.use.setSimulationsToRun();

  useEffect(() => {
    const will_be_unlisten = listen<OpenFile>("open_file", (event) => {
      console.log(event.payload.edges);
      console.log(event.payload.nodes);

      setNodes(ContractNode.toDomain(event.payload.nodes, 2));
      setEdges(ContractEdge.toDomain(event.payload.edges));
      setSimulationsToRun(event.payload.config);
    });

    return () => {
      will_be_unlisten.then((unlisten) => unlisten());
    };
  }, [setNodes, setEdges, setSimulationsToRun]);
};

export default useOpenFile;
