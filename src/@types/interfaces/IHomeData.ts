export interface IHomeData {
  companiesCount: number;
  workersCount: number;
  ordersCount: number;
  servicePriceCount: number;
  companiesPerMonth: PerMonthItem[];
  ordersByStatus: PerActivityItem[];
  servicePricePerMonth: PerMonthItem[];
  workersPerMonth: PerMonthItem[];
  workersPerActivity: PerActivityItem[];
}

export interface PerMonthItem {
  monthOtherFormat: string;
  count: number;
  month: string;
}

export interface PerActivityItem {
  count: number;
  isActive: boolean;
}
