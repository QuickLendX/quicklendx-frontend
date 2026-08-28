import { test, expect } from "@playwright/test";

// Regression coverage for the primary CTA's hover/focus parity (#115):
// previously only `.btn:hover` was styled in app/globals.css, so a
// keyboard user tabbing to the button got no visible affordance at all,
// while a mouse user hovering it did.

test("primary CTA lifts on hover", async ({ page }) => {
  await page.goto("/");
  const cta = page.getByRole("link", { name: "Browse invoices" });

  const restTransform = await cta.evaluate((el) => getComputedStyle(el).transform);
  await cta.hover();
  const hoverTransform = await cta.evaluate((el) => getComputedStyle(el).transform);

  expect(hoverTransform).not.toBe(restTransform);
});

test("primary CTA lifts on keyboard focus, matching the hover transform", async ({ page }) => {
  await page.goto("/");
  const cta = page.getByRole("link", { name: "Browse invoices" });

  const restTransform = await cta.evaluate((el) => getComputedStyle(el).transform);
  await cta.hover();
  const hoverTransform = await cta.evaluate((el) => getComputedStyle(el).transform);
  await page.mouse.move(0, 0); // un-hover before focusing, so only :focus-visible applies

  await cta.focus();
  const focusTransform = await cta.evaluate((el) => getComputedStyle(el).transform);

  expect(focusTransform).not.toBe(restTransform);
  expect(focusTransform).toBe(hoverTransform);
});

test("primary CTA shows a visible focus outline (not just the lift transform)", async ({ page }) => {
  await page.goto("/");
  const cta = page.getByRole("link", { name: "Browse invoices" });

  await cta.focus();
  const outlineStyle = await cta.evaluate((el) => getComputedStyle(el).outlineStyle);

  expect(outlineStyle).not.toBe("none");
});
