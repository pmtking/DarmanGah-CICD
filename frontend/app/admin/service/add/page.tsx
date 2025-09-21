"use client";

import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useService } from "@/hooks/useServies";

type Insurance = {
  companyName: string;
  contractPrice: number;
};

type ClinicServiceFormValues = {
  serviceCode: string;
  serviceName: string;
  serviceGroup: string;
  pricePublic: number;
  priceGovernmental: number;
  isFreeForStaff: boolean;
  baseInsurances: Insurance[];
  supplementaryInsurances: Insurance[];
};

const insuranceSchema = z.object({
  companyName: z.string().min(1, "نام شرکت الزامی است"),
  contractPrice: z.coerce.number().min(0, "مبلغ نامعتبر است"),
});

const formSchema = z.object({
  serviceCode: z.string().min(1, "کد خدمت الزامی است"),
  serviceName: z.string().min(1, "نام خدمت الزامی است"),
  serviceGroup: z.string().min(1, "گروه خدمت الزامی است"),
  pricePublic: z.coerce.number().min(0),
  priceGovernmental: z.coerce.number().min(0),
  isFreeForStaff: z.boolean(),
  baseInsurances: z.array(insuranceSchema),
  supplementaryInsurances: z.array(insuranceSchema),
});

export default function ClinicServiceForm() {
  const { createService } = useService();

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
      isFreeForStaff: false,
      baseInsurances: [],
      supplementaryInsurances: [],
    },
  });

  const baseInsurancesField = useFieldArray({
    control,
    name: "baseInsurances",
  });

  const supplementaryField = useFieldArray({
    control,
    name: "supplementaryInsurances",
  });

  const onSubmit = async (data: ClinicServiceFormValues) => {
    try {
      await createService(data);
      console.log("خدمت جدید ثبت شد:", data);
    } catch (error) {
      console.error("خطا در ثبت خدمت:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-6 p-6 bg-white/10 backdrop-blur-lg rounded-xl shadow-lg text-white">
      <h2 className="text-2xl font-bold mb-6 text-center">افزودن خدمت جدید</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* اطلاعات پایه خدمت */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">کد خدمت</label>
            <input
              {...register("serviceCode")}
              className="w-full p-2 border border-white/30 rounded bg-white/10 focus:ring-2 focus:ring-amber-400"
            />
            {errors.serviceCode && (
              <p className="text-xs text-red-500">{errors.serviceCode.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm mb-1">نام خدمت</label>
            <input
              {...register("serviceName")}
              className="w-full p-2 border border-white/30 rounded bg-white/10 focus:ring-2 focus:ring-amber-400"
            />
            {errors.serviceName && (
              <p className="text-xs text-red-500">{errors.serviceName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm mb-1">گروه خدمت</label>
            <input
              {...register("serviceGroup")}
              className="w-full p-2 border border-white/30 rounded bg-white/10 focus:ring-2 focus:ring-amber-400"
            />
            {errors.serviceGroup && (
              <p className="text-xs text-red-500">{errors.serviceGroup.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm mb-1">تعرفه آزاد</label>
            <input
              type="number"
              {...register("pricePublic", { valueAsNumber: true })}
              className="w-full p-2 border border-white/30 rounded bg-white/10 focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">تعرفه دولتی</label>
            <input
              type="number"
              {...register("priceGovernmental", { valueAsNumber: true })}
              className="w-full p-2 border border-white/30 rounded bg-white/10 focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div className="flex items-center gap-2 mt-1">
            <input
              type="checkbox"
              {...register("isFreeForStaff")}
              className="h-5 w-5 text-amber-400 bg-white/10 border-white/30 rounded"
            />
            <span>رایگان برای پرسنل</span>
          </div>
        </div>

        {/* بیمه پایه */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg border border-white/20">
          <h3 className="text-lg font-semibold mb-3">بیمه پایه</h3>
          {baseInsurancesField.fields.map((field, index) => (
            <div
              key={field.id}
              className="flex flex-col md:flex-row gap-2 mb-2 items-center"
            >
              <input
                placeholder="نام بیمه پایه"
                {...register(`baseInsurances.${index}.companyName` as const)}
                className="flex-1 p-2 border border-white/30 rounded bg-white/10 focus:ring-2 focus:ring-amber-400"
                defaultValue={field.companyName}
              />
              <input
                type="number"
                placeholder="مبلغ قرارداد"
                {...register(`baseInsurances.${index}.contractPrice` as const, {
                  valueAsNumber: true,
                })}
                className="w-40 p-2 border border-white/30 rounded bg-white/10 focus:ring-2 focus:ring-amber-400"
                defaultValue={field.contractPrice as any}
              />
              <button
                type="button"
                onClick={() => baseInsurancesField.remove(index)}
                className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                حذف
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              baseInsurancesField.append({ companyName: "", contractPrice: 0 })
            }
            className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 transition-colors mt-2"
          >
            + افزودن بیمه پایه
          </button>
        </div>

        {/* بیمه تکمیلی */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg border border-white/20">
          <h3 className="text-lg font-semibold mb-3">بیمه‌های تکمیلی</h3>
          {supplementaryField.fields.map((field, index) => (
            <div
              key={field.id}
              className="flex flex-col md:flex-row gap-2 mb-2 items-center"
            >
              <input
                placeholder="نام شرکت بیمه"
                {...register(
                  `supplementaryInsurances.${index}.companyName` as const
                )}
                className="flex-1 p-2 border border-white/30 rounded bg-white/10 focus:ring-2 focus:ring-amber-400"
                defaultValue={field.companyName}
              />
              <input
                type="number"
                placeholder="مبلغ قرارداد"
                {...register(
                  `supplementaryInsurances.${index}.contractPrice` as const,
                  { valueAsNumber: true }
                )}
                className="w-40 p-2 border border-white/30 rounded bg-white/10 focus:ring-2 focus:ring-amber-400"
                defaultValue={field.contractPrice as any}
              />
              <button
                type="button"
                onClick={() => supplementaryField.remove(index)}
                className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                حذف
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              supplementaryField.append({ companyName: "", contractPrice: 0 })
            }
            className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 transition-colors mt-2"
          >
            + افزودن بیمه تکمیلی
          </button>
        </div>

        <div className="flex justify-center mt-4">
          <button
            type="submit"
            className="w-full md:w-1/2 py-2 bg-[#071952] text-white rounded hover:bg-[#071952]/70 transition-colors"
          >
            ذخیره خدمت
          </button>
        </div>
      </form>
    </div>
  );
}
