import TransactionList from "@/domains/treasury/Components/InProgressListComponents";
import { toReceipt } from "@/domains/treasury/Services/transaction.service";

export default async function CancelledPage() {
  const res = await toReceipt();

  return (
    <TransactionList
      initialData={res.data}
      initialPage={res.current_page}
      initialLastPage={res.last_page}
      title="For Receipt"
      endpoint="/transactions/toreceipt"
    />
  );
}