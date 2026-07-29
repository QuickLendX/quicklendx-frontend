import type { Transaction } from "@/lib/transactions";

interface TransactionDTO {
  id: string;
  invoiceId: string;
  type: Transaction["type"];
  /** Wire format for `amountStroops` -- JSON has no bigint. */
  amountStroops: string;
  createdAt: string;
}

interface TransactionsResponseDTO {
  transactions: TransactionDTO[];
}

function fromDTO(dto: TransactionDTO): Transaction {
  return { ...dto, amountStroops: BigInt(dto.amountStroops) };
}

/** Typed client for `/api/transactions`. Every field is typed against the
 * DTO contract in `lib/transactions.ts`, and the bigint <-> string
 * conversion for `amountStroops` happens once here instead of at every
 * call site -- callers should go through this instead of an ad-hoc
 * `fetch("/api/transactions")`. */
export async function getTransactions(): Promise<Transaction[]> {
  const res = await fetch("/api/transactions");
  if (!res.ok) {
    throw new Error(`transactions request failed with status ${res.status}`);
  }
  const body = (await res.json()) as TransactionsResponseDTO;
  return body.transactions.map(fromDTO);
}
