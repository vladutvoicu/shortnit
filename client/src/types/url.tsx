export interface Url {
  _id?: string;
  __v?: string;
  createdAt?: string;
  updatedAt?: string;
  user: string;
  sourceUrl: string;
  alias: string;
  shortUrl: string;
  redirectData: {
    users: Array<{
      ip: string;
      countryName: string;
      continentCode: string;
      totalClicks: number;
    }>;
    uniqueClicks: number;
    mobileUsers: number;
    desktopUsers: number;
  };
}
