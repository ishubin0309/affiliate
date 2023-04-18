import { Loading } from "@/components/common/Loading";
import { DataTable } from "@/components/common/data-table/DataTable";
import { PageHeader } from "@/components/common/page/page-header";
import { AffiliateCommissionType } from "@/server/db-types";
import { createColumnHelper } from "@tanstack/react-table";
import { api } from "../../../utils/api";

const columnHelper = createColumnHelper<AffiliateCommissionType>();
const createColumn = (id: keyof AffiliateCommissionType, header: string) =>
  columnHelper.accessor(id, {
    header,
  });

export const Commissions = () => {
  const { data, refetch } = api.affiliates.getCommissions.useQuery();

  if (!data) {
    return null;
  }

  const columns = [
    createColumn("id", "#"),
    createColumn("name", "Merchant"),
    columnHelper.accessor(
      (item) => {
        const pnl = item?.deals?.find((el) => el.dealType === "pnl")
          ? item.deals.find((el) => el.dealType === "pnl")
          : null;
        return pnl ? String(pnl.amount) + "%" : "-";
      },
      {
        id: "PNL",
      }
    ),
    columnHelper.accessor(
      (item) => {
        return "Passport";
      },
      {
        id: "Deposit Charge",
      }
    ),
    columnHelper.accessor(
      (item) => {
        const cpa = item?.deals?.find((el) => el.dealType === "cpa")
          ? item.deals.find((el) => el.dealType === "cpa")
          : null;
        return cpa ? String(cpa.amount) + "%" : "-";
      },
      {
        id: "CPA",
      }
    ),
    columnHelper.accessor(
      (item) => {
        const dcpa = item?.deals?.find((el) => el.dealType === "dcpa")
          ? item.deals.find((el) => el.dealType === "dcpa")
          : null;
        return dcpa ? String(dcpa.amount) + "%" : "-";
      },
      {
        id: "DCPA",
      }
    ),
  ];

  return data ? (
    <>
      <div className="w-full">
        <PageHeader title="Commissions"></PageHeader>
        <DataTable data={data} columns={columns} />
      </div>
    </>
  ) : (
    <Loading />
  );
};
