import type { ImageAction } from "./types";

export type ImageTool = "crop" | "rotate" | "resize" | "presets" | "process";
export const supportsImageAction = (actions: ImageAction["type"][] | undefined, action: ImageAction["type"]): boolean => actions === undefined || actions.includes(action);

export function supportsImageTool(actions: ImageAction["type"][] | undefined, tool: ImageTool): boolean {
  return tool === "process"
    ? (["optimize", "watermarkText", "watermarkImage"] as const).some(action => supportsImageAction(actions, action))
    : supportsImageAction(actions, tool === "presets" ? "preset" : tool);
}
