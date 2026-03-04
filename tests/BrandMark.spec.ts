import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import BrandMark from "../src/components/BrandMark.vue";

describe("BrandMark", () => {
  it("should render 7 star SVGs", () => {
    const wrapper = mount(BrandMark);
    const svgs = wrapper.findAll("svg");
    expect(svgs).toHaveLength(7);
  });

  it("should render the zmuuzn wordmark", () => {
    const wrapper = mount(BrandMark);
    expect(wrapper.text()).toContain("zmuuzn");
  });

  it("should show the app name segment when currentExperiment is provided", () => {
    const wrapper = mount(BrandMark, {
      props: { currentExperiment: "gatekeeper" },
    });
    expect(wrapper.text()).toContain("Gatekeeper");
  });

  it("should hide the app name segment when currentExperiment is not provided", () => {
    const wrapper = mount(BrandMark);
    expect(wrapper.text()).not.toContain("Gatekeeper");
    expect(wrapper.text()).not.toContain("War Table");
    expect(wrapper.text()).not.toContain("Crucible");
  });

  it("should render the correct label for each experiment", () => {
    const experiments = [
      { id: "gatekeeper" as const, label: "Gatekeeper" },
      { id: "war-table" as const, label: "War Table" },
      { id: "crucible" as const, label: "Crucible" },
    ];

    for (const exp of experiments) {
      const wrapper = mount(BrandMark, {
        props: { currentExperiment: exp.id },
      });
      expect(wrapper.text()).toContain(exp.label);
    }
  });

  it("should default to sm size", () => {
    const wrapper = mount(BrandMark);
    const starSvg = wrapper.find("svg");
    expect(starSvg.attributes("style")).toContain("width: 7px");
  });

  it("should use smaller stars for xs size", () => {
    const wrapper = mount(BrandMark, {
      props: { size: "xs" },
    });
    const starSvg = wrapper.find("svg");
    expect(starSvg.attributes("style")).toContain("width: 5px");
  });
});
