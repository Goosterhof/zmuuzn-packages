import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { createRouter, createMemoryHistory } from "vue-router";
import LabBar from "../src/components/LabBar.vue";

const createTestRouter = () =>
  createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: "/", component: { template: "<div />" } },
      { path: "/leaderboard", component: { template: "<div />" } },
    ],
  });

describe("LabBar", () => {
  it("should render the brand mark pill with zmuuzn wordmark", () => {
    const wrapper = mount(LabBar, {
      props: {
        currentExperiment: "war-table",
        user: { name: "Goos" },
        localNav: [],
      },
      global: { plugins: [createTestRouter()] },
    });
    expect(wrapper.text()).toContain("zmuuzn");
  });

  it("should render the experiment switcher", () => {
    const wrapper = mount(LabBar, {
      props: {
        currentExperiment: "war-table",
        user: { name: "Goos" },
        localNav: [],
      },
      global: { plugins: [createTestRouter()] },
    });
    expect(wrapper.text()).toContain("War Room");
    expect(wrapper.text()).toContain("Gatekeeper");
    expect(wrapper.text()).toContain("Crucible");
    expect(wrapper.text()).toContain("Parlour");
  });

  it("should render the user menu with the user name", () => {
    const wrapper = mount(LabBar, {
      props: {
        currentExperiment: "gatekeeper",
        user: { name: "Goos" },
        localNav: [],
      },
      global: { plugins: [createTestRouter()] },
    });
    expect(wrapper.text()).toContain("Goos");
  });

  it("should render local nav items as router-links", () => {
    const wrapper = mount(LabBar, {
      props: {
        currentExperiment: "war-table",
        user: { name: "Goos" },
        localNav: [
          { label: "Dashboard", to: "/" },
          { label: "Leaderboard", to: "/leaderboard" },
        ],
      },
      global: { plugins: [createTestRouter()] },
    });
    expect(wrapper.text()).toContain("Dashboard");
    expect(wrapper.text()).toContain("Leaderboard");
  });

  it("should not render local nav section when localNav is empty", () => {
    const wrapper = mount(LabBar, {
      props: {
        currentExperiment: "war-table",
        user: { name: "Goos" },
        localNav: [],
      },
      global: { plugins: [createTestRouter()] },
    });
    const rows = wrapper.findAll("header > div");
    expect(rows).toHaveLength(1);
  });

  it("should emit logout when user menu triggers logout", async () => {
    const wrapper = mount(LabBar, {
      props: {
        currentExperiment: "gatekeeper",
        user: { name: "Goos" },
        localNav: [],
      },
      global: { plugins: [createTestRouter()] },
    });
    // Open user menu dropdown
    const triggerBtn = wrapper.find("button");
    await triggerBtn.trigger("click");
    // Click exit button (experiment-aware label)
    const buttons = wrapper.findAll("button");
    const exitBtn = buttons.find((b) => b.text() === "Leave the vault");
    await exitBtn!.trigger("click");
    expect(wrapper.emitted("logout")).toHaveLength(1);
  });

  it("should render slot content in local-nav-end", () => {
    const wrapper = mount(LabBar, {
      props: {
        currentExperiment: "gatekeeper",
        user: { name: "Goos" },
        localNav: [{ label: "Home", to: "/" }],
      },
      slots: {
        "local-nav-end": '<span data-test="slot">Admin Badge</span>',
      },
      global: { plugins: [createTestRouter()] },
    });
    expect(wrapper.find('[data-test="slot"]').text()).toBe("Admin Badge");
  });
});
