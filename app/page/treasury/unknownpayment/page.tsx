import TransactionList from "@/domains/treasury/Components/InProgressListComponents";
import { getUnknown } from "@/domains/treasury/Services/transaction.service";

export default async function UnknownPage() {
  const res = await getUnknown();

  return (
    <>
        <div className="flex flex-row justify-between items-center mb-2">
            <h1 className="font-bold text-lg">Unknown List</h1>
        </div>
        <TransactionList
            initialData={res.data}
            initialPage={res.current_page}
            initialLastPage={res.last_page}
            title="For Unknown Receipt"
            endpoint="/transactions/getUnknown"
        />
    </>
  );
}