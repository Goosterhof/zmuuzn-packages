import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ExperimentSwitcher from "../src/components/ExperimentSwitcher.vue";

describe("ExperimentSwitcher", () => {
  it("should render all three experiments", () => {
    const wrapper = mount(ExperimentSwitcher, {
      props: { currentExperiment: "gatekeeper" },
    });
    const items = wrapper.findAll("li");
    expect(items).toHaveLength(3);
  });

  it("should render the active experiment as a span, not a link", () => {
    const wrapper = mount(ExperimentSwitcher, {
      props: { currentExperiment: "war-table" },
    });
    const spans = wrapper.findAll("span");
    const activeSpan = spans.find((s) => s.text() === "War Table");
    expect(activeSpan).toBeDefined();

    const links = wrapper.findAll("a");
    const activeLink = links.find((a) => a.text() === "War Table");
    expect(activeLink).toBeUndefined();
  });

  it("should render inactive experiments as links with correct URLs", () => {
    const wrapper = mount(ExperimentSwitcher, {
      props: { currentExperiment: "gatekeeper" },
    });
    const links = wrapper.findAll("a");
    expect(links).toHaveLength(2);

    const warTableLink = links.find((a) => a.text() === "War Table");
    expect(warTableLink?.attributes("href")).toBe("https://helldivers.zmuuzn.nl");

    const crucibleLink = links.find((a) => a.text() === "Crucible");
    expect(crucibleLink?.attributes("href")).toBe("https://strava.zmuuzn.nl");
  });

  it("should apply the experiment accent color to the active underline", () => {
    const wrapper = mount(ExperimentSwitcher, {
      props: { currentExperiment: "gatekeeper" },
    });
    const activeSpan = wrapper.findAll("span").find((s) => s.text() === "Gatekeeper");
    const style = activeSpan?.attributes("style") ?? "";
    expect(style).toContain("#D97706");
  });
});
