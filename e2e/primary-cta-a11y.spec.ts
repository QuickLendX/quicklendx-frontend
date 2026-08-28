import { test, expect } from "@playwright/test";

test.describe("primary CTA accessibility contract", () => {
  test("exposes a descriptive name and navigable destination", async ({ page }) => {
    await page.goto("/");

    const cta = page.getByRole("link", { name: "Browse invoices" });
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute("href", "#invoices");
  });

  test("does not regress to an unnamed or button-only CTA", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("link", { name: "Browse invoices" })).toHaveCount(1);
    await expect(page.getByRole("button", { name: "Browse invoices" })).toHaveCount(0);
  });
});
