import { FC, ReactNode } from "react";
import { Typography } from "./Typography";
import { FieldError } from "react-hook-form";

interface FieldContainerProps {
  postfix?: string;
  children: ReactNode;
  error?: FieldError;
}

const FieldContainer: FC<FieldContainerProps> = ({
  children,
  postfix,
  error
}) => (
  <div>
    <div className="flex items-center">
      {children}
      {postfix && (
        <Typography
          className="px-4 text-muted-foreground w-16 text-center font-bold"
          variant="small"
        >
          {postfix}
        </Typography>
      )}
    </div>
    {error && (
      <Typography className="text-destructive pl-3 pt-1">
        {error.message}
      </Typography>
    )}
  </div>
);

export default FieldContainer;
