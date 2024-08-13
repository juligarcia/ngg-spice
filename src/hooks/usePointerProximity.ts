import { useEffect, useState } from "react";

function easeOutQuint(x: number): number {
  return 1 - Math.pow(x, 3);
}

interface UsePointerProximitiArgs {
  id?: string;
  selector?: string;
  threshold?: number;
  disabled?: boolean;
}

const usePointerProximity = ({
  id,
  selector = "id",
  threshold = 100,
  disabled = false
}: UsePointerProximitiArgs) => {
  const [pointerProximity, setPointerProximity] = useState(0);

  useEffect(() => {
    if (!id) return;

    const target = document.querySelector(`[${selector}="${id}"]`);

    const updateMousePosition = (event: MouseEvent) => {
      if (!target || disabled) return setPointerProximity(0);

      const {
        x: targetX,
        y: targetY,
        width: targetWidth,
        height: targetHeight
      } = target.getBoundingClientRect();

      const centerX = targetX + targetWidth / 2;
      const centerY = targetY + targetHeight / 2;

      const mouseX = event.clientX;
      const mouseY = event.clientY;

      const vecX = Math.pow(centerX - mouseX, 2);
      const vecY = Math.pow(centerY - mouseY, 2);

      const distance = Math.sqrt(vecX + vecY);

      setPointerProximity(
        Math.round(easeOutQuint(Math.min(distance / threshold, 1)) * 100)
      );
    };

    window.addEventListener("mousemove", updateMousePosition);

    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, [disabled]);

  return pointerProximity;
};
export default usePointerProximity;
