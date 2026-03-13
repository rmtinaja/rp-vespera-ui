export default function RoleTemplateComponent(){
    return(
        <>
            <div className="page p-3 flex flex-col gap-3">
                <div className="w-full p-2 px-5 bg-secondary-rp rounded-xl flex flex-row items-center justify-between">
                    <header className=" text-white font-semibold">Role Template Assignment</header>
                    <button className="bg-accent-rp text-white text-sm">New Role Template</button>
                </div>
                <div className="h-full flex flex-row gap-3">
                    <div className="page-content bg-accent-rp !w-1/5 rounded-xl p-6 text-white flex flex-col">
                        <div className="font-semibold text-xl font-nunito">
                            <header className="">Role Task Template </header>
                            <span>Assignment</span>
                        </div>
                    </div>
                    <div className="page-content bg-accent-rp !w-3/5 rounded-xl p-6 text-white flex flex-col">
                        <div className="font-semibold text-xl font-nunito">
                            <header className="">Module Assignment</header>
                        </div>
                    </div>
                    <div className="page-content !w-1/5 text-white flex flex-col gap-4">
                        <div className="font-semibold text-xl font-nunito bg-accent-rp rounded-xl p-6">
                            <header className="">Sub Module</header>
                            <span>Assignment</span>
                        </div>
                        <div className="font-semibold text-xl font-nunito bg-accent-rp rounded-xl p-6">
                            <header className="">Access Type</header>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}