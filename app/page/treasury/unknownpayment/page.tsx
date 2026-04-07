import TransactionList from "@/domains/treasury/Components/InProgressListComponents";
import { toReceipt } from "@/domains/treasury/Services/transaction.service";

export default async function UnknownPage() {
  const res = await toReceipt();

  return (
    <>
      <div className="flex flex-row justify-between items-center mb-2">
        <h1 className="font-bold text-lg">Unknown List</h1>
        <button className="bg-accent-rp text-sm">New Unknown</button>
      </div>
      <TransactionList
        initialData={res.data}
        initialPage={res.current_page}
        initialLastPage={res.last_page}
        title="For Unknown Receipt"
        endpoint="/transactions/toreceipt"
      />
      {/* <ModalComponent isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Role Template">
        <form className="space-y-4">
          <div>
              <label className="text-sm font-medium">
                  Role Template Name
              </label>
              <select name="" id="">
                  {roles.map((role) => (
                      <option key={role.id}>{role.name}</option>
                  ))}
                  <option value="">--Select Role--</option>
              </select>
          </div>
          <div>
              <label className="text-sm font-medium">
                  Description
              </label>
              <textarea
                  className="w-full border rounded p-2"
                  placeholder="Optional description"
              />
          </div>
          <div className="flex justify-end gap-2 mt-4">
              <button type="button" className="px-4 py-2 border rounded" onClick={() => setIsModalOpen(false)}>
                  Cancel
              </button>
              <button type="submit" className="bg-secondary-rp text-white px-4 py-2 rounded">
                  Save
              </button>
          </div>
        </form>
      </ModalComponent>
       */}
    </>
  );
}