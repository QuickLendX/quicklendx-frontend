import { z } from "zod";

export const profileSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(1, "Display name is required")
    .max(80, "Display name must be 80 characters or fewer"),
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export type ProfileFormErrors = Partial<Record<keyof ProfileFormValues, string>>;

export type ParsedProfileForm =
  | { ok: true; values: ProfileFormValues }
  | { ok: false; errors: ProfileFormErrors };

/** Validates raw profile-form input at the boundary. Returns a structured
 * per-field error map instead of throwing, so the form can show each
 * mistake next to the field it belongs to. */
export function parseProfileForm(input: unknown): ParsedProfileForm {
  const result = profileSchema.safeParse(input);
  if (result.success) return { ok: true, values: result.data };

  const errors: ProfileFormErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0];
    if (typeof field === "string" && !(field in errors)) {
      errors[field as keyof ProfileFormValues] = issue.message;
    }
  }
  return { ok: false, errors };
}
