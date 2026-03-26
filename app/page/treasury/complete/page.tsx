import TransactionList from "@/domains/treasury/Components/InProgressListComponents";
import { getToConfirm } from "@/domains/treasury/Services/transaction.service";

export default async function CompleteComponent() {
  const res = await getToConfirm(); // ✅ SERVICE USED HERE (SERVER)

  return (
    <TransactionList
      initialData={res.data}
      initialPage={res.current_page}
      initialLastPage={res.last_page}
      title="Paid Transactions"
    />
  );
}