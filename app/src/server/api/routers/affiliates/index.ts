import { createTRPCRouter } from "../../trpc";
import {
  getAccount,
  recoverPassword,
  registerAccount,
  updateAccount,
} from "./account";
import { getPaymentDetails, getPaymentsPaid } from "./billing";
import { getMerchantCreative, getMerchantCreativeMeta } from "./creative";
import {
  getAllPerformanceChart,
  getConversionChart,
  getDashboard,
  getPerformanceChart,
  getTopMerchantCreative,
} from "./dashboard";

import {
  getReportsColumns,
  upsertReportsColumns,
} from "./reports/columns-setup";

import { getDashboardDeviceReport } from "./dashboard-device-report";
import { deleteProfile, getProfiles, upsertProfile } from "./profile";
import { getMerchantSubCreative, getMerchantSubCreativeMeta } from "./sub";
import { deleteTicket, getTickets, upsertTicket } from "./ticket";

import { badQuerySample } from "@/server/api/routers/affiliates/bad-query-sample";
import {
  getAllMerchants,
  getLongCountries,
} from "@/server/api/routers/affiliates/reports";
import {
  // exportClicksReport,
  getClicksReport,
} from "@/server/api/routers/affiliates/reports/clicks-report";
import {
  exportCommissionReport,
  getCommissionReport,
} from "@/server/api/routers/affiliates/reports/commission-report";
import { getCreativeReport } from "@/server/api/routers/affiliates/reports/creative-report";
import {
  exportInstallReport,
  getInstallReport,
} from "@/server/api/routers/affiliates/reports/install-reports";
import { getLandingPageData } from "@/server/api/routers/affiliates/reports/landing-page";
import { getPixelLogReport } from "@/server/api/routers/affiliates/reports/pixel-log-report";
import { getProfileReportData } from "@/server/api/routers/affiliates/reports/profile-report";
import {
  exportQuickSummaryReport,
  getQuickReportSummary,
} from "@/server/api/routers/affiliates/reports/quick-summary";
import { getSubAffiliateReport } from "@/server/api/routers/affiliates/reports/sub-affiliate-report";
import { getTraderReport } from "@/server/api/routers/affiliates/reports/trader-report";
import { getCommissions } from "./commission";
import { getDocuments } from "./document";
import {
  deletePixelMonitor,
  getPixelMonitor,
  getPixelMonitorMeta,
  upsertPixelMonitor,
} from "./pixel";
import { getCountryReport } from "@/server/api/routers/affiliates/reports/country-report";
import { getTranslateReportFake } from "@/server/api/routers/affiliates/reports/translate-report-fake";
import { generateBannerCode } from "@/server/api/routers/affiliates/get-tracking-code";
import { getCountryReportDashboard } from "@/server/api/routers/affiliates/reports/country-report-dashboard";

export const affiliatesRouter = createTRPCRouter({
  getDashboard,
  getTopMerchantCreative,
  getPerformanceChart,
  getAllPerformanceChart,
  getConversionChart,
  getReportsColumns,
  upsertReportsColumns,

  getMerchantCreativeMeta,
  getMerchantCreative,
  generateBannerCode,

  getMerchantSubCreativeMeta,
  getMerchantSubCreative,

  getProfiles,
  upsertProfile,
  deleteProfile,

  getAccount,
  updateAccount,
  registerAccount,
  recoverPassword,

  getPaymentsPaid,
  getPaymentDetails,

  getTickets,
  upsertTicket,
  deleteTicket,

  getQuickReportSummary,
  exportQuickSummaryReport,
  getInstallReport,
  exportInstallReport,
  getAllMerchants,

  getCommissionReport,
  exportCommissionReport,
  getClicksReport,
  getTranslateReportFake,
  // exportClicksReport,
  getCountryReport,
  getDocuments,

  getCommissions,
  getCreativeReport,
  getLandingPageData,

  getTraderReport,
  getLongCountries,
  getPixelLogReport,

  getProfileReportData,
  getSubAffiliateReport,

  getPixelMonitorMeta,
  getPixelMonitor,
  upsertPixelMonitor,
  deletePixelMonitor,

  badQuerySample,

  getCountryReportDashboard,
  getDashboardDeviceReport,
});
