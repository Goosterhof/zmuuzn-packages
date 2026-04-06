import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { createRouter, createMemoryHistory } from "vue-router";
import LabBarMobile from "../src/components/LabBarMobile.vue";

const createTestRouter = () =>
  createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: "/", component: { template: "<div />" } },
      { path: "/leaderboard", component: { template: "<div />" } },
    ],
  });

const mountMobile = (props: Record<string, unknown> = {}) =>
  mount(LabBarMobile, {
    props: {
      currentExperiment: "war-table",
      user: { name: "Goos" },
      localNav: [],
      ...props,
    },
    global: {
      plugins: [createTestRouter()],
      stubs: { Teleport: true },
    },
  });

describe("LabBarMobile", () => {
  it("should render the brand mark pill and hamburger button", () => {
    const wrapper = mountMobile();
    expect(wrapper.text()).toContain("zmuuzn");
    expect(wrapper.find('button[aria-label="Open menu"]').exists()).toBe(true);
  });

  it("should not render drawer by default", () => {
    const wrapper = mountMobile();
    expect(wrapper.find('[aria-label="Close menu"]').exists()).toBe(false);
  });

  it("should open drawer when hamburger is clicked", async () => {
    const wrapper = mountMobile();
    await wrapper.find('button[aria-label="Open menu"]').trigger("click");
    expect(wrapper.find('[aria-label="Close menu"]').exists()).toBe(true);
  });

  it("should render experiments in the drawer", async () => {
    const wrapper = mountMobile();
    await wrapper.find('button[aria-label="Open menu"]').trigger("click");
    expect(wrapper.text()).toContain("Gatekeeper");
    expect(wrapper.text()).toContain("War Room");
    expect(wrapper.text()).toContain("Crucible");
    expect(wrapper.text()).toContain("Parlour");
  });

  it("should render local nav items in the drawer", async () => {
    const wrapper = mountMobile({
      localNav: [
        { label: "Dashboard", to: "/" },
        { label: "Leaderboard", to: "/leaderboard" },
      ],
    });
    await wrapper.find('button[aria-label="Open menu"]').trigger("click");
    expect(wrapper.text()).toContain("Dashboard");
    expect(wrapper.text()).toContain("Leaderboard");
  });

  it("should render user name and experiment-aware exit label in the drawer", async () => {
    const wrapper = mountMobile({ currentExperiment: "gatekeeper" });
    await wrapper.find('button[aria-label="Open menu"]').trigger("click");
    expect(wrapper.text()).toContain("Goos");
    expect(wrapper.text()).toContain("Leave the vault");
  });

  it("should render laboratory section headers in the drawer", async () => {
    const wrapper = mountMobile({
      localNav: [{ label: "Dashboard", to: "/" }],
    });
    await wrapper.find('button[aria-label="Open menu"]').trigger("click");
    expect(wrapper.text()).toContain("Stations");
    expect(wrapper.text()).toContain("Corridors");
  });

  it("should emit logout when exit button is clicked in drawer", async () => {
    const wrapper = mountMobile({ currentExperiment: "gatekeeper" });
    await wrapper.find('button[aria-label="Open menu"]').trigger("click");
    const buttons = wrapper.findAll("nav button");
    const exitBtn = buttons.find((b) => b.text().trim() === "Leave the vault");
    await exitBtn!.trigger("click");
    expect(wrapper.emitted("logout")).toHaveLength(1);
  });
});
