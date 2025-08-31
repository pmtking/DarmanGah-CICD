"use client";

import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

/* --- تایپ‌ها --- */
type SupplementaryInsurance = {
  companyName: string;
  contractPrice: number;
};

type ClinicServiceFormValues = {
  serviceCode: string;
  serviceName: string;
  serviceGroup: string;
  pricePublic: number;
  priceGovernmental: number;
  baseInsurancePrice: number;
  isFreeForStaff: boolean;
  supplementaryInsurances: SupplementaryInsurance[];
};

/* --- اسکیمای Zod (اختیاری، برای ولیدیشن) --- */
const supplementarySchema = z.object({
  companyName: z.string().min(1, "نام شرکت الزامی است"),
  contractPrice: z.coerce.number().min(0, "قیمت نامعتبر است"),
});

const formSchema = z.object({
  serviceCode: z.string().min(1, "کد خدمت الزامی است"),
  serviceName: z.string().min(1, "نام خدمت الزامی است"),
  serviceGroup: z.string().min(1, "گروه خدمت الزامی است"),
  pricePublic: z.coerce.number().min(0),
  priceGovernmental: z.coerce.number().min(0),
  baseInsurancePrice: z.coerce.number().min(0),
  isFreeForStaff: z.boolean().default(false),
  supplementaryInsurances: z.array(supplementarySchema).optional(),
});

export default function ClinicServiceForm() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ClinicServiceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serviceCode: "",
      serviceName: "",
      serviceGroup: "",
      pricePublic: 0,
      priceGovernmental: 0,
      baseInsurancePrice: 0,
      isFreeForStaff: false,
      supplementaryInsurances: [],
    },
  });

  // توجه: generic دوم 'supplementaryInsurances' کمک می‌کنه تایپ درست باشه
  const { fields, append, remove } = useFieldArray<
    ClinicServiceFormValues,
    "supplementaryInsurances"
  >({
    control,
    name: "supplementaryInsurances",
  });

  const onSubmit = (data: ClinicServiceFormValues) => {
    console.log("فرم ارسال شد:", data);
    // ارسال به بک‌اند اینجا انجام شود
  };

  return (
    <div className="max-w-3xl mx-auto mt-6 p-6 bg-white rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4 text-center">افزودن خدمت جدید</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">کد خدمت</label>
          <input {...register("serviceCode")} className="w-full p-2 border rounded" />
          {errors.serviceCode && <p className="text-xs text-red-500">{errors.serviceCode.message}</p>}
        </div>

        <div>
          <label className="block text-sm mb-1">نام خدمت</label>
          <input {...register("serviceName")} className="w-full p-2 border rounded" />
          {errors.serviceName && <p className="text-xs text-red-500">{errors.serviceName.message}</p>}
        </div>

        <div>
          <label className="block text-sm mb-1">گروه خدمت</label>
          <input {...register("serviceGroup")} className="w-full p-2 border rounded" />
          {errors.serviceGroup && <p className="text-xs text-red-500">{errors.serviceGroup.message}</p>}
        </div>

        <div>
          <label className="block text-sm mb-1">تعرفه آزاد</label>
          <input type="number" {...register("pricePublic", { valueAsNumber: true })} className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block text-sm mb-1">تعرفه دولتی</label>
          <input type="number" {...register("priceGovernmental", { valueAsNumber: true })} className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block text-sm mb-1">تعرفه بیمه پایه</label>
          <input type="number" {...register("baseInsurancePrice", { valueAsNumber: true })} className="w-full p-2 border rounded" />
        </div>

        <div className="col-span-2 flex items-center gap-2">
          <input type="checkbox" {...register("isFreeForStaff")} id="isFreeForStaff" />
          <label htmlFor="isFreeForStaff">رایگان برای پرسنل</label>
        </div>

        {/* بیمه‌های تکمیلی */}
        <div className="col-span-2">
          <h3 className="font-medium mb-2">بیمه‌های تکمیلی</h3>

          {fields.map((field, index) => (
            <div key={field.id} className="flex flex-col md:flex-row gap-2 mb-2 items-center">
              {/* اینجا از `as const` استفاده شده تا مسیر رشته‌ای با تایپ فرم همخوانی داشته باشه */}
              <input
                placeholder="نام شرکت بیمه"
                {...register(`supplementaryInsurances.${index}.companyName` as const)}
                className="flex-1 p-2 border rounded"
                defaultValue={field.companyName}
              />
              <input
                type="number"
                placeholder="مبلغ قرارداد"
                {...register(`supplementaryInsurances.${index}.contractPrice` as const, { valueAsNumber: true })}
                className="w-40 p-2 border rounded"
                defaultValue={field.contractPrice as any}
              />
              <button type="button" onClick={() => remove(index)} className="px-3 py-2 bg-red-500 text-white rounded">
                حذف
              </button>
            </div>
          ))}

          <div>
            <button
              type="button"
              onClick={() => append({ companyName: "", contractPrice: 0 })}
              className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
            >
              + افزودن بیمه تکمیلی
            </button>
          </div>
        </div>

        <div className="col-span-2 flex justify-center mt-4">
          <button type="submit" className="w-full md:w-1/2 py-2 bg-amber-500 text-white rounded">
            ذخیره خدمت
          </button>
        </div>
      </form>
    </div>
  );
}
