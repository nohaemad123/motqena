export interface IOrder {
  id: string;
  shiftName: string;
  durationOfService: number;
  orderStatusId: number;
  paymentStatusId: number;
  branchName: string;
  cityName: string;
  cityId: string | null;
  userName: string;
  userPhone: string;
  userAddress: string;
  isDeleted: boolean;
  orderStatus: string;
  createdOn: string;
  lastUpdatedOn: string | null;
  total: number;
  commotion: number;
  commotionRate: number;
  totalAfterCommotion: number;
  paymentStatus: string;
  nationalityName: string;
  agreementDuration: string;
  from: string | null;
  to: string | null;
  workerNationalityName: string;
  workerJobName: string;
  workerPassportNumber: string;
  workerBorderNumber: string;
  workerLastEntryPort: string;
  workerVisaType: string;
  workerExternalOffice: string;
  workerSkills: string;
  workerName: string;
  workerSalary: string;
  workerPhone: string;
  workerYearsOfExperience: number;
  workerResidenceNumber: string;
  workerOperatingFees: number;
  workerReligion: string;
  workerGender: string;
  workerLanguage: string;
  workerAge: string;
  code: number;
  firstVisit: string;
  countOfWorker: number;
  serviceName: string;
  countOfVisit: number;
  servicePriceDetailsId: string;
  price: number;
  tax: number;
  descount: number;
  shiftId: string;
  branchId: string;
  workerId: string;
  userAddressId: string;
  nationalityId: string;
  orderDays: OrderDay[];
}

interface OrderDay {
  id: string;
  orderId: string;
  dayOfWeekId: number;
  dayOfWeek: string;
}

export interface IListOrderStatus {
  key: number;
  value: string;
  count: number;
}
