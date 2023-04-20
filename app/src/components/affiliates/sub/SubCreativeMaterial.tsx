import { Loading } from "@/components/common/Loading";
import { PageHeader } from "@/components/common/page/page-header";
import { SearchApply } from "@/components/common/search/saerch-apply-button";
import { useSearchContext } from "@/components/common/search/search-context";
import type { MerchantSubCreativeType } from "@/server/db-types";
import { api } from "../../../utils/api";
import { SearchSelect } from "../../common/search/search-select";
import { SearchText } from "../../common/search/search-text";
import { CreativeMaterialComponent } from "../creative/CreativeMaterialComponent";

const renderRow = (item: MerchantSubCreativeType) => {
  const values = [
    { title: "Creative Name", value: item.title },
    { title: "Format", value: item.type },
    {
      title: "Landing URL",
      value: String(item.promotion_id) || "General",
    },
    { title: "Size (WxH)", value: `${item.width}x${item.height}` },
    { title: "Impressions", value: `${String(item.views)}` },
    { title: "Clicks", value: `${String(item.clicks)}` },
  ];

  return (
    <CreativeMaterialComponent
      key={item.id}
      values={values}
      file={item.file}
      alt={item.alt}
      url={item.url}
    />
  );
};

export const SubCreativeMaterial = () => {
  const {
    values: { creative: search, type },
  } = useSearchContext();

  const { data: meta } = api.affiliates.getMerchantSubCreativeMeta.useQuery();

  const { data, isRefetching } = api.affiliates.getMerchantSubCreative.useQuery(
    {
      type: type ? String(type) : undefined,
      search: search ? String(search) : undefined,
    },
    { keepPreviousData: true }
  );

  return data ? (
    <div className="w-full">
      <PageHeader title="Marketing Tools" subTitle="Sub Creative Materials">
        <SearchText varName="search" />
        <SearchApply isLoading={isRefetching} />
      </PageHeader>
      <div className="flex-row flex-wrap gap-2 pb-3 md:flex">
        <SearchSelect
          label="Creative Type"
          varName="type"
          choices={meta?.type}
        />
      </div>
      {data?.map(renderRow)}
    </div>
  ) : (
    <Loading />
  );
};
