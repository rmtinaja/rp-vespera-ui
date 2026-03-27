import TransactionList from "@/domains/treasury/Components/InProgressListComponents";
import { getCancelled } from "@/domains/treasury/Services/transaction.service";

export default async function CancelledPage() {
  const res = await getCancelled();

  return (
    <TransactionList
      initialData={res.data}
      initialPage={res.current_page}
      initialLastPage={res.last_page}
      title="Cancelled Transactions"
      endpoint="/transactions/cancelled"
    />
  );
}