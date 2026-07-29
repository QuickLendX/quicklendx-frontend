"use client";

import { useState, type FormEvent } from "react";
import {
  parseProfileForm,
  type ProfileFormErrors,
  type ProfileFormValues,
} from "@/lib/validation/profileSchema";

export interface ProfileFormProps {
  onSubmit: (values: ProfileFormValues) => void;
}

/** Profile-edit form. Validates against `profileSchema` on submit and shows
 * one error per invalid field instead of blocking on the first failure. */
export function ProfileForm({ onSubmit }: ProfileFormProps) {
  const [errors, setErrors] = useState<ProfileFormErrors>({});

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const result = parseProfileForm({
      displayName: String(formData.get("displayName") ?? ""),
      email: String(formData.get("email") ?? ""),
    });

    if (!result.ok) {
      setErrors(result.errors);
      return;
    }

    setErrors({});
    onSubmit(result.values);
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div>
        <label htmlFor="profile-display-name">Display name</label>
        <input id="profile-display-name" name="displayName" type="text" />
        {errors.displayName ? <p role="alert">{errors.displayName}</p> : null}
      </div>
      <div>
        <label htmlFor="profile-email">Email</label>
        <input id="profile-email" name="email" type="email" />
        {errors.email ? <p role="alert">{errors.email}</p> : null}
      </div>
      <button type="submit" className="btn btn-primary">
        Save
      </button>
    </form>
  );
}
