'use client';

import GenericPaymentComponent from "@/domains/lsp/components/GenericPaymentForm";

interface Props {
  nextPage: () => void;
}

export default function OthersPayment({ nextPage }: Props) {
  return (
    <div>
        <GenericPaymentComponent nextPage={nextPage}/>
    </div>
  );
}
