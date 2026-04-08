export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="page !h-dvh">
        <div className="flex flex-row page-content !h-full">
            <div className="page-content bg-black/50 bg-[url(/hero.jpg)] bg-blend-multiply bg-cover bg-center hidden lg:block">
            </div>
            <div className="page-content bg-primary flex flex-col justify-center items-center lg:py-5 py-1 bg-white text-black">
                <img src="/logo-black.png" alt="" className="lg:w-1/2 w-[90%]" />
                {children}
            </div>
        </div>
    </div>
  );
}
