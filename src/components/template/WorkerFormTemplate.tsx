"use client";

import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useEffect, useRef, useState } from "react";
import {
  Box,
  Breadcrumbs,
  Button,
  ButtonBase,
  InputAdornment,
  MenuItem,
  Modal,
  OutlinedInput,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import ask_cancel from "@/assets/popup images/Transfer files-rafiki.svg";
import Image from "next/image";
import { modalStyle } from "@/@types/styles";
import Link from "next/link";
import { FiUpload } from "react-icons/fi";
import { WorkerDto } from "@/@types/dto/WorkerDto";
import { WorkerValidationSchema } from "@/@types/validators/workerValidators";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { fontCairo } from "@/@types/styles";
import { INationality } from "@/@types/interfaces/INationality";
import { IJob } from "@/@types/interfaces/IJob";
import { FiBriefcase } from "react-icons/fi";
import user from "@/assets/images/user-1.svg";
import {
  getAllBranches,
  getAllJobs,
  getAllNationalities,
  getAllServiceTypes,
  getListOfGender,
  getListOfJobStatus,
  getListOfLanguage,
  getListOfReligion,
  getWorkerById,
} from "@/services/loadData";
import { IReligion } from "@/@types/interfaces/IReligion";
import { ILanguage } from "@/@types/interfaces/ILanguage";
import { IGender } from "@/@types/interfaces/IGender";
import { IJobStatus } from "@/@types/interfaces/IJobStatus";
import { IBranch } from "@/@types/interfaces/IBranch";
import { EndPointsEnums } from "@/@types/enums/endPoints";
import personal_data from "@/assets/images/personalcard.svg";
import mobile from "@/assets/images/mobile.svg";
import filter from "@/assets/images/edit-2.svg";
import globe from "@/assets/images/shape.svg";
import flag from "@/assets/images/flag.svg";
import profile from "@/assets/images/profile-2user.svg";
import money from "@/assets/images/money-recive.svg";
import star from "@/assets/images/star.svg";
import ask_add from "@/assets/images/ask-add.gif";
import calender from "@/assets/images/calendar.svg";
import upload from "@/assets/images/ad-icon.svg";
import { getTranslatedName } from "@/@types/stables";
import { useAppStore } from "@/store";
import buildings from "@/assets/images/buildings.svg";
import environment from "@/environment";
import { IServiceType } from "@/@types/interfaces/IServiceType";
import fetchGeneral from "@/lib/fetchGeneral";

interface IWorkerFormTemplateProps {
  workerId?: string;
  isEdit?: boolean;
  isView?: boolean;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function WorkerFormTemplate({ workerId, isEdit, isView }: Readonly<IWorkerFormTemplateProps>) {
  const { t, i18n } = useTranslation();
  const { isHttpClientLoading } = useAppStore();
  const [openAdd, setOpenAdd] = useState(false);
  const [openCancel, setOpenCancel] = useState(false);
  const handleOpenCancel = () => setOpenCancel(true);
  const handleCloseCancel = () => setOpenCancel(false);
  const handleCloseAdd = () => setOpenAdd(false);
  const handleOpenAdd = () => setOpenAdd(true);
  const fileRef = useRef<File | undefined>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(0);
  const [nationalities, setNationalities] = useState<INationality[]>([]);
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [providedServices, setProvidedService] = useState<IServiceType[]>([]);
  const [religions, setReligions] = useState<IReligion[]>([]);
  const [languages, setLanguages] = useState<ILanguage[]>([]);
  const [genders, setGenders] = useState<IGender[]>([]);
  const [jobsStatus, setJobsStatus] = useState<IJobStatus[]>([]);
  const [branches, setBranches] = useState<IBranch[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleChange = (newValue: number) => {
    setValue(newValue);
  };
  const {
    register,
    reset,
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<WorkerDto>({
    defaultValues: new WorkerDto(),
    resolver: valibotResolver(WorkerValidationSchema),
  });

  useEffect(() => {
    if (workerId && typeof workerId === "string") {
      getWorkerById(i18n.language, workerId)
        .then((res) => {
          if (res) {
            const data = new WorkerDto({
              ...res,
              dateOfBirth: res.dateOfBirth ? new Date(res.dateOfBirth) : null,
              lastEntryDate: res.lastEntryDate ? new Date(res.lastEntryDate) : null,
              dateOfExit: res.dateOfExit ? new Date(res.dateOfExit) : null,
              workStartDate: res.workStartDate ? new Date(res.workStartDate) : null,
              visaExpiryDate: res.visaExpiryDate ? new Date(res.visaExpiryDate) : null,
              firstEntryDate: res.firstEntryDate ? new Date(res.firstEntryDate) : null,
            });
            reset(data);
            console.log(data);
            setImagePreview(environment.apiHost + "/" + res?.image);
          }
        })
        .catch(console.log);
    }

    getListOfReligion(i18n.language).then((res) => {
      setReligions(res ?? []);
      console.log(res);
    });

    getListOfLanguage(i18n.language).then((res) => {
      setLanguages(res ?? []);
      console.log(res);
    });

    getAllNationalities(i18n.language).then((res) => {
      console.log(res);
      setNationalities(res?.listData ?? []);
    });
    getAllJobs(i18n.language).then((res) => {
      console.log(res);
      setJobs(res?.listData ?? []);
    });

    getAllServiceTypes(i18n.language).then((res) => {
      console.log(res);
      setProvidedService(res?.listData ?? []);
    });

    getListOfJobStatus(i18n.language).then((res) => {
      setJobsStatus(res);
    });

    getListOfGender(i18n.language).then((res) => {
      setGenders(res);
    });

    getAllBranches(i18n.language).then((res) => {
      setBranches(res?.listData ?? []);
    });
  }, [workerId]);

  async function handleCreate(formData: FormData) {
    try {
      const response = await fetchGeneral(EndPointsEnums.worker, {
        method: "POST",
        body: formData,
        headers: {
          "Accept-Language": i18n.language,
        },
      });

      if (response.ok) {
        handleOpenAdd();
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  async function handleUpdate(formData: FormData) {
    try {
      const response = await fetchGeneral(EndPointsEnums.worker, {
        method: "PUT",
        body: formData,
        params: {
          id: workerId,
        },
        headers: {
          "Accept-Language": i18n.language,
        },
      });

      if (response.ok) {
        handleOpenAdd();
      }
    } catch (error: any) {
      console.log(error);
    }
  }
  async function handleSubmitForm(values: WorkerDto) {
    if (isView) return;

    console.log("values: ", values);

    const dataObj: { [key: string]: any } = { ...values };
    const formData = new FormData();

    for (const key in dataObj) {
      const element = dataObj[key];
      if (Object.prototype.hasOwnProperty.call(dataObj, key)) {
        if (element instanceof Date) {
          formData.append(key, element.toISOString());
        } else if (Array.isArray(element)) {
          for (const subEle of element) {
            formData.append(key, subEle);
          }
        } else {
          formData.append(key, element);
        }
      }
    }

    if (fileRef.current) {
      formData.append("imageFile", fileRef.current);
    }

    if (isEdit) {
      await handleUpdate(formData);
    } else {
      await handleCreate(formData);
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }

    fileRef.current = file;
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex-grow w-full flex mt-[18px] flex-col p-5">
      <div className="w-full">
        <Breadcrumbs aria-label="breadcrumb" separator="›" sx={{ ...fontCairo, marginBottom: "28px" }}>
          <Link color="inherit" href={"/workers"} className="text-base font-bold no-underline text-[var(--primary)]">
            {t("Workers")}
          </Link>
          {!isEdit && !isView && (
            <Typography className="text-[15px]" sx={{ color: "text.primary", ...fontCairo }}>
              {t("Add new worker")}
            </Typography>
          )}
          {isEdit && (
            <Typography className="text-[15px]" sx={{ color: "text.primary", ...fontCairo }}>
              {t("Edit worker")}
            </Typography>
          )}
        </Breadcrumbs>
        <form onSubmit={handleSubmit(handleSubmitForm)}>
          <div className="bg-[#fff] p-5 radius-[8px] mt-5">
            <h3 className="text-[#0B0311]  text-[16px] font-bold pb-2 border-0" style={{ border: 0 }}>
              {!isEdit && !isView && <span className="text-[15px]">{t("Add new worker")}</span>}
              {isEdit && <span className="text-[15px]">{t("Edit worker")}</span>}
            </h3>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs value={value} onChange={(_, newValue) => handleChange(newValue)} aria-label="basic tabs example">
                <Tab label={t("Personal info")} {...a11yProps(0)} />
                <Tab label={t("Job info")} {...a11yProps(1)} />
              </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
              <div className="flex gap-x-10 mt-10">
                <div className="w-[180px] h-[200px]">
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {!imagePreview && (
                      <div className="bg-[#f7f8fa] flex justify-center items-center w-full h-[200px] rounded-tl-[18px] rounded-tr-[18px] leading-[200px]">
                        <div className="bg-white w-[50px] h-[50px]  flex border border-[#E8EEEE] rounded-full m-auto">
                          <Image
                            src={upload}
                            alt=""
                            className="text-center leading-[50px] mx-auto  justify-center mt-[25%] text-[var(--primary)] w-[20px] text-[20px]"
                          />
                        </div>
                      </div>
                    )}
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Selected image"
                        className="rounded-tl-[18px] rounded-tr-[18px] w-full h-[210px] object-cover"
                      />
                    )}
                    <div className="relative">
                      <button type="button" className="upload_button" onClick={handleButtonClick}>
                        <FiUpload />
                        {t("Upload image")}
                      </button>
                      <input
                        type="file"
                        disabled={isView || isHttpClientLoading}
                        ref={fileInputRef}
                        // style={{ top: 0, position: "absolute" }}
                        style={{ display: "none", top: 0, position: "absolute" }}
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="w-3/4">
                  <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 gap-x-10">
                    <div className="mb-5">
                      <label className="block w-full text-[15px] font-normal whitespace-nowrap">
                        {t("Worker name")} <span className="text-[#f00] mx-2">*</span>
                      </label>
                      <TextField
                        // disabled={isHttpClientLoading}
                        placeholder={t("Worker name")}
                        {...register("name")}
                        disabled={isView || isHttpClientLoading}
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <Image src={user} width={24} height={24} alt="filter" />
                              </InputAdornment>
                            ),
                          },
                        }}
                        className="w-full custom-field-modules  px-5 mt-2 text-lg border-2 rounded-lg font-secondary text-secondary"
                      />
                      {errors.name?.message && <small className="text-[#f00]">{t(errors.name.message)}</small>}
                    </div>
                    <div className="mb-5">
                      <label className="block w-full text-[15px] font-normal whitespace-nowrap">
                        {t("Date of birth")} <span className="text-[#f00] mx-2">*</span>
                      </label>
                      <Controller
                        control={control}
                        name="dateOfBirth"
                        render={({ field: { value, onChange } }) => (
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              disabled={isView || isHttpClientLoading}
                              className="w-full custom-field-modules  px-5 mt-2 text-lg border-2 rounded-lg font-secondary text-secondary"
                              onChange={(newValue) => onChange(newValue?.toDate() ?? null)}
                              value={dayjs(value)}
                              slots={{
                                openPickerIcon: () => <Image src={calender} alt="" className="w-[24px] h-[24px]" />,
                              }}
                            />
                          </LocalizationProvider>
                        )}
                      />
                      {errors.dateOfBirth?.message && <small className="text-[#f00]">{t(errors.dateOfBirth.message)}</small>}
                    </div>
                    <div className="mb-5">
                      <label className="block w-full text-[15px] font-normal whitespace-nowrap">
                        {t("Place number")} <span className="text-[#f00] mx-2">*</span>
                      </label>
                      <TextField
                        placeholder={t("Place number")}
                        disabled={isView || isHttpClientLoading}
                        {...register("residenceNumber")}
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <Image src={personal_data} width={24} height={24} alt="filter" />
                              </InputAdornment>
                            ),
                          },
                        }}
                        className="w-full custom-field-modules  px-5 mt-2 text-lg border-2 rounded-lg font-secondary text-secondary"
                      />
                      {errors.residenceNumber?.message && <small className="text-[#f00]">{t(errors.residenceNumber.message)}</small>}
                    </div>
                    <div className="mb-5">
                      <label className="block w-full text-[15px] font-normal whitespace-nowrap">
                        {t("Phone number")} <span className="text-[#f00] mx-2">*</span>
                      </label>
                      <TextField
                        disabled={isView || isHttpClientLoading}
                        placeholder={t("Phone number")}
                        {...register("phone")}
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <Image src={mobile} width={24} height={24} alt="filter" />
                              </InputAdornment>
                            ),
                          },
                        }}
                        className="w-full custom-field-modules  px-5 mt-2 text-lg border-2 rounded-lg font-secondary text-secondary"
                      />
                      {errors.phone?.message && <small className="text-[#f00]">{t(errors.phone.message)}</small>}
                    </div>
                    <div className="mb-5">
                      <label className="block w-full text-[15px] font-normal whitespace-nowrap">{t("Choose religion")}</label>
                      <Controller
                        control={control}
                        name="religionId"
                        render={({ field: { value, onChange } }) => (
                          <Select
                            displayEmpty
                            disabled={isView || isHttpClientLoading}
                            className="w-full custom-field-modules  px-5 mt-2 text-lg border-2 rounded-lg font-secondary text-secondary"
                            value={value}
                            onChange={onChange}
                            input={
                              <OutlinedInput
                                startAdornment={
                                  <InputAdornment position="start">
                                    <Image src={personal_data} width={24} height={24} alt="filter" />
                                  </InputAdornment>
                                }
                              />
                            }
                            sx={{ height: "48px" }}
                          >
                            <MenuItem value={-1} disabled>
                              {t("Choose religion")}
                            </MenuItem>
                            {religions.map((religion) => (
                              <MenuItem key={religion.key} value={religion.key}>
                                {religion.value}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                      />
                      {errors.religionId?.message && <small className="text-[#f00]">{t(errors.religionId.message)}</small>}
                    </div>
                    <div className="mb-5">
                      <label className="block w-full text-[15px] font-normal whitespace-nowrap">
                        {t("Number of Years experience")} <span className="text-[#f00] mx-2">*</span>
                      </label>
                      <TextField
                        placeholder={t("Years of experience")}
                        disabled={isView || isHttpClientLoading}
                        {...register("yearsOfExperience")}
                        type="number"
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <Image src={filter} width={24} height={24} alt="filter" />
                              </InputAdornment>
                            ),
                          },
                        }}
                        className="w-full custom-field-modules  px-5 mt-2 text-lg border-2 rounded-lg font-secondary text-secondary"
                      />
                      {errors.yearsOfExperience?.message && (
                        <small className="text-[#f00]">{t(errors.yearsOfExperience.message)}</small>
                      )}
                    </div>
                    <div className="mb-5">
                      <label className="block w-full text-[15px] font-normal whitespace-nowrap">
                        {t("Choose language")} <span className="text-[#f00] mx-2">*</span>
                      </label>
                      <Controller
                        control={control}
                        name="languageId"
                        render={({ field: { value, onChange } }) => (
                          <Select
                            displayEmpty
                            disabled={isView || isHttpClientLoading}
                            className="w-full custom-field-modules  px-5 mt-2 text-lg border-2 rounded-lg font-secondary text-secondary"
                            value={value}
                            onChange={onChange}
                            input={
                              <OutlinedInput
                                startAdornment={
                                  <InputAdornment position="start">
                                    <Image src={globe} width={24} height={24} alt="filter" />
                                  </InputAdornment>
                                }
                              />
                            }
                            sx={{ height: "48px" }}
                          >
                            <MenuItem value={-1} disabled>
                              {t("Choose language")}
                            </MenuItem>
                            {languages.map((language) => (
                              <MenuItem key={language.key} value={language.key}>
                                {language.value}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                      />
                      {errors.languageId?.message && <small className="text-[#f00]">{t(errors.languageId.message)}</small>}
                    </div>
                    <div className="mb-5">
                      <label className="block w-full text-[15px] font-normal whitespace-nowrap">
                        {t("Choose nationality")} <span className="text-[#f00] mx-2">*</span>
                      </label>
                      <Controller
                        control={control}
                        name="nationalityId"
                        render={({ field: { value, onChange } }) => (
                          <Select
                            disabled={isView || isHttpClientLoading}
                            className="w-full custom-field-modules  px-5 mt-2 text-lg border-2 rounded-lg font-secondary text-secondary"
                            value={value}
                            onChange={onChange}
                            displayEmpty
                            input={
                              <OutlinedInput
                                startAdornment={
                                  <InputAdornment position="start">
                                    <Image src={flag} width={24} height={24} alt="filter" />
                                  </InputAdornment>
                                }
                              />
                            }
                            sx={{ height: "48px" }}
                          >
                            <MenuItem value={""} disabled>
                              {t("Choose nationality")}
                            </MenuItem>
                            {nationalities.map((nationality) => (
                              <MenuItem key={nationality.id} value={nationality.id}>
                                {getTranslatedName(nationality.names, i18n.language) || nationality.name}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                      />

                      {errors.nationalityId?.message && <small className="text-[#f00]">{t(errors.nationalityId.message)}</small>}
                    </div>
                    <div className="mb-5">
                      <label className="block w-full text-[15px] font-normal whitespace-nowrap">
                        {t("Choose gender")} <span className="text-[#f00] mx-2">*</span>
                      </label>
                      <Controller
                        control={control}
                        name="genderId"
                        render={({ field: { value, onChange } }) => (
                          <Select
                            disabled={isView || isHttpClientLoading}
                            className="w-full custom-field-modules  px-5 mt-2 text-lg border-2 rounded-lg font-secondary text-secondary"
                            value={value}
                            onChange={onChange}
                            displayEmpty
                            input={
                              <OutlinedInput
                                startAdornment={
                                  <InputAdornment position="start">
                                    <Image src={profile} width={24} height={24} alt="filter" />
                                  </InputAdornment>
                                }
                              />
                            }
                            sx={{ height: "48px" }}
                          >
                            <MenuItem value={-1} disabled>
                              {t("Choose gender")}
                            </MenuItem>
                            {genders.map((gn) => (
                              <MenuItem key={gn.key} value={gn.key}>
                                {gn.value}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                      />

                      {errors.genderId?.message && <small className="text-[#f00]">{t(errors.genderId.message)}</small>}
                    </div>
                  </div>
                  {!isValid && <span className="text-[#f00]">{t("Job info is required")}</span>}
                </div>
              </div>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              <div className="grid mt-10 grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 gap-x-10">
                <div className="mb-5">
                  <label className="block w-full text-[15px] font-normal whitespace-nowrap">
                    {t("Date of first enter")} <span className="text-[#f00] mx-2">*</span>
                  </label>
                  <Controller
                    control={control}
                    name="firstEntryDate"
                    render={({ field: { value, onChange } }) => (
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          disabled={isView || isHttpClientLoading}
                          className="w-full custom-field-modules  px-5 mt-2 text-lg border-2 rounded-lg font-secondary text-secondary"
                          value={dayjs(value)}
                          onChange={(newValue) => onChange(newValue?.toDate() ?? null)}
                          slots={{
                            openPickerIcon: () => <Image src={calender} alt="" className="w-[24px] h-[24px]" />,
                          }}
                        />
                      </LocalizationProvider>
                    )}
                  />
                  {errors.firstEntryDate?.message && <small className="text-[#f00]">{t(errors.firstEntryDate.message)}</small>}
                </div>
                <div className="mb-5">
                  <label className="block w-full text-[15px] font-normal whitespace-nowrap">
                    {t("Date of last enter")} <span className="text-[#f00] mx-2">*</span>
                  </label>
                  <Controller
                    control={control}
                    name="lastEntryDate"
                    render={({ field: { value, onChange } }) => (
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          disabled={isView || isHttpClientLoading}
                          className="w-full custom-field-modules  px-5 mt-2 text-lg border-2 rounded-lg font-secondary text-secondary"
                          value={dayjs(value)}
                          onChange={(newValue) => onChange(newValue?.toDate() ?? null)}
                          slots={{
                            openPickerIcon: () => <Image src={calender} alt="" className="w-[24px] h-[24px]" />,
                          }}
                        />
                      </LocalizationProvider>
                    )}
                  />
                  {errors.lastEntryDate?.message && <small className="text-[#f00]">{t(errors.lastEntryDate.message)}</small>}
                </div>
                <div className="mb-5">
                  <label className="block w-full text-[15px] font-normal whitespace-nowrap">
                    {t("Exist date B.C")} <span className="text-[#f00] mx-2">*</span>
                  </label>
                  <Controller
                    control={control}
                    name="dateOfExit"
                    render={({ field: { value, onChange } }) => (
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          disabled={isView || isHttpClientLoading}
                          className="w-full custom-field-modules  px-5 mt-2 text-lg border-2 rounded-lg font-secondary text-secondary"
                          value={dayjs(value)}
                          onChange={(newValue) => onChange(newValue?.toDate() ?? null)}
                          slots={{
                            openPickerIcon: () => <Image src={calender} alt="" className="w-[24px] h-[24px]" />,
                          }}
                        />
                      </LocalizationProvider>
                    )}
                  />
                  {errors.dateOfExit?.message && <small className="text-[#f00]">{t(errors.dateOfExit.message)}</small>}
                </div>
                <div className="mb-5">
                  <label className="block w-full text-[15px] font-normal whitespace-nowrap">
                    {t("Date of start work")} <span className="text-[#f00] mx-2">*</span>
                  </label>
                  <Controller
                    control={control}
                    name="workStartDate"
                    render={({ field: { value, onChange } }) => (
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          disabled={isView || isHttpClientLoading}
                          className="w-full custom-field-modules  px-5 mt-2 text-lg border-2 rounded-lg font-secondary text-secondary"
                          value={dayjs(value)}
                          onChange={(newValue) => onChange(newValue?.toDate() ?? null)}
                          slots={{
                            openPickerIcon: () => <Image src={calender} alt="" className="w-[24px] h-[24px]" />,
                          }}
                        />
                      </LocalizationProvider>
                    )}
                  />
                  {errors.workStartDate?.message && <small className="text-[#f00]">{t(errors.workStartDate.message)} </small>}
                </div>
                <div className="mb-5">
                  <label className="block w-full text-[15px] font-normal whitespace-nowrap">
                    {t("Visa expiry date")} <span className="text-[#f00] mx-2">*</span>
                  </label>
                  <Controller
                    control={control}
                    name="visaExpiryDate"
                    render={({ field: { value, onChange } }) => (
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          disabled={isView || isHttpClientLoading}
                          className="w-full custom-field-modules  px-5 mt-2 text-lg border-2 rounded-lg font-secondary text-secondary"
                          value={dayjs(value)}
                          onChange={(newValue) => onChange(newValue?.toDate() ?? null)}
                          slots={{
                            openPickerIcon: () => <Image src={calender} alt="" className="w-[24px] h-[24px]" />,
                          }}
                        />
                      </LocalizationProvider>
                    )}
                  />
                  {errors.visaExpiryDate?.message && <small className="text-[#f00]">{t(errors.visaExpiryDate.message)}</small>}
                </div>
                <div className="mb-5">
                  <label className="block w-full text-[15px] font-normal whitespace-nowrap">
                    {t("Last exit port")} <span className="text-[#f00] mx-2">*</span>
                  </label>
                  <TextField
                    disabled={isView || isHttpClientLoading}
                    placeholder={t("Last exit port")}
                    {...register("lastEntryPort")}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Image src={filter} width={24} height={24} alt="filter" />
                          </InputAdornment>
                        ),
                      },
                    }}
                    className="w-full custom-field-modules  px-5 mt-2 text-lg border-2 rounded-lg font-secondary text-secondary"
                  />
                  {errors.lastEntryPort?.message && <small className="text-[#f00]">{t(errors.lastEntryPort.message)}</small>}
                </div>
                <div className="mb-5">
                  <label className="block w-full text-[15px] font-normal whitespace-nowrap">
                    {t("Salary")} <span className="text-[#f00] mx-2">*</span>
                  </label>
                  <TextField
                    disabled={isView || isHttpClientLoading}
                    placeholder={t("Salary")}
                    {...register("salary")}
                    type="number"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Image src={money} width={24} height={24} alt="filter" />
                          </InputAdornment>
                        ),
                      },
                    }}
                    className="w-full custom-field-modules  px-5 mt-2 text-lg border-2 rounded-lg font-secondary text-secondary"
                  />
                  {errors.salary?.message && <small className="text-[#f00]">{t(errors.salary.message)}</small>}
                </div>
                <div className="mb-5">
                  <label className="block w-full text-[15px] font-normal whitespace-nowrap">
                    {t("Limit number")} <span className="text-[#f00] mx-2">*</span>
                  </label>
                  <TextField
                    disabled={isView || isHttpClientLoading}
                    placeholder={t("Limit number")}
                    {...register("borderNumber")}
                    type="number"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Image src={personal_data} width={24} height={24} alt="filter" />
                          </InputAdornment>
                        ),
                      },
                    }}
                    className="w-full custom-field-modules  px-5 mt-2 text-lg border-2 rounded-lg font-secondary text-secondary"
                  />
                  {errors.borderNumber?.message && <small className="text-[#f00]">{t(errors.borderNumber.message)}</small>}
                </div>
                <div className="mb-5">
                  <label className="block w-full text-[15px] font-normal whitespace-nowrap">
                    {t("Passport number")} <span className="text-[#f00] mx-2">*</span>
                  </label>
                  <TextField
                    disabled={isView || isHttpClientLoading}
                    placeholder={t("Passport number")}
                    {...register("passportNumber")}
                    type="number"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Image src={personal_data} width={24} height={24} alt="filter" />
                          </InputAdornment>
                        ),
                      },
                    }}
                    className="w-full custom-field-modules  px-5 mt-2 text-lg border-2 rounded-lg font-secondary text-secondary"
                  />
                  {errors.passportNumber?.message && <small className="text-[#f00]">{t(errors.passportNumber.message)}</small>}
                </div>
                <div className="mb-5">
                  <label className="block w-full text-[15px] font-normal whitespace-nowrap">
                    {t("External office")} <span className="text-[#f00] mx-2">*</span>
                  </label>
                  <TextField
                    disabled={isView || isHttpClientLoading}
                    placeholder={t("External office")}
                    {...register("externalOffice")}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Image src={personal_data} width={24} height={24} alt="filter" />
                          </InputAdornment>
                        ),
                      },
                    }}
                    className="w-full custom-field-modules  px-5 mt-2 text-lg border-2 rounded-lg font-secondary text-secondary"
                  />
                  {errors.externalOffice?.message && <small className="text-[#f00]">{t(errors.externalOffice.message)}</small>}
                </div>
                <div className="mb-5">
                  <label className="block w-full text-[15px] font-normal whitespace-nowrap">
                    {t("Visa type")} <span className="text-[#f00] mx-2">*</span>
                  </label>
                  <TextField
                    disabled={isView || isHttpClientLoading}
                    placeholder={t("Visa type")}
                    {...register("visaType")}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Image src={filter} width={24} height={24} alt="filter" />
                          </InputAdornment>
                        ),
                      },
                    }}
                    className="w-full custom-field-modules  px-5 mt-2 text-lg border-2 rounded-lg font-secondary text-secondary"
                  />
                  {errors.visaType?.message && <small className="text-[#f00]">{t(errors.visaType.message)}</small>}
                </div>
                <div className="mb-5">
                  <label className="block w-full text-[15px] font-normal whitespace-nowrap">
                    {t("Skills")} <span className="text-[#f00] mx-2">*</span>
                  </label>
                  <TextField
                    disabled={isView || isHttpClientLoading}
                    placeholder={t("Skills")}
                    {...register("skills")}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Image src={filter} width={24} height={24} alt="filter" />
                          </InputAdornment>
                        ),
                      },
                    }}
                    className="w-full custom-field-modules  px-5 mt-2 text-lg border-2 rounded-lg font-secondary text-secondary"
                  />
                  {errors.skills?.message && <small className="text-[#f00]">{t(errors.skills.message)}</small>}
                </div>
                <div className="mb-5">
                  <label className="block w-full text-[15px] font-normal whitespace-nowrap">
                    {t("Choose worker status")} <span className="text-[#f00] mx-2">*</span>
                  </label>
                  <Controller
                    control={control}
                    name="jobStatusId"
                    render={({ field: { value, onChange } }) => (
                      <Select
                        className="w-full custom-field-modules  px-5 mt-2 text-lg border-2 rounded-lg font-secondary text-secondary"
                        value={value}
                        displayEmpty
                        disabled={isView || isHttpClientLoading}
                        onChange={onChange}
                        input={
                          <OutlinedInput
                            startAdornment={
                              <InputAdornment position="start">
                                <Image src={profile} width={24} height={24} alt="filter" />
                              </InputAdornment>
                            }
                          />
                        }
                        sx={{ height: "48px" }}
                      >
                        <MenuItem value={-1} disabled>
                          {t("Choose worker status")}
                        </MenuItem>
                        {jobsStatus.map((ws) => (
                          <MenuItem key={ws.key} value={ws.key}>
                            {ws.value}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />

                  {errors.jobStatusId?.message && <small className="text-[#f00]">{t(errors.jobStatusId.message)}</small>}
                </div>
                <div className="mb-5">
                  <label className="block w-full text-[15px] font-normal whitespace-nowrap">
                    {t("Choose job")} <span className="text-[#f00] mx-2">*</span>
                  </label>
                  <Controller
                    control={control}
                    name="jobId"
                    render={({ field: { value, onChange } }) => (
                      <Select
                        displayEmpty
                        className="w-full custom-field-modules  px-5 mt-2 text-lg border-2 rounded-lg font-secondary text-secondary"
                        value={value}
                        disabled={isView || isHttpClientLoading}
                        onChange={(e) => {
                          onChange(e.target.value);
                        }}
                        input={
                          <OutlinedInput
                            startAdornment={
                              <InputAdornment position="start">
                                <FiBriefcase className="text-[#808080] text-2xl" />
                              </InputAdornment>
                            }
                          />
                        }
                        sx={{ height: "48px" }}
                      >
                        <MenuItem value={""} disabled>
                          {t("Choose job")}
                        </MenuItem>
                        {jobs.map((job) => (
                          <MenuItem key={job.id} value={job.id}>
                            {getTranslatedName(job.names, i18n.language) || job.name}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.jobId?.message && <small className="text-[#f00]">{t(errors.jobId.message)}</small>}
                </div>

                <div className="mb-5">
                  <label className="block w-full text-[15px] font-normal whitespace-nowrap">
                    {t("Choose provided service")} <span className="text-[#f00] mx-2">*</span>
                  </label>
                  <Controller
                    control={control}
                    name="workerTypeOfServicesIds"
                    render={({ field: { value, onChange } }) => (
                      <Select
                        disabled={isView || isHttpClientLoading}
                        className="w-full custom-field-modules  px-5 mt-2 text-lg border-2 rounded-lg font-secondary text-secondary"
                        value={value}
                        multiple
                        displayEmpty
                        onChange={(e) => {
                          onChange(e.target.value);
                        }}
                        input={
                          <OutlinedInput
                            startAdornment={
                              <InputAdornment position="start">
                                <Image src={star} width={24} height={24} alt="filter" />
                              </InputAdornment>
                            }
                          />
                        }
                        sx={{ height: "48px" }}
                      >
                        <MenuItem value={[]} disabled>
                          {t("Choose provided service")}
                        </MenuItem>
                        {providedServices.map((ps) => (
                          <MenuItem key={ps.id} value={ps.id}>
                            {getTranslatedName(ps.names, i18n.language) || ps.name}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />

                  {errors.workerTypeOfServicesIds?.message && (
                    <small className="text-[#f00]">{t(errors.workerTypeOfServicesIds.message)}</small>
                  )}
                </div>
                <div className="mb-5">
                  <label className="block w-full text-[15px] font-normal whitespace-nowrap">
                    {t("Choose branch")} <span className="text-[#f00] mx-2">*</span>
                  </label>
                  <Controller
                    control={control}
                    name="branchId"
                    render={({ field: { value, onChange } }) => (
                      <Select
                        disabled={isView || isHttpClientLoading}
                        className="w-full custom-field-modules  px-5 mt-2 text-lg border-2 rounded-lg font-secondary text-secondary"
                        value={value}
                        displayEmpty
                        onChange={(e) => {
                          onChange(e.target.value);
                        }}
                        input={
                          <OutlinedInput
                            startAdornment={
                              <InputAdornment position="start">
                                <Image src={buildings} width={24} height={24} alt="filter" />
                              </InputAdornment>
                            }
                          />
                        }
                        sx={{ height: "48px" }}
                      >
                        <MenuItem value={""} disabled>
                          {t("Choose branch")}
                        </MenuItem>
                        {branches.map((branch) => (
                          <MenuItem key={branch.id} value={branch.id}>
                            {getTranslatedName(branch.names, i18n.language) || branch.name}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />

                  {errors.branchId?.message && <small className="text-[#f00]">{t(errors.branchId.message)}</small>}
                </div>
                <div className="mb-5">
                  <label className="block w-full text-[15px] font-normal whitespace-nowrap">
                    {t("Operating faes")} <span className="text-[#f00] mx-2">*</span>
                  </label>
                  <TextField
                    disabled={isView || isHttpClientLoading}
                    placeholder={t("Operating faes")}
                    {...register("operatingFees")}
                    type="number"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Image src={personal_data} width={24} height={24} alt="filter" />
                          </InputAdornment>
                        ),
                      },
                    }}
                    className="w-full custom-field-modules  px-5 mt-2 text-lg border-2 rounded-lg font-secondary text-secondary"
                  />
                  {errors.operatingFees?.message && <small className="text-[#f00]">{t(errors.operatingFees.message)}</small>}
                </div>
              </div>
            </CustomTabPanel>
          </div>

          <div className="flex justify-end mt-8 mb-20">
            <div className="flex mb-2 gap-x-5 btns-wrapper">
              <button type="submit" className="add_button">
                {!isEdit && !isView && <span>{t("Add")}</span>}
                {(isEdit || isView) && <span>{t("Update info")}</span>}{" "}
              </button>

              <button type="button" onClick={handleOpenCancel} className="cancel_btn">
                {t("Cancel")}
              </button>
            </div>
          </div>
        </form>

        <Modal open={openAdd} onClose={handleCloseAdd} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
          <Box sx={modalStyle}>
            <Typography id="transition-modal-title" className="mb-10" variant="h6" component="h2">
              <ButtonBase className="close_modal" onClick={handleCloseAdd}>
                X
              </ButtonBase>
            </Typography>
            <Image
              src={ask_add}
              alt="logo"
              width={400}
              height={400}
              className="text-center justify-center m-auto actions_tr"
              style={{ textAlign: "center", margin: "0 auto", display: "block" }}
            />

            <div className="text-center">
              <h3 className="font-bold text-[20px]">{t("Congratulations")}</h3>
              <p className="font-normal text-[18px] mt-2">
                {!isEdit && !isView && <span>{t("The operation was completed successfully")}</span>}
                {(isEdit || isView) && <span>{t("The operation was updated successfully")}</span>}
              </p>
            </div>

            <div className="flex w-full mt-5">
              <Link className="add_popup_button" href={"/workers"}>
                {t("View workers")}
              </Link>
            </div>
          </Box>
        </Modal>

        <Modal
          open={openCancel}
          onClose={handleCloseCancel}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={modalStyle}>
            <Typography id="transition-modal-title" className="mb-10" variant="h6" component="h2">
              <ButtonBase className="close_modal" onClick={handleCloseCancel}>
                X
              </ButtonBase>
            </Typography>
            <Image
              src={ask_cancel}
              alt="logo"
              width={400}
              height={400}
              className="text-center justify-center m-auto actions_tr"
              style={{ textAlign: "center", margin: "auto" }}
            />

            <div className="text-center">
              <h3 className="font-bold text-[20px]">{t("Are you sure to cancel?")}</h3>
              <p className="font-normal text-[18px] mt-2">{t("When you click Cancel you will lose all information")}</p>
            </div>

            <div className="w-full mt-5 flex gap-5">
              <Link href={"/workers"} className="cancel_popup_button">
                {t("Cancel")}
              </Link>
              <Button onClick={handleCloseCancel} className="back_popup_button">
                {t("Back")}
              </Button>
            </div>
          </Box>
        </Modal>
      </div>
    </div>
  );
}
