"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { TransactionDTO } from "../DTO/transaction.dto";

export default function TransactionList({
  initialData,
  initialPage,
  initialLastPage,
  title,
}: {
  initialData: TransactionDTO[];
  initialPage: number;
  initialLastPage: number;
  title: string;
}) {
  const router = useRouter();

  const [transactions, setTransactions] = useState(initialData);
  const [page, setPage] = useState(initialPage);
  const [lastPage, setLastPage] = useState(initialLastPage);
  const [loading, setLoading] = useState(false);

  // ⚠️ CLIENT SIDE FETCH → must use API (not service)
  const fetchData = async (pageNumber: number) => {
    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/transactions/to-confirm?page=${pageNumber}`
      );
      const data = await res.json();

      setTransactions(data.data);
      setPage(data.current_page);
      setLastPage(data.last_page);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>

      <div className="overflow-auto">
        <table className="w-full projecttable">
          <thead className="bg-accent-rp text-left">
            <tr>
              <th>ID</th>
              <th>Doc ID</th>
              <th>Lot</th>
              <th>Total</th>
              <th className="text-center">Payment</th>
              <th className="text-center">Date</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((t) => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.doc_id}</td>
                <td>{t.lot_number}</td>
                <td>₱ {t.total_payment}</td>
                <td className="text-center">{t.payment_type}</td>
                <td className="text-center">
                  {new Date(t.date_encoded).toLocaleDateString()}
                </td>
                <td className="text-center">
                  <button
                    onClick={() =>
                      router.push(`/page/treasury/displayTransactionView/${t.id}`)
                    }
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex gap-2 mt-4 items-center">
        <button onClick={() => fetchData(page - 1)} disabled={page === 1}>
          Prev
        </button>

        <span>
          Page {page} / {lastPage}
        </span>

        <button
          onClick={() => fetchData(page + 1)}
          disabled={page === lastPage}
        >
          Next
        </button>
      </div>
    </div>
  );
}