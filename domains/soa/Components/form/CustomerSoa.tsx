"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CustomerSOA() {
  const [data, setData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const encodedData = sessionStorage.getItem("reportData");

    if (encodedData) {
      try {
        const parsedData = JSON.parse(encodedData);
        if (parsedData.success) {
          setData(parsedData.data);
        }
      } catch (error) {
        console.error("Failed to parse sessionStorage data:", error);
      }
    }

    // Set timeout for 10 minutes (600,000 ms)
    const timeout = setTimeout(() => {
      sessionStorage.removeItem("reportData");
      router.push("/soa"); // Redirect after deletion
    // }, 600000);
    }, 60);

    // Cleanup on unmount
    return () => clearTimeout(timeout);
  }, [router]);

  if (!data) {
    return <div className="p-4">Loading data...</div>;
  }

  const { ownerInfo, ownerLot, summary, payments, acceleration, breakdown } =
    data;

  // Totals
  const totalContract = summary.reduce(
    (acc: number, item: any) => acc + parseFloat(item.amtcontract),
    0,
  );
  const totalWaived = summary.reduce(
    (acc: number, item: any) => acc + parseFloat(item.amt_waived),
    0,
  );
  const totalPaid = summary.reduce(
    (acc: number, item: any) => acc + parseFloat(item.amtpaid),
    0,
  );
  const totalUnpaid = summary.reduce(
    (acc: number, item: any) => acc + parseFloat(item.amtunpaid),
    0,
  );
  const grandTotal = breakdown.reduce(
    (acc: number, row: any) => acc + parseFloat(row.dateRangebalance),
    0,
  );

  return (
    <div className="bg-gray-100 p-4 md:p-6">
      {/* NAV */}
      <nav className="bg-white shadow-md rounded-lg mb-6">
        <div className="max-w-6xl mx-auto px-4 md:px-8 flex items-center justify-between h-12">
          <div className="flex items-center gap-3">
            <a
              href="#"
              className="bg-[#0A352D] text-white w-9 h-9 rounded-full shadow hover:bg-green-700 transition flex items-center justify-center"
            >
              <i className="fa-solid fa-chevron-left text-sm"></i>
            </a>
            <div className="text-lg font-bold text-gray-800">
              Renaissance Park
            </div>
          </div>
          <select className="border rounded-md p-2 text-sm">
            <option value="all">All</option>
            {ownerLot.map((lot: any) => (
              <option key={lot.mp_i_lot_id} value={lot.mp_i_lot_id}>
                {lot.lot}
              </option>
            ))}
          </select>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto bg-white p-4 md:p-8 shadow-lg rounded-lg text-xs md:text-sm text-gray-800">
        {/* HEADER */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-3">
            <Image
              src="/logo.png"
              alt="Renaissance Park"
              width={1048}
              height={1048}
              className="h-14 md:h-16 w-auto"
            />
          </div>
          <div className="text-right leading-tight">
            <h2 className="text-lg md:text-xl font-bold">
              STATEMENT OF ACCOUNTS
            </h2>
            <p className="font-medium font-semibold">For Lot Installments</p>
            <p className="text-[10px] md:text-xs">
              as of {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* CUSTOMER INFO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 border border-gray-400 mb-6">
          {ownerInfo.length > 0 && (
            <>
              <div className="p-2 border-b md:border-b-0 md:border-r">
                <p className="font-bold">Customer's Name</p>
                <p>{ownerInfo[0].name1}</p>
              </div>
              <div className="p-2 border-b md:border-b-0 md:border-r">
                <p className="font-bold">Address</p>
                <p>{ownerInfo[0].home_address}</p>
              </div>
              <div className="p-2">
                <p className="font-bold">Email Address</p>
                <p>{ownerInfo[0].email_address}</p>
              </div>
            </>
          )}
        </div>

        {/* OUTSTANDING CONTRACT */}
        <h3 className="font-semibold mb-2 text-center">OUTSTANDING CONTRACT</h3>
        <div className="overflow-x-auto md:overflow-visible mb-6">
          <table className="min-w-[900px] md:min-w-full border border-gray-400 text-xs">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-1">P.A No.</th>
                <th className="border p-1">Lot Info</th>
                <th className="border p-1">Lot Type</th>
                <th className="border p-1">Status</th>
                <th className="border p-1">Date P.A</th>
                <th className="border p-1">Amortization</th>
                <th className="border p-1">Payment Term</th>
                <th className="border p-1">Contract Amount</th>
                <th className="border p-1">Waived</th>
                <th className="border p-1">Total Amount Paid</th>
                <th className="border p-1">Outstanding Balance</th>
              </tr>
            </thead>
            <tbody>
              {summary.map((item: any) => (
                <tr key={item.PANO}>
                  <td className="border text-center p-1">{item.PANO}</td>
                  <td className="border text-center p-1">{item.lot_info}</td>
                  <td className="border text-center p-1">{item.lottype}</td>
                  <td className="border text-center p-1">{item.STATUS}</td>
                  <td className="border text-center p-1">
                    {new Date(item.date_purchagr).toLocaleDateString()}
                  </td>
                  <td className="border text-center p-1">
                    {parseFloat(item.amtamort).toFixed(2)}
                  </td>
                  <td className="border text-center p-1">{item.description}</td>
                  <td className="border text-right">
                    {parseFloat(item.amtcontract).toFixed(2)}
                  </td>
                  <td className="border text-right">
                    {parseFloat(item.amt_waived).toFixed(2)}
                  </td>
                  <td className="border text-right">
                    {parseFloat(item.amtpaid).toFixed(2)}
                  </td>
                  <td className="border text-right">
                    {parseFloat(item.amtunpaid).toFixed(2)}
                  </td>
                </tr>
              ))}
              <tr className="font-bold bg-gray-100">
                <td colSpan={7} className="border text-right pr-2">
                  TOTAL
                </td>
                <td className="border text-right">
                  {totalContract.toFixed(2)}
                </td>
                <td className="border text-right">{totalWaived.toFixed(2)}</td>
                <td className="border text-right">{totalPaid.toFixed(2)}</td>
                <td className="border text-right">{totalUnpaid.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* LAST PAYMENT */}
        <h3 className="font-semibold mb-2 text-center">LAST PAYMENT</h3>
        <div className="overflow-x-auto mb-6">
          <table className="min-w-[900px] md:min-w-full border border-gray-400 text-xs">
            <thead className="bg-gray-200">
              <tr className="font-bold">
                <td className="border text-center p-1">Date</td>
                <td className="border text-center p-1">Lot ID</td>
                <td className="border text-center p-1">P.A</td>
                <td className="border text-center p-1">Reference No.</td>
                <td className="border text-center p-1">Net Sales</td>
                <td className="border text-center p-1">PCF</td>
                <td className="border text-center p-1">VAT</td>
                <td className="border text-center p-1">Payment</td>
                <td className="border text-center p-1">Total Amount</td>
              </tr>
            </thead>
            <tbody>
              {payments.map((history: any, i: number) => {
                const total =
                  parseFloat(history.amt_sales) +
                  parseFloat(history.amt_pcf) +
                  parseFloat(history.amt_vat);
                return (
                  <tr key={i}>
                    <td className="border text-center p-1">
                      {history.date_gl}
                    </td>
                    <td className="border text-center p-1">{history.lotID}</td>
                    <td className="border text-center p-1">{history.PANO}</td>
                    <td className="border text-center p-1">
                      {history.referenceNO}
                    </td>
                    <td className="border text-center p-1">
                      {parseFloat(history.amt_sales).toFixed(2)}
                    </td>
                    <td className="border text-center p-1">
                      {parseFloat(history.amt_pcf).toFixed(2)}
                    </td>
                    <td className="border text-center p-1">
                      {parseFloat(history.amt_vat).toFixed(2)}
                    </td>
                    <td className="border text-center p-1">
                      {parseFloat(history.amt_gross).toFixed(2)}
                    </td>
                    <td className="border text-center p-1">
                      {total.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ACCELERATION BALANCE */}
        <div className="flex items-center justify-center space-x-6 mb-6">
          <h3 className="text-md font-medium">Acceleration Balance To Pay:</h3>
          {acceleration.length === 0 ? (
            <span className="text-gray-400">No Data</span>
          ) : (
            acceleration.map((row: any, i: number) => (
              <React.Fragment key={i}>
                <span className="px-3 py-1 bg-gray-50 rounded shadow font-semibold">
                  lot - {row.lotnum}
                </span>
                <span className="px-3 py-1 bg-gray-50 rounded shadow font-semibold">
                  {parseFloat(row.amt_accel_gross).toFixed(2)}
                </span>
              </React.Fragment>
            ))
          )}
        </div>

        {/* PAYMENT BREAKDOWN */}
        <h3 className="font-semibold mb-2 text-center">DUE PAYMENT</h3>
        <div className="overflow-x-auto mb-6">
          <table className="w-full border border-gray-400 text-xs table-auto">
            <thead>
              <tr className="bg-gray-200 font-bold text-center">
                <td className="border border-gray-400 p-2">P.A. No.</td>
                <td className="border border-gray-400 p-2">Scheduled Date</td>
                <td className="border border-gray-400 p-2">Breakdown</td>
                <td className="border border-gray-400 p-2">To Pay</td>
              </tr>
            </thead>
            <tbody>
              {breakdown.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="border border-gray-400 p-4 text-center"
                  >
                    No Data
                  </td>
                </tr>
              ) : (
                breakdown.map((row: any, i: number) => (
                  <tr key={i} className="text-sm">
                    <td className="border border-gray-400 p-2">
                      {row.documentno}
                    </td>
                    <td className="border border-gray-400 p-2 text-center">
                      {row.date_of_payment}
                    </td>
                    <td className="border border-gray-400 p-2">
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between">
                          <span>Amort Sales:</span>
                          <span className="font-semibold">
                            {parseFloat(row.amort_sales).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>PCF:</span>
                          <span className="font-semibold">
                            {parseFloat(row.amort_pcf).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>VAT:</span>
                          <span className="font-semibold">
                            {parseFloat(row.amort_vat).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="border border-gray-400 p-2 text-right font-semibold">
                      {parseFloat(row.dateRangebalance).toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot>
              <tr className="bg-gray-100 font-semibold">
                <td
                  colSpan={3}
                  className="border font-bold border-gray-400 p-2 text-right"
                >
                  TOTAL
                </td>
                <td className="border border-gray-400 p-2 text-right">
                  {grandTotal.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* FOOTER */}
        <div className="flex justify-between mt-6 text-[10px] md:text-xs">
          <span>Date Printed: {new Date().toLocaleDateString()}</span>
          <span>Page 1 of 1</span>
        </div>
      </div>
    </div>
  );
}
