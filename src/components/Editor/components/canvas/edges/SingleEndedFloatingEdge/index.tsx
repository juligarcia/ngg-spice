import {
  EdgeProps,
  Node,
  Position,
  SmoothStepEdge,
  useInternalNode
} from "@xyflow/react";

import { getEdgeParams, getRotatedHandlePositionById } from "../utils.js";
import { FC } from "react";
import { WithRotation } from "../../nodes/types.js";

interface SingleEndedFloatingEdgeProps extends EdgeProps {}

const SingleEndedFloatingEdge: FC<SingleEndedFloatingEdgeProps> = ({
  id,
  source,
  target,
  sourceHandleId
}) => {
  const sourceNode = useInternalNode<Node<WithRotation>>(source);
  const targetNode = useInternalNode(target);

  if (!sourceNode || !targetNode) {
    return null;
  }

  const {
    data: { withRotation }
  } = sourceNode;

  const [sx, sy] = getRotatedHandlePositionById(
    sourceNode,
    sourceHandleId as string,
    withRotation?.[String(sourceHandleId)]!
  );

  const { tx, ty, targetPos } = getEdgeParams(sourceNode, targetNode);

  return (
    <SmoothStepEdge
      pathOptions={{ offset: 10, borderRadius: 3 }}
      id={id}
      sourceX={sx}
      sourceY={sy}
      sourcePosition={
        withRotation?.[
          String(sourceHandleId) as keyof WithRotation["withRotation"]
        ] || Position.Top
      }
      targetPosition={targetPos}
      targetX={tx}
      targetY={ty}
    />
  );
};

export default SingleEndedFloatingEdge;
