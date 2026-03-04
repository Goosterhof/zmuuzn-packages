import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import UserMenu from "../src/components/UserMenu.vue";

describe("UserMenu", () => {
  it("should render user name when user is provided", () => {
    const wrapper = mount(UserMenu, {
      props: { user: { name: "Goos" } },
    });
    expect(wrapper.text()).toContain("Goos");
  });

  it("should not show dropdown by default", () => {
    const wrapper = mount(UserMenu, {
      props: { user: { name: "Goos" } },
    });
    const buttons = wrapper.findAll("button");
    // Only the trigger button, no logout button visible
    expect(buttons).toHaveLength(1);
  });

  it("should toggle dropdown on click", async () => {
    const wrapper = mount(UserMenu, {
      props: { user: { name: "Goos" } },
    });
    await wrapper.find("button").trigger("click");
    const buttons = wrapper.findAll("button");
    // Trigger + logout button
    expect(buttons).toHaveLength(2);
    expect(buttons[1].text()).toBe("Logout");
  });

  it("should emit logout when logout button is clicked", async () => {
    const wrapper = mount(UserMenu, {
      props: { user: { name: "Goos" } },
    });
    await wrapper.find("button").trigger("click");
    const logoutBtn = wrapper.findAll("button")[1];
    await logoutBtn.trigger("click");
    expect(wrapper.emitted("logout")).toHaveLength(1);
  });
});
