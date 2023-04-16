import { api } from "../../../utils/api";
import { CreativeMaterialComponent } from "./CreativeMaterialComponent";
import { PageHeader } from "@/components/common/page/page-header";
import { SearchText } from "@/components/common/search/search-text";
import { SearchApply } from "@/components/common/search/saerch-apply-button";
import { Loading } from "@/components/common/Loading";
import React from "react";
import type { MerchantCreativeType } from "@/server/db-types";
import { SearchSelect } from "@/components/common/search/search-select";
import { useSearchContext } from "@/components/common/search/search-context";

const renderRow = (item: MerchantCreativeType) => {
  const values = [
    // { title: "Id", value: item.id },
    { title: "Creative Name", value: item.title },
    { title: "Type", value: item.type },
    {
      title: "Promotion",
      value: String(item.promotion_id) || "General",
    },
    {
      title: "Category",
      value: item.category?.categoryname,
    },
    { title: "Size (WxH)", value: `${item.width}x${item.height}` },
    { title: "Language", value: item.language?.title },
  ];
  return (
    <CreativeMaterialComponent
      key={item.id}
      values={values}
      file={item.file || undefined}
      alt={item.alt}
      url={item.url}
    />
  );
};

export const CreativeMaterial = () => {
  const {
    values: { creative: search, type, category, language, size, promotion },
  } = useSearchContext();

  const { data: meta } = api.affiliates.getMerchantCreativeMeta.useQuery(
    undefined,
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  const { data, isRefetching } = api.affiliates.getMerchantCreative.useQuery(
    {
      type: type ? String(type) : undefined,
      category: category ? Number(category) : undefined,
      language: language ? Number(language) : undefined,
      size: size ? String(size) : undefined,
      promotion: promotion ? Number(promotion) : undefined,
      search: search ? String(search) : undefined,
    },
    { keepPreviousData: true, refetchOnWindowFocus: false }
  );

  console.log(data);

  return data ? (
    <div className="w-full">
      <PageHeader title="Marketing Tools" subTitle="Creative Materials">
        <SearchText varName="creative" />
        <SearchApply isLoading={isRefetching} />
      </PageHeader>
      <div className="mx-4 flex flex-row flex-wrap gap-2 pb-3">
        <SearchSelect
          label="Creative Type"
          varName="type"
          choices={meta?.type}
        />
        <SearchSelect
          label="Category"
          varName="category"
          choices={meta?.merchants_creative_categories}
        />
        <SearchSelect
          label="Language"
          varName="language"
          choices={meta?.language}
        />
        <SearchSelect label="Size" varName="size" choices={meta?.size} />
        <SearchSelect
          label="Promotion"
          varName="promotion"
          emptyTitle="General"
          choices={meta?.merchants_promotions}
        />
      </div>
      {data?.map(renderRow)}
    </div>
  ) : (
    <Loading />
  );
};
