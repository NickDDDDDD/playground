import { expect, test } from "@playwright/test";

test("shell home is reachable and the dock can collapse", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      name: "Explore new frontend ideas without losing the system."
    })
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Playground" })).toBeVisible();

  const dock = page.getByRole("navigation", {
    name: "Experiment dock"
  });
  await expect(dock).toBeVisible();
  await expect(page.getByRole("link", { name: "Welcome Lab" })).toBeVisible();

  await page.getByRole("link", { name: "Welcome Lab" }).click();
  await expect(page).toHaveURL(/\/experiments\/welcome$/);
  await expect(page.getByRole("heading", { name: "Welcome Lab" })).toBeVisible();

  const toggle = page.getByRole("button", { name: /experiment dock/ });
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await toggle.click();

  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(dock).toHaveCSS("opacity", "0");
});
