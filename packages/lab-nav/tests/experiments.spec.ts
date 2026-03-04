import { describe, it, expect } from "vitest";
import { experiments } from "../src/experiments";

describe("experiments", () => {
  it("should contain exactly three experiments", () => {
    expect(experiments).toHaveLength(3);
  });

  it("should include gatekeeper, war-table, and crucible", () => {
    const ids = experiments.map((e) => e.id);
    expect(ids).toContain("gatekeeper");
    expect(ids).toContain("war-table");
    expect(ids).toContain("crucible");
  });

  it("should have valid URLs following the *.zmuuzn.nl pattern", () => {
    for (const exp of experiments) {
      expect(exp.url).toMatch(/^https:\/\/[a-z]+\.zmuuzn\.nl$/);
    }
  });

  it("should have valid hex accent colors", () => {
    for (const exp of experiments) {
      expect(exp.accentColor).toMatch(/^#[0-9A-F]{6}$/i);
    }
  });

  it("should have non-empty labels", () => {
    for (const exp of experiments) {
      expect(exp.label.length).toBeGreaterThan(0);
    }
  });
});
