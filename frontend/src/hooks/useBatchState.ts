import { useState } from "react";
import type { DestinationState } from "../components/DestinationDialog";

export function useBatchState() {
  const [destinationDialog, setDestinationDialog] = useState<DestinationState | null>(null);
  const [bulkRenameOpen, setBulkRenameOpen] = useState(false);

  return { destinationDialog, setDestinationDialog, bulkRenameOpen, setBulkRenameOpen };
}
