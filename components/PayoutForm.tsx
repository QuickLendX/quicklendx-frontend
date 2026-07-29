"use client";

import { useState, type FormEvent } from "react";
import { isValidStellarPublicKey } from "@/lib/stellar";

export interface PayoutFormProps {
  onSubmit: (address: string) => void;
}

const INVALID_ADDRESS_MESSAGE =
  "Enter a valid Stellar public key (56 characters, starting with G).";

/** Payout destination form. Rejects anything that isn't shaped like a
 * Stellar public key before calling {@link PayoutFormProps.onSubmit} --
 * a wrong or non-Stellar address here means funds sent on-chain are
 * unrecoverable, so this fails closed rather than trusting the caller to
 * validate. */
export function PayoutForm({ onSubmit }: PayoutFormProps) {
  const [address, setAddress] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isValidStellarPublicKey(address)) {
      setError(INVALID_ADDRESS_MESSAGE);
      return;
    }

    setError(null);
    onSubmit(address);
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label htmlFor="payout-address">Payout address</label>
      <input
        id="payout-address"
        name="payout-address"
        type="text"
        value={address}
        onChange={(event) => setAddress(event.target.value.trim())}
        aria-invalid={error !== null}
        aria-describedby={error ? "payout-address-error" : undefined}
      />
      {error ? (
        <p id="payout-address-error" role="alert">
          {error}
        </p>
      ) : null}
      <button type="submit">Send payout</button>
    </form>
  );
}
