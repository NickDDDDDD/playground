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

  const dockLink = dock.getByRole("link", { name: "Welcome Lab" });
  const dockIcon = dockLink.locator("[data-dock-icon]");
  const baseIconWidth = (await dockIcon.boundingBox())?.width ?? 0;
  const dockBox = await dock.boundingBox();

  expect(dockBox).not.toBeNull();
  await page.mouse.move((dockBox?.x ?? 0) + (dockBox?.width ?? 0) / 2, (dockBox?.y ?? 0) - 28);
  await expect
    .poll(async () =>
      page.getByRole("navigation", { name: "Experiment dock" }).evaluate((element) => {
        return window.getComputedStyle(element).transform;
      })
    )
    .not.toBe("none");

  await expect
    .poll(async () => (await dockIcon.boundingBox())?.width ?? 0)
    .toBeGreaterThan(baseIconWidth + 4);

  await dock.getByRole("link", { name: "Welcome Lab" }).hover();
  await expect(dockIcon).toHaveClass(/button-spotlight/);
  await expect
    .poll(async () =>
      dockIcon.evaluate((element) => ({
        x: element.style.getPropertyValue("--button-spotlight-x"),
        y: element.style.getPropertyValue("--button-spotlight-y")
      }))
    )
    .toMatchObject({
      x: /\d+(\.\d+)?px/,
      y: /\d+(\.\d+)?px/
    });
  await expect
    .poll(async () => (await dockIcon.boundingBox())?.width ?? 0)
    .toBeLessThan(baseIconWidth * 1.75);
  await expect
    .poll(async () =>
      dockLink.evaluate((element) => {
        const tooltip = element.querySelector<HTMLElement>(".mac-dock-tooltip");
        const icon = element.querySelector<HTMLElement>("[data-dock-icon]");

        if (!tooltip || !icon) {
          return false;
        }

        const tooltipBox = tooltip.getBoundingClientRect();
        const iconBox = icon.getBoundingClientRect();

        const gap = iconBox.top - tooltipBox.bottom;

        return gap >= 4 && gap <= 32;
      })
    )
    .toBe(true);

  await dock.getByRole("link", { name: "Welcome Lab" }).click();
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

test("welcome lab action spotlight follows the pointer", async ({ page }) => {
  await page.goto("/");

  const openAction = page.locator("main a:has(.button-spotlight) .button-spotlight").last();
  await expect(openAction).toBeVisible();
  await page.waitForTimeout(500);
  const actionBox = await openAction.boundingBox();

  expect(actionBox).not.toBeNull();

  await page.mouse.move((actionBox?.x ?? 0) + 8, (actionBox?.y ?? 0) + 8);
  const firstPosition = await openAction.evaluate((element) => ({
    x: element.style.getPropertyValue("--button-spotlight-x"),
    y: element.style.getPropertyValue("--button-spotlight-y")
  }));

  await page.mouse.move((actionBox?.x ?? 0) + (actionBox?.width ?? 0) - 8, (actionBox?.y ?? 0) + 8);
  const secondPosition = await openAction.evaluate((element) => ({
    x: element.style.getPropertyValue("--button-spotlight-x"),
    y: element.style.getPropertyValue("--button-spotlight-y")
  }));

  expect(Math.abs(parseFloat(firstPosition.x) - parseFloat(secondPosition.x))).toBeGreaterThan(20);
  expect(Math.abs(parseFloat(firstPosition.y) - parseFloat(secondPosition.y))).toBeLessThan(2);
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
  await expect(focusScreen).toHaveAttribute("data-state", "entered", { timeout: 1_000 });
  await expect(page.getByRole("button", { name: "Wake Playground" })).toBeVisible();

  await page.getByRole("button", { name: "Wake Playground" }).click();
  await expect(focusScreen).toHaveAttribute("data-state", "exiting");
  await expect
    .poll(async () =>
      focusScreen.evaluate((element) => {
        const opacity = Number(window.getComputedStyle(element).opacity);
        const transform = window.getComputedStyle(element).transform;
        const translateY = transform === "none" ? 0 : Number(transform.split(", ")[5]?.replace(")", ""));

        return opacity < 1 && translateY === 0;
      })
    )
    .toBe(true);
  await expect(focusScreen).toHaveCount(0);
  await expect(
    page.getByRole("heading", {
      name: "Explore new frontend ideas without losing the system."
    })
  ).toBeVisible();
});
