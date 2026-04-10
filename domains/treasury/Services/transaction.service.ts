import { PaginationDTO } from "../DTO/pagination.dto";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getTransactions(page: number = 1): Promise<PaginationDTO> {
  if (!BASE_URL) throw new Error("API URL not set");

  const res = await fetch(`${BASE_URL}/transactions?page=${page}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Error: ${res.status}`);
  }

  return res.json();
}

export async function getTransactionById(id: string) {
  const res = await fetch(`${BASE_URL}/transactions/${id}`, {
    cache: 'no-store',
    headers: {
      'Accept': 'application/json',
    },
  })

  if (!res.ok) {
    const text = await res.text()
    console.error("STATUS:", res.status)
    console.error("RESPONSE:", text)

    throw new Error(`Error: ${res.status}`)
  }

  return res.json()
}
export async function confirmTransaction(id: number, confirmedBy: string) {
  if (!BASE_URL) throw new Error("API URL not set");

  const res = await fetch(`${BASE_URL}/transactions/${id}/confirm`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      confirmed_by: confirmedBy,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("STATUS:", res.status);
    console.error("RESPONSE:", text);
    throw new Error(`Error: ${res.status}`);
  }

  return res.json();
}
export async function setPaidTransaction(
  id: number,
  avc_receipt_no: string | null,
  official_receipt_no: string
) {
  const res = await fetch(`${BASE_URL}/transactions/${id}/set-paid`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      avc_receipt_no,
      official_receipt_no,
    }),
  });

  if (!res.ok) throw new Error("Failed to set paid");

  return res.json();
}

export async function cancelTransaction(id: number) {
  const res = await fetch(`${BASE_URL}/transactions/${id}/cancel`, {
    method: "PUT",
  });

  if (!res.ok) throw new Error("Failed to cancel");

  return res.json();
}

export async function getToConfirm() {
  const res = await fetch(`${BASE_URL}/transactions/confirmation`, {
    cache: 'no-store'
  })
  return res.json()
}

export async function toReceipt() {
  const res = await fetch(`${BASE_URL}/transactions/toreceipt`, {
    cache: 'no-store'
  })
  return res.json()
}

export async function getPaid() {
  const res = await fetch(`${BASE_URL}/transactions/done`, {
    cache: 'no-store'
  })
  return res.json()
}

export async function getCancelled() {
  const res = await fetch(`${BASE_URL}/transactions/cancelled`, {
    cache: 'no-store'
  })
  return res.json()
}
export async function getUnknown() {
  const res = await fetch(`${BASE_URL}/transactions/getUnknown`, {
    cache: 'no-store'
  })
  return res.json()
}