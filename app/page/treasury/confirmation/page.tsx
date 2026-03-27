import TransactionList from "@/domains/treasury/Components/InProgressListComponents";
import { getToConfirm } from "@/domains/treasury/Services/transaction.service";

export default async function ConfirmationPage() {
  const res = await getToConfirm();

  return (
    <TransactionList
      initialData={res.data}
      initialPage={res.current_page}
      initialLastPage={res.last_page}
      title="Transactions for Confirmation"
      endpoint="/transactions/confirmation"
    />
  );
}