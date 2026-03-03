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
  it("should render the Zmuuzn logo and hamburger button", () => {
    const wrapper = mountMobile();
    expect(wrapper.text()).toContain("Zmuuzn");
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
    expect(wrapper.text()).toContain("War Table");
    expect(wrapper.text()).toContain("Crucible");
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

  it("should render user name and logout in the drawer", async () => {
    const wrapper = mountMobile({ currentExperiment: "gatekeeper" });
    await wrapper.find('button[aria-label="Open menu"]').trigger("click");
    expect(wrapper.text()).toContain("Goos");
    expect(wrapper.text()).toContain("Logout");
  });

  it("should emit logout when logout is clicked in drawer", async () => {
    const wrapper = mountMobile({ currentExperiment: "gatekeeper" });
    await wrapper.find('button[aria-label="Open menu"]').trigger("click");
    const buttons = wrapper.findAll("nav button");
    const logoutBtn = buttons.find((b) => b.text().trim() === "Logout");
    await logoutBtn!.trigger("click");
    expect(wrapper.emitted("logout")).toHaveLength(1);
  });
});
