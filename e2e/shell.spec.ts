import { expect, test } from "@playwright/test";

test("shell home is reachable and the sidebar can collapse", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      name: "Explore new frontend ideas without losing the system."
    })
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Playground" })).toBeVisible();

  const navigation = page.getByRole("complementary", {
    name: "Experiment navigation"
  });
  const expandedBox = await navigation.boundingBox();
  expect(expandedBox?.width).toBeGreaterThan(200);

  const toggle = page.getByRole("button", { name: "Toggle sidebar" });
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await toggle.click();

  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(page.getByRole("link", { name: "Playground" })).toBeHidden();
  await expect(navigation).toHaveCSS("width", "64px");

  const collapsedBox = await navigation.boundingBox();
  expect(collapsedBox?.width).toBeLessThan(100);
});
