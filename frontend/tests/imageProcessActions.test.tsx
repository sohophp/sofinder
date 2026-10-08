// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { ImageProcessDialog } from "../src/components/ImageProcessDialog";
import type { Entry } from "../src/types";

afterEach(cleanup);
const entry: Entry = { path: "photo.png", name: "photo.png", directory: false, size: 80, modifiedAt: 1, mimeType: "image/png", url: "/photo.png", capabilities: {} };
const labels = { title: "Process", close: "Close", cancel: "Cancel", apply: "Apply", processing: "Working", selected: "{count} images", operation: "Operation", optimize: "Optimize", textWatermark: "Text watermark", imageWatermark: "Image watermark", watermarkText: "Text", saveMode: "Save mode", saveCopy: "Copy", overwrite: "Overwrite" };

it("selects the sole declared batch action and sends it without changing the save mode", async () => {
  const apply = vi.fn().mockResolvedValue(undefined);
  render(<ImageProcessDialog entries={[entry]} resource="Images" formats={["png"]} actions={["watermarkText"]} labels={labels} onClose={vi.fn()} onApply={apply}/>);
  expect(screen.getByRole("combobox", { name: "Operation" })).toHaveValue("text");
  expect(screen.getByRole("combobox", { name: "Operation" }).querySelectorAll("option")).toHaveLength(1);
  expect(screen.queryByRole("option", { name: "Optimize" })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Apply" }));
  await waitFor(() => expect(apply).toHaveBeenCalledWith([expect.objectContaining({ type: "watermarkText", text: "SoFinder" })], { mode: "copy" }));
});

it("cannot submit an explicitly empty action declaration", () => {
  const apply = vi.fn();
  render(<ImageProcessDialog entries={[entry]} resource="Images" formats={["png"]} actions={[]} labels={labels} onClose={vi.fn()} onApply={apply}/>);
  expect(screen.getByRole("button", { name: "Apply" })).toBeDisabled();
  expect(screen.getByRole("combobox", { name: "Operation" }).querySelectorAll("option")).toHaveLength(0);
  fireEvent.click(screen.getByRole("button", { name: "Apply" }));
  expect(apply).not.toHaveBeenCalled();
});
