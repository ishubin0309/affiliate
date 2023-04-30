import { Loading } from "@/components/common/Loading";
import { PageHeader } from "@/components/common/page/page-header";
import { SearchApply } from "@/components/common/search/saerch-apply-button";
import { useSearchContext } from "@/components/common/search/search-context";
import { SearchSelect } from "@/components/common/search/search-select";
import { SearchText } from "@/components/common/search/search-text";
import type { MerchantCreativeType } from "@/server/db-types";
import { api } from "../../../utils/api";
import { CreativeMaterialComponent } from "./CreativeMaterialComponent";

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
      creative_id={item.id}
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
      <PageHeader
        title="Marketing Tools"
        subTitle="Creative Materials"
      ></PageHeader>
      <div className="flex flex-row flex-wrap items-end gap-2 pb-3">
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
        <div className="flex-grow" />
        <SearchText varName="creative" />
        <SearchApply isLoading={isRefetching} />
      </div>
      {data?.map(renderRow)}
    </div>
  ) : (
    <Loading />
  );
};
