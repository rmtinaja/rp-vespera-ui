"use client";

import { useEffect, useState } from "react";
import ModalComponent from "@/sharedComponents/ModalComponent";
import { RoleDropdownService } from "@/domains/roles/services/RoleDropdown.service";

export default function RoleTemplateComponent() {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [roles, setRoles] = useState<RoleDropdown[]>([]);

    type RoleDropdown = {
        id: number;
        name: string;
    };


    const lookup = async () => {
        try {
            const res = await RoleDropdownService.lookupRoleAvailability()
            setRoles(res);
        } catch (error) {
            console.error("Error fetching roles:", error);
        }
    }

    useEffect(() => {
        lookup();
    });

    return(
        <>
            <div className="flex justify-between items-center flex-row border-b-2 pb-2">
                <header className="font-semibold">
                    Create Role Template Creation
                </header>
                <button className="bg-accent-rp px-3 py-1 rounded" onClick={() => setIsModalOpen(true)} >
                    New Role Template
                </button>
            </div>
            <table className="w-full mt-4">
                <thead className="bg-accent-rp">
                    <tr className="py-3">
                        <td className="py-3 px-3 w-1/8 rounded-tl-2xl">No.</td>
                        <td className="w-3/8">Role Template</td>
                        <td className="w-3/8">Access Module</td>
                        <td className="w-1/8 rounded-tr-2xl text-center pr-3">Actions</td>
                    </tr>
                </thead>
                <tbody>
                    <tr className="bg-primary-rp hover:bg-[#ecececbe]! duration-500">
                        <td className="py-2 px-2">1</td>
                        <td>Human Resource</td>
                        <td>HR Module, Contracts</td>
                        <td className="text-center pr-3">
                            <button className="rounded-xl bg-secondary-rp w-full p-[2px]! text-white">
                                View
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <ModalComponent isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Role Template">
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
        </>
    );
}