import { Simulation } from "@/types/simulation";
import { FC } from "react";
import * as OperatingPoint from "./simulations/OperatingPoint";
import * as TransientAnalysis from "./simulations/TransientAnalysis";
import * as SmallSignalAC from "./simulations/SmallSignalAC";
import * as DistortionAnalysis from "./simulations/DistortionAnalysis";
import * as DCAnalysis from "./simulations/DCAnalysis";
import * as NoiseAnalysis from "./simulations/NoiseAnalysis";
import * as SensitivityAnalysis from "./simulations/SensitivityAnalysis";

import {
  hasAnyOfType,
  isDCAnalysis,
  isDistortionAnalysis,
  isNoiseAnalysis,
  isOpeartingPoint,
  isSensitivityAnalysis,
  isSmallSignalACAnalysis,
  isTransientAnalysis
} from "@/utils/simulation";
import { useSimulationStore } from "@/store/simulation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import clsx from "clsx";

const SimulationConfiguration: FC = () => {
  const simulationMap = useSimulationStore.use.simulationsToRun();

  const hasOperatingPoint = hasAnyOfType(simulationMap, isOpeartingPoint);
  const hasTransientAnalysis = hasAnyOfType(simulationMap, isTransientAnalysis);
  const hasSmallSignalACAnalysis = hasAnyOfType(
    simulationMap,
    isSmallSignalACAnalysis
  );
  const hasDCAnalysis = hasAnyOfType(simulationMap, isDCAnalysis);
  const hasDistortionAnalysis = hasAnyOfType(
    simulationMap,
    isDistortionAnalysis
  );
  const hasNoiseAnalysis = hasAnyOfType(simulationMap, isNoiseAnalysis);
  const hasSensitivityAnalysis = hasAnyOfType(
    simulationMap,
    isSensitivityAnalysis
  );

  return (
    <div className="pr-2">
      <Accordion
        defaultValue={[
          String(hasOperatingPoint && Simulation.OperatingPoint),
          String(hasTransientAnalysis && Simulation.Transient),
          String(hasSmallSignalACAnalysis && Simulation.SmallSignalAC),
          String(hasDCAnalysis && Simulation.DC),
          String(hasDistortionAnalysis && Simulation.Distortion),
          String(hasNoiseAnalysis && Simulation.Noise),
          String(hasSensitivityAnalysis && Simulation.Sensitivity)
        ].filter((tab) => tab !== "false")}
        type="multiple"
      >
        <AccordionItem value={Simulation.OperatingPoint}>
          <AccordionTrigger
            className={clsx({
              "relative [&_#status]:data-[state=closed]:opacity-100":
                hasOperatingPoint
            })}
          >
            <OperatingPoint.Trigger />
          </AccordionTrigger>
          <AccordionContent>
            <OperatingPoint.Content />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value={Simulation.SmallSignalAC}>
          <AccordionTrigger
            className={clsx({
              "relative [&_#status]:data-[state=closed]:opacity-100": true
            })}
          >
            <SmallSignalAC.Trigger />
          </AccordionTrigger>
          <AccordionContent>
            <SmallSignalAC.Content />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value={Simulation.Transient}>
          <AccordionTrigger
            className={clsx({
              "relative [&_#status]:data-[state=closed]:opacity-100": true
            })}
          >
            <TransientAnalysis.Trigger />
          </AccordionTrigger>
          <AccordionContent>
            <TransientAnalysis.Content />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value={Simulation.DC}>
          <AccordionTrigger
            className={clsx({
              "relative [&_#status]:data-[state=closed]:opacity-100": true
            })}
          >
            <DCAnalysis.Trigger />
          </AccordionTrigger>
          <AccordionContent>
            <DCAnalysis.Content />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value={Simulation.Distortion}>
          <AccordionTrigger
            className={clsx({
              "relative [&_#status]:data-[state=closed]:opacity-100": true
            })}
          >
            <DistortionAnalysis.Trigger />
          </AccordionTrigger>
          <AccordionContent>
            <DistortionAnalysis.Content />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value={Simulation.Noise}>
          <AccordionTrigger
            className={clsx({
              "relative [&_#status]:data-[state=closed]:opacity-100": true
            })}
          >
            <NoiseAnalysis.Trigger />
          </AccordionTrigger>
          <AccordionContent>
            <NoiseAnalysis.Content />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value={Simulation.Sensitivity}>
          <AccordionTrigger
            className={clsx({
              "relative [&_#status]:data-[state=closed]:opacity-100": true
            })}
          >
            <SensitivityAnalysis.Trigger />
          </AccordionTrigger>
          <AccordionContent>
            <SensitivityAnalysis.Content />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default SimulationConfiguration;
