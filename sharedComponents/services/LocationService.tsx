export interface LocationDTO {
  code: string;
  name: string;
}

const BASE_URL = "https://psgc.gitlab.io/api";

export class LocationService {

  private static provincesCache: LocationDTO[] | null = null;
  private static citiesCache: Record<string, LocationDTO[]> = {};
  private static barangaysCache: Record<string, LocationDTO[]> = {};

  static async getProvinces(): Promise<LocationDTO[]> {
    if (this.provincesCache) return this.provincesCache;

    const res = await fetch(`${BASE_URL}/provinces/`);
    const data: LocationDTO[] = await res.json();

    const sorted = data.sort((a, b) => a.name.localeCompare(b.name));
    this.provincesCache = sorted;

    return sorted;
  }

  static async getCities(provinceCode: string): Promise<LocationDTO[]> {
    if (this.citiesCache[provinceCode]) return this.citiesCache[provinceCode];

    const res = await fetch(`${BASE_URL}/provinces/${provinceCode}/cities-municipalities/`);
    const data: LocationDTO[] = await res.json();

    const sorted = data.sort((a, b) => a.name.localeCompare(b.name));
    this.citiesCache[provinceCode] = sorted;

    return sorted;
  }

  static async getBarangays(cityCode: string): Promise<LocationDTO[]> {
    if (this.barangaysCache[cityCode]) return this.barangaysCache[cityCode];

    const res = await fetch(`${BASE_URL}/cities-municipalities/${cityCode}/barangays/`);
    const data: LocationDTO[] = await res.json();

    const sorted = data.sort((a, b) => a.name.localeCompare(b.name));
    this.barangaysCache[cityCode] = sorted;

    return sorted;
  }

  static clearCache() {
    this.provincesCache = null;
    this.citiesCache = {};
    this.barangaysCache = {};
  }
}