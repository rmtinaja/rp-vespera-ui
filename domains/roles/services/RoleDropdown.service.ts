import axios from "axios";
import { RoleDropdown } from "../dto/RoleDropdownDTO";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/v1`;

export const RoleDropdownService = {

    lookupRoleAvailability: async () => {
        const res = await axios.get(`${BASE_URL}/roles`)
        return res.data
    }
}