export interface IWorkerDto {
  id?: string;
  name: string;
  ResidenceNumber: string;
  phone: string;
  dateOfBirth: Date | null;
  religionId: number;
  yearsOfExperience: number;
  languageId: number | null;
  nationalityId: string;
  genderId: number | null;
  firstEntryDate: Date | null;
  lastEntryDate: Date | null;
  dateOfExit: Date | null;
  workStartDate: Date | null;
  visaExpiryDate: Date | null;
  lastEntryPort: string;
  salary: number;
  borderNumber: string;
  passportNumber: string;
  externalOffice: string;
  visaType: string;
  skills: string;
  jobStatusId: number | null | string;
  jobId: string;
  serviceProvided: string;
  workerTypeOfServicesIds: string[];
  language: string;
  BranchId: string;
  operatingFees: number;
  gender: string;
  religion: string;
  isActive: boolean;
}

export class WorkerDto implements Partial<IWorkerDto> {
  id?: string;
  workerTypeOfServicesIds: string[];
  externalOffice: string;
  jobStatusId: number | null | string;
  language: string;
  religion: string;
  religionId: number;
  jobId: string;
  operatingFees: number;
  salary: number;
  branchId: string;
  skills: string;
  languageId: number | null;
  phone: string;
  firstEntryDate: Date | null;
  name: string;
  residenceNumber: string;
  gender: string;
  nationalityId: string;
  genderId: number | null;
  dateOfBirth: Date | null;
  yearsOfExperience: number;
  lastEntryDate: Date | null;
  dateOfExit: Date | null;
  workStartDate: Date | null;
  visaExpiryDate: Date | null;
  lastEntryPort: string;
  jobStatus: string;
  borderNumber: string;
  passportNumber: string;
  serviceProvided: string;
  visaType: string;
  isActive: boolean;
  constructor({
    id,
    externalOffice = "",
    religionId = -1,
    workerTypeOfServicesIds = [],
    jobId = "",
    gender = "",
    jobStatusId = -1,
    salary = 0,
    skills = "",
    language = "",
    religion = "",
    languageId = -1,
    phone = "",
    firstEntryDate = null,
    name = "",
    residenceNumber = "",
    nationalityId = "",
    operatingFees = 0,
    branchId = "",
    genderId = -1,
    dateOfBirth = null,
    yearsOfExperience = 0,
    lastEntryDate = null,
    dateOfExit = null,
    workStartDate = null,
    visaExpiryDate = null,
    lastEntryPort = "",
    jobStatus = "",
    borderNumber = "",
    passportNumber = "",
    serviceProvided = "",
    isActive = true,
    visaType = "",
  }: Partial<WorkerDto> = {}) {
    this.id = id;
    this.workerTypeOfServicesIds = workerTypeOfServicesIds;
    this.language = language;
    this.gender = gender;
    this.isActive = isActive;
    this.religion = religion;
    this.jobStatusId = jobStatusId;
    this.serviceProvided = serviceProvided;
    this.jobStatus = jobStatus;
    this.visaExpiryDate = visaExpiryDate;
    this.nationalityId = nationalityId;
    this.languageId = languageId;
    this.firstEntryDate = firstEntryDate;
    this.lastEntryPort = lastEntryPort;
    this.salary = salary;
    this.religionId = religionId;
    this.yearsOfExperience = yearsOfExperience;
    this.phone = phone;
    this.skills = skills;
    this.jobId = jobId;
    this.lastEntryDate = lastEntryDate;
    this.residenceNumber = residenceNumber;
    this.dateOfBirth = dateOfBirth;
    this.branchId = branchId;
    this.workStartDate = workStartDate;
    this.externalOffice = externalOffice;
    this.visaType = visaType;
    this.operatingFees = operatingFees;
    this.passportNumber = passportNumber;
    this.name = name;
    this.borderNumber = borderNumber;
    this.genderId = genderId;
    this.dateOfExit = dateOfExit;
  }
}
