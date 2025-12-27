const FLOW: Record<string, string[]> = {
  NEW: ["IN_PROGRESS"],
  IN_PROGRESS: ["REPAIRED", "SCRAP"],
  REPAIRED: [],
  SCRAP: []
};

export const validateTransition = (from: string, to: string) => {
  if (!FLOW[from]?.includes(to)) {
    throw new Error(`Invalid status transition: ${from} → ${to}`);
  }
};
