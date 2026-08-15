import { expect, test } from "@playwright/test";

const routes = ["/", "/experiments/welcome", "/not-a-real-route"];
const viewports = [
  { name: "desktop", width: 1280, height: 800 },
  { name: "mobile", width: 390, height: 844 }
] as const;

test.describe("visual accessibility", () => {
  for (const viewport of viewports) {
    test(`text contrast passes on core routes at ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize(viewport);

      for (const route of routes) {
        await page.goto(route);
        await page.waitForLoadState("networkidle");
        await page.waitForTimeout(500);

        const failures = await findContrastFailures(page);

        expect(failures, `${route} at ${viewport.name}`).toEqual([]);
      }
    });
  }

  test("link buttons keep their foreground utility color", async ({ page }) => {
    await page.goto("/");

    const openButton = page.getByRole("link", { name: /Open first lab/ });
    await expect(openButton).toHaveCSS("color", "rgb(255, 255, 255)");
  });

  test("liquid card material is not overridden by card primitive defaults", async ({ page }) => {
    await page.goto("/");

    const featureCard = page.locator(".liquid-card", { hasText: "Monorepo" });
    await expect(featureCard).toBeVisible();

    const material = await featureCard.evaluate((element) => {
      const style = window.getComputedStyle(element);

      return {
        background: style.background,
        borderColor: style.borderColor,
        boxShadow: style.boxShadow
      };
    });

    expect(material.background).toContain("rgba(255, 255, 255, 0.22)");
    expect(material.borderColor).toBe("rgba(255, 255, 255, 0.46)");
    expect(material.boxShadow).toContain("rgba(16, 16, 25, 0.2) 0px 18px 56px");
  });

  test("overview cards keep enough shadow bleed inside the scroll container", async ({ page }) => {
    await page.goto("/");

    const bleed = await page.locator("main section").evaluate((section) => {
      const main = section.closest("main");
      const firstCard = section.querySelector(".liquid-card");

      if (!main || !firstCard) {
        return null;
      }

      const mainRect = main.getBoundingClientRect();
      const cardRect = firstCard.getBoundingClientRect();

      return {
        left: cardRect.left - mainRect.left,
        top: cardRect.top - mainRect.top
      };
    });

    expect(bleed).not.toBeNull();
    expect(bleed?.left).toBeGreaterThanOrEqual(32);
    expect(bleed?.top).toBeGreaterThanOrEqual(32);
  });
});

type ContrastFailure = {
  background: string;
  className: string | null;
  color: string;
  contrast: number;
  fontSize: number;
  fontWeight: number;
  tag: string;
  text: string | undefined;
  threshold: number;
};

async function findContrastFailures(page: import("@playwright/test").Page) {
  return page.evaluate<ContrastFailure[]>(() => {
    const parseRgb = (value: string) => {
      const match = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?/);

      if (!match) {
        return null;
      }

      return [
        Number(match[1]),
        Number(match[2]),
        Number(match[3]),
        match[4] === undefined ? 1 : Number(match[4])
      ] as const;
    };

    const blend = (
      foreground: readonly [number, number, number, number],
      background: readonly [number, number, number, number]
    ) => {
      const alpha = foreground[3];

      return [
        Math.round(foreground[0] * alpha + background[0] * (1 - alpha)),
        Math.round(foreground[1] * alpha + background[1] * (1 - alpha)),
        Math.round(foreground[2] * alpha + background[2] * (1 - alpha)),
        1
      ] as const;
    };

    const srgbToLinear = (value: number) => {
      const channel = value / 255;

      return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
    };

    const luminance = (color: readonly [number, number, number, number]) =>
      0.2126 * srgbToLinear(color[0]) +
      0.7152 * srgbToLinear(color[1]) +
      0.0722 * srgbToLinear(color[2]);

    const contrastRatio = (
      foreground: readonly [number, number, number, number],
      background: readonly [number, number, number, number]
    ) => {
      const foregroundLuminance = luminance(foreground);
      const backgroundLuminance = luminance(background);

      return (
        (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) /
        (Math.min(foregroundLuminance, backgroundLuminance) + 0.05)
      );
    };

    const effectiveBackground = (element: Element) => {
      let current: Element | null = element;
      const chain: Element[] = [];
      let background = [255, 255, 255, 1] as const;

      while (current) {
        chain.push(current);
        current = current.parentElement;
      }

      for (const ancestor of chain.reverse()) {
        const parsed = parseRgb(getComputedStyle(ancestor).backgroundColor);

        if (parsed && parsed[3] > 0) {
          background = blend(parsed, background);
        }
      }

      return background;
    };

    const isVisible = (element: Element) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();

      return (
        style.visibility !== "hidden" &&
        style.display !== "none" &&
        Number(style.opacity) !== 0 &&
        rect.width > 0 &&
        rect.height > 0
      );
    };

    return Array.from(document.querySelectorAll("body *"))
      .filter((element) => {
        const hasDirectText = Array.from(element.childNodes).some(
          (node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim()
        );

        return hasDirectText && isVisible(element);
      })
      .flatMap((element) => {
        const style = getComputedStyle(element);
        const foreground = parseRgb(style.color);

        if (!foreground) {
          return [];
        }

        const background = effectiveBackground(element);
        const fontSize = parseFloat(style.fontSize);
        const fontWeight = Number(style.fontWeight) || 400;
        const isLargeText = fontSize >= 24 || (fontSize >= 18.66 && fontWeight >= 700);
        const threshold = isLargeText ? 3 : 4.5;
        const contrast = Number(contrastRatio(foreground, background).toFixed(2));

        if (contrast >= threshold) {
          return [];
        }

        return [
          {
            background: `rgb(${background[0]}, ${background[1]}, ${background[2]})`,
            className: element.getAttribute("class"),
            color: style.color,
            contrast,
            fontSize,
            fontWeight,
            tag: element.tagName.toLowerCase(),
            text: element.textContent?.trim().replace(/\s+/g, " ").slice(0, 100),
            threshold
          }
        ];
      });
  });
}
