import { RadioGroup } from "@/components/ui/radio-group";
import { Simulation, SimulationConfig } from "@/types/simulation";
import { FC, useState } from "react";
import * as OperatingPoint from "./simulations/OperatingPoint";
import * as TransientAnalysis from "./simulations/TransientAnalysis";
import {
  checkSimulationUniqueness,
  getIdOfType,
  hasAnyOfType,
  isOpeartingPoint,
  isTransientAnalysis
} from "@/utils/simulation";
import { useSimulationStore } from "@/store/simulation";
import toast from "react-hot-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";

const SimulationConfiguration: FC = () => {
  const simulationMap = useSimulationStore.use.simulationsToRun();
  const enqueueSimulation = useSimulationStore.use.enqueueSimulation();

  const handleEnqueueSimulation = (newSimConfig: SimulationConfig) => {
    let isUnique = checkSimulationUniqueness(newSimConfig, simulationMap);

    if (isUnique) enqueueSimulation(newSimConfig);
    else toast.error("Simulation already in queue");
  };

  const handleDequeueSimulation = useSimulationStore.use.dequeueSimulation();

  const hasOperatingPoint = hasAnyOfType(simulationMap, isOpeartingPoint);
  const hasTransientAnalysis = hasAnyOfType(simulationMap, isTransientAnalysis);

  const operatingPointId = getIdOfType(simulationMap, isOpeartingPoint);
  const transientAnalysisId = getIdOfType(simulationMap, isTransientAnalysis);

  return (
    <Accordion type="multiple">
      <AccordionItem
        disabled={hasOperatingPoint}
        value={Simulation.OperatingPoint}
      >
        <AccordionTrigger disabled={hasOperatingPoint}>
          <OperatingPoint.Trigger isEnqueued={hasOperatingPoint} />
        </AccordionTrigger>
        <AccordionContent>
          <OperatingPoint.Content
            id={operatingPointId}
            dequeueSimulation={handleDequeueSimulation}
            isEnqueued={hasOperatingPoint}
            enqueueSimulation={handleEnqueueSimulation}
          />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem
        disabled={hasTransientAnalysis}
        value={Simulation.Transient}
      >
        <AccordionTrigger disabled={hasTransientAnalysis}>
          <TransientAnalysis.Trigger isEnqueued={hasTransientAnalysis} />
        </AccordionTrigger>
        <AccordionContent>
          <TransientAnalysis.Content
            id={transientAnalysisId}
            dequeueSimulation={handleDequeueSimulation}
            isEnqueued={hasTransientAnalysis}
            enqueueSimulation={handleEnqueueSimulation}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default SimulationConfiguration;
