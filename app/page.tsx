'use client';

import { useRef } from 'react';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';

export default function Home() {
  const toast = useRef<Toast>(null);

  const show = () => {
    toast.current?.show({
      severity: 'success',
      summary: 'Success',
      detail: 'Toast is working!',
      life: 30000, 
    });
  };

  return (
    <>
      {/* <Toast ref={toast} /> */}

      <div className="page flex-start">
        <main className='w-full flex-space-between'>
          {/* <header className="text-xl font-bold">
            Welcome to Renaisance Park / Vespera Project hahaha,dmfgvbhfgbasljfgsahahaha
          </header>

          <div className="flex-col-center w-full border flex-right">
            <Button onClick={show} label="Test Toast" />
          </div> */}
        </main>
      </div>
    </>
  );
}