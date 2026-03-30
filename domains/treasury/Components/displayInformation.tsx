'use client'

import { useEffect, useState } from 'react'
import { 
  getTransactionById, 
  confirmTransaction, 
  setPaidTransaction, 
  cancelTransaction 
} from '@/domains/treasury/Services/transaction.service'
import { CheckCheck, PenSquare, X } from 'lucide-react'

const IMG_PUBLIC_URL = process.env.NEXT_PUBLIC_IMG_URL || 'http://localhost:8000'

export default function DisplayInformation({ id }: { id: string }) {
  const [transaction, setTransaction] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [showFullImage, setShowFullImage] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [avc, setAvc] = useState('')
  const [or, setOr] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const data = await getTransactionById(id)
    setTransaction(data)

    // autofill if existing
    setAvc(data.avc_receipt_no || '')
    setOr(data.official_receipt_no || '')
  }

  // ✅ CONFIRM
  async function handleConfirm() {
    try {
      setLoading(true)

      await confirmTransaction(Number(id), "Admin User")

      await loadData()
      alert("Transaction confirmed!")
    } catch (err) {
      console.error(err)
      alert("Error confirming transaction")
    } finally {
      setLoading(false)
    }
  }

  // 💰 SAVE (SET PAID)
  async function handleSavePaid() {
    try {
      setLoading(true)

      await setPaidTransaction(
        Number(id),
        avc || null,
        or
      )

      await loadData()

      setShowEditModal(false)
      setAvc('')
      setOr('')
    } catch (err) {
      console.error(err)
      alert("Error saving payment")
    } finally {
      setLoading(false)
    }
  }

  // ❌ CANCEL
  async function handleCancel() {
    if (!confirm("Are you sure you want to cancel this transaction?")) return

    try {
      setLoading(true)

      await cancelTransaction(Number(id))

      await loadData()
    } catch (err) {
      console.error(err)
      alert("Error cancelling transaction")
    } finally {
      setLoading(false)
    }
  }

  if (!transaction) return <div>Loading...</div>

  return (
    <>
      <div className="bg-white rounded-lg">
        
        <div className='pb-3 flex flex-row gap-2 justify-end'>
        {!transaction.cancelled && !transaction.confirmed_by && !transaction.set_paid && (
          <>
            <button 
              onClick={handleConfirm}
              disabled={loading}
              className='btn-primary btn-ico'
            >
              <CheckCheck className='w-5'/>
              {loading ? 'Confirming...' : 'Confirm'}
            </button>

            <button 
              onClick={handleCancel}
              disabled={loading}
              className='btn-danger btn-ico'
            >
              <X className='w-5' /> Cancel
            </button>
          </>
        )}

        {!transaction.cancelled && transaction.confirmed_by && !transaction.set_paid && (
          <>
            <button onClick={() => setShowEditModal(true)} className='btn-info btn-ico' >
              <PenSquare className='w-5'/> Set Paid
            </button>
          </>
        )}
      </div>
        <div className="grid grid-cols-2 gap-2">
          <div className='flex flex-col rounded-xl p-5 gap-2 shadow-[0px_-1px_12px_6px_rgba(0,_0,_0,_0.1)]'>
            <div className='flex flex-row justify-between items-center w-full'>
              <h2 className="text-lg font-semibold">Transaction Details</h2>
              <span className={`p-1 rounded-full px-5 text-white text-sm ${
                transaction.cancelled ? 'bg-red-500' :
                transaction.set_paid ? 'bg-green-600' :
                transaction.confirmed_by ? 'bg-blue-500' :
                'bg-yellow-500'
              }`}>
                {transaction.cancelled ? 'Cancelled' :
                 transaction.set_paid ? 'Paid' :
                 transaction.confirmed_by ? 'Confirmed' :
                 'In-Progress'}
              </span>
            </div>

            <table className="receiptTable">
              <tbody>
                <tr>
                  <td>ID</td>
                  <td>{transaction.doc_id}</td>
                </tr>
                <tr>
                  <td>Organization</td>
                  <td>{transaction.organization}</td>
                </tr>
                <tr>
                  <td>Name</td>
                  <td>{transaction.name}</td>
                </tr>
                <tr>
                  <td>Lot Number</td>
                  <td>{transaction.lot_number}</td>
                </tr>
                <tr>
                  <td>Payment</td>
                  <td>{transaction.lot_sales_payment}</td>
                </tr>
                <tr>
                  <td>Payment Type</td>
                  <td>{transaction.payment_type}</td>
                </tr>
                <tr>
                  <td>Date of Payment</td>
                  <td>{transaction.date_deposited}</td>
                </tr>
                <tr>
                  <td>Date Encoded</td>
                  <td>
                    {new Date(transaction.date_encoded)
                      .toLocaleString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                      })}
                  </td>
                </tr>
                <tr>
                  <td>Description</td>
                  <td>{transaction.description}</td>
                </tr>
                <tr>
                  <td>Notes</td>
                  <td>{transaction.notes}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* RIGHT IMAGE */}
          <div className="w-full bg-white shadow-[0px_-1px_12px_6px_rgba(0,_0,_0,_0.1)] rounded-md p-6">
            <div className="relative w-full h-[500px] flex items-center justify-center overflow-hidden rounded-lg">
              
              <img 
                src={`${IMG_PUBLIC_URL}/storage/${transaction.attachment}`} 
                alt="bg" 
                className="absolute inset-0 w-full h-full object-cover blur-xl scale-110 opacity-50"
              />

              <img 
                src={`${IMG_PUBLIC_URL}/storage/${transaction.attachment}`} 
                alt="payment" 
                className="relative z-10 max-h-full max-w-[80%] object-contain rounded-md shadow-lg"
              />
            </div>

            <button  onClick={() => setShowFullImage(true)} className='bg-accent-rp mt-2 px-4 py-2 rounded text-white'>
              View Full
            </button>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[400px]">

            <h2 className="text-lg font-semibold mb-4">Set Paid</h2>

            <input
              type="text"
              placeholder="AVC Receipt No (optional)"
              value={avc}
              onChange={(e) => setAvc(e.target.value)}
              className="w-full border p-2 mb-3 rounded"
            />

            <input
              type="text"
              placeholder="Official Receipt No (required)"
              value={or}
              onChange={(e) => setOr(e.target.value)}
              className="w-full border p-2 mb-3 rounded"
            />

            <div className="flex justify-end gap-2">
              
              <button
                onClick={() => setShowEditModal(false)}
                className="btn-secondary"
              >
                Close
              </button>

              <button
                onClick={handleSavePaid}
                disabled={!or || loading}
                className="btn-success"
              >
                {loading ? 'Saving...' : 'Save'}
              </button>

            </div>
          </div>
        </div>
      )}
      {showFullImage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setShowFullImage(false)}>
          <img
            src={`${IMG_PUBLIC_URL}/storage/${transaction.attachment}`} 
            alt="full"
            className="max-h-[95%] max-w-[95%] object-contain rounded-lg shadow-xl"
          />
        </div>
      )}
    </>
  )
}