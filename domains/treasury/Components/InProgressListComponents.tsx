"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { TransactionDTO } from "../DTO/transaction.dto";

export default function TransactionList({
  initialData,
  initialPage,
  initialLastPage,
  title,
  endpoint,
}: {
  initialData: TransactionDTO[];
  initialPage: number;
  initialLastPage: number;
  title: string;
  endpoint: string;
}) {
  const router = useRouter();

  const [transactions, setTransactions] = useState(initialData);
  const [page, setPage] = useState(initialPage);
  const [lastPage, setLastPage] = useState(initialLastPage);
  const [loading, setLoading] = useState(false);

  const fetchData = async (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > lastPage) return;

    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${endpoint}?page=${pageNumber}`
      );

      if (!res.ok) throw new Error("Failed to fetch");

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
      <h2 className="text-lg font-semibold mb-4">{title}</h2>

      <div className="overflow-auto">
        <table className="w-full projecttable">
          <thead className="bg-accent-rp text-left">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Reference Number</th>
              <th>Lot</th>
              <th>Total</th>
              {title == "Paid Transactions" &&
                <>
                  <th>AVC Receipt</th>
                  <th>OR Receipt</th>
                </>
              }
              <th className="text-center">Date</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-4">
                  No data found
                </td>
              </tr>
            ) : (
              transactions.map((t) => (
                <tr key={t.id}>
                  <td>{t.id}</td>
                  <td>{t.name}</td>
                  <td>{t.reference_number}</td>
                  <td>{t.lot_number}</td>
                  <td>₱ {t.total_payment}</td>
                  {title == "Paid Transactions" &&
                    <>
                      <td>{t.avc_receipt_no}</td>
                      <td>{t.official_receipt_no}</td>
                    </>
                  }
                  <td className="text-center">
                    {new Date(t.date_encoded).toLocaleDateString()}
                  </td>
                  <td className="text-center">
                    <button
                      onClick={() =>
                        router.push(
                          `/page/treasury/displayTransactionView/${t.id}`
                        )
                      }
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex gap-4 mt-4 items-center justify-center">
        <button
          onClick={() => fetchData(page - 1)}
          disabled={page === 1 || loading}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span>
          Page {page} of {lastPage}
        </span>

        <button
          onClick={() => fetchData(page + 1)}
          disabled={page === lastPage || loading}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}