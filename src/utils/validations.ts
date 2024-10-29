import { unitRegExp } from "@/constants/validation";

export const isUnit = (element: string) => (value?: string) =>
  value === undefined || unitRegExp.test(value) || `Invalid ${element} value`;
