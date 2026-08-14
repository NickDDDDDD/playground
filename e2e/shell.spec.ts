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

  await dock.getByRole("link", { name: "Welcome Lab" }).hover();
  await expect
    .poll(async () =>
      page.getByRole("navigation", { name: "Experiment dock" }).evaluate((element) => {
        return window.getComputedStyle(element).transform;
      })
    )
    .not.toBe("none");

  await page.getByRole("link", { name: "Welcome Lab" }).click();
  await expect(page).toHaveURL(/\/experiments\/welcome$/);
  await expect(page.getByRole("heading", { name: "Welcome Lab" })).toBeVisible();
  const windowBox = await page.locator(".liquid-window").boundingBox();

  const maximize = page.getByRole("button", { name: "Maximize window" });
  await expect(maximize).toHaveAttribute("aria-pressed", "false");
  await maximize.click();
  await expect(page.getByRole("button", { name: "Restore window" })).toHaveAttribute(
    "aria-pressed",
    "true"
  );
  await expect
    .poll(async () => {
      const maximizedBox = await page.locator(".liquid-window").boundingBox();

      return maximizedBox?.height ?? 0;
    })
    .toBeGreaterThan((windowBox?.height ?? 0) + 50);
  const maximizedBox = await page.locator(".liquid-window").boundingBox();
  expect(maximizedBox?.width).toBeGreaterThan((windowBox?.width ?? 0) + 50);
  expect(maximizedBox?.height).toBeGreaterThan((windowBox?.height ?? 0) + 50);

  await page.getByRole("button", { name: "Minimize window" }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(
    page.getByRole("heading", {
      name: "Explore new frontend ideas without losing the system."
    })
  ).toBeVisible();
  await expect(dock.locator("[data-active='true']")).toBeVisible();

  await dock.getByRole("link", { name: "Welcome Lab" }).click();
  await expect(page.getByRole("heading", { name: "Welcome Lab" })).toBeVisible();

  await page.getByRole("button", { name: "Close window" }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(
    page.getByRole("heading", {
      name: "Explore new frontend ideas without losing the system."
    })
  ).toBeVisible();
  await expect(dock.locator("[data-active='true']")).toHaveCount(0);
});

test("desktop context menu can enter and leave focus sleep", async ({ page }) => {
  await page.goto("/");

  await page.mouse.click(40, 620, { button: "right" });
  const menu = page.getByRole("menu", { name: "Desktop menu" });

  await expect(menu).toBeVisible();
  await expect(menu.getByRole("menuitem", { name: "Open first lab" })).toBeVisible();

  await menu.getByRole("menuitem", { name: "Focus / Sleep Screen" }).click();
  const focusScreen = page.getByRole("dialog", { name: "Focus screen" });

  await expect(focusScreen).toBeVisible();
  await expect(focusScreen).toHaveAttribute("data-state", "entering");
  await expect(focusScreen).toHaveAttribute("data-state", "entered", { timeout: 1_000 });
  await expect(page.getByRole("button", { name: "Wake Playground" })).toBeVisible();

  await page.getByRole("button", { name: "Wake Playground" }).click();
  await expect(focusScreen).toHaveAttribute("data-state", "exiting");
  await expect(focusScreen).toHaveCount(0);
  await expect(
    page.getByRole("heading", {
      name: "Explore new frontend ideas without losing the system."
    })
  ).toBeVisible();
});
