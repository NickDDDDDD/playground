import type { ComponentType } from "react";

export type ExperimentTag =
  | "react"
  | "state"
  | "routing"
  | "ui"
  | "data"
  | "animation"
  | "tooling";

export type ExperimentModule = {
  id: string;
  title: string;
  description: string;
  path: `/experiments/${string}`;
  tags: ExperimentTag[];
  Component: ComponentType;
};
