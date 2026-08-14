import { expect, test } from "@playwright/test";

test("shell home opens experiments from the dock and window controls work", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      name: "Explore new frontend ideas without losing the system."
    })
  ).toBeVisible();

  const dock = page.getByRole("navigation", {
    name: "Experiment dock"
  });
  await expect(dock).toBeVisible();
  await expect(page.getByRole("link", { name: "Welcome Lab" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Overview" })).toHaveCount(0);

  await page.getByRole("link", { name: "Welcome Lab" }).click();
  await expect(page).toHaveURL(/\/experiments\/welcome$/);
  await expect(page.getByRole("heading", { name: "Welcome Lab" })).toBeVisible();

  const maximize = page.getByRole("button", { name: "Maximize window" });
  await expect(maximize).toHaveAttribute("aria-pressed", "false");
  await maximize.click();
  await expect(page.getByRole("button", { name: "Restore window" })).toHaveAttribute(
    "aria-pressed",
    "true"
  );

  await page.getByRole("button", { name: "Minimize window" }).click();
  await expect(page.getByText("Welcome Lab is minimized")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Welcome Lab" })).toBeHidden();

  await page.getByRole("link", { name: "Welcome Lab" }).click();
  await expect(page.getByRole("heading", { name: "Welcome Lab" })).toBeVisible();

  await page.getByRole("button", { name: "Close window" }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(
    page.getByRole("heading", {
      name: "Explore new frontend ideas without losing the system."
    })
  ).toBeVisible();
});
