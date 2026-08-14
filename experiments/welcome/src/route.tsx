import type { ExperimentModule } from "@playground/experiment-contract";
import { WelcomePage } from "./welcome-page";

export const welcomeExperiment: ExperimentModule = {
  id: "welcome",
  title: "Welcome Lab",
  description: "A first experiment that proves shell mounting and standalone startup.",
  path: "/experiments/welcome",
  tags: ["react", "routing", "state", "ui"],
  Component: WelcomePage
};
