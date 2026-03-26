import DisplayInformation from "@/domains/treasury/Components/displayInformation"
type Props = {
  params: Promise<{
    id: string
  }>
}
export default async function TransactionView({ params }: Props) {
  const { id } = await params
  return <DisplayInformation id={id} />
}