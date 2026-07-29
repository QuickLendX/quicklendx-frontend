import { test, expect } from "@playwright/test";

test("landing page renders the hero", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1, name: "QuickLendX" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Browse invoices" })).toBeVisible();
});

test("dashboard route renders its heading", async ({ page }) => {
  await page.goto("/dashboard");

  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
});

test("portfolio route renders its heading", async ({ page }) => {
  await page.goto("/portfolio");

  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
