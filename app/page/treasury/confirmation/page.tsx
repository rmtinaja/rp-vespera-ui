import TransactionList from "@/domains/treasury/Components/InProgressListComponents";
import { getToConfirm } from "@/domains/treasury/Services/transaction.service";

export default async function ConfirmationComponent() {
  const res = await getToConfirm(); // ✅ call service here

  return (
    <TransactionList
      initialData={res.data}
      initialPage={res.current_page}
      initialLastPage={res.last_page}
      title="Paid Transactions"
    />
  );
}