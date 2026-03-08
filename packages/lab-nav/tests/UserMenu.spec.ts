import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import UserMenu from "../src/components/UserMenu.vue";

describe("UserMenu", () => {
  it("should render user name when user is provided", () => {
    const wrapper = mount(UserMenu, {
      props: { user: { name: "Goos" }, currentExperiment: "gatekeeper" },
    });
    expect(wrapper.text()).toContain("Goos");
  });

  it("should not show dropdown by default", () => {
    const wrapper = mount(UserMenu, {
      props: { user: { name: "Goos" }, currentExperiment: "gatekeeper" },
    });
    const buttons = wrapper.findAll("button");
    // Only the trigger button, no logout button visible
    expect(buttons).toHaveLength(1);
  });

  it("should toggle dropdown on click and show experiment-aware exit label", async () => {
    const wrapper = mount(UserMenu, {
      props: { user: { name: "Goos" }, currentExperiment: "gatekeeper" },
    });
    await wrapper.find("button").trigger("click");
    const buttons = wrapper.findAll("button");
    // Trigger + exit button
    expect(buttons).toHaveLength(2);
    expect(buttons[1].text()).toBe("Leave the vault");
  });

  it("should show correct exit label for each experiment", async () => {
    const cases = [
      { id: "gatekeeper" as const, label: "Leave the vault" },
      { id: "war-table" as const, label: "Dismiss" },
      { id: "crucible" as const, label: "Exit the forge" },
    ];

    for (const exp of cases) {
      const wrapper = mount(UserMenu, {
        props: { user: { name: "Goos" }, currentExperiment: exp.id },
      });
      await wrapper.find("button").trigger("click");
      const exitBtn = wrapper.findAll("button")[1];
      expect(exitBtn.text()).toBe(exp.label);
    }
  });

  it("should emit logout when exit button is clicked", async () => {
    const wrapper = mount(UserMenu, {
      props: { user: { name: "Goos" }, currentExperiment: "gatekeeper" },
    });
    await wrapper.find("button").trigger("click");
    const exitBtn = wrapper.findAll("button")[1];
    await exitBtn.trigger("click");
    expect(wrapper.emitted("logout")).toHaveLength(1);
  });
});
