import * as z from "zod"
import * as imports from "../zod-add-schema"
import { data_reg_type } from "@prisma/client"
import { Completecommissions, RelatedcommissionsModel, Completemerchants, RelatedmerchantsModel, Completeaffiliates, RelatedaffiliatesModel, Completereporttraders, RelatedreporttradersModel } from "./index"

export const data_regModel = z.object({
  id: z.number().int(),
  rdate: z.date(),
  ctag: z.string(),
  affiliate_id: z.number().int(),
  group_id: z.number().int(),
  banner_id: z.number().int(),
  profile_id: z.number().int(),
  product_id: z.number().int(),
  country: z.string(),
  trader_id: z.string(),
  sub_trader_id: z.number().int(),
  phone: z.string(),
  trader_alias: z.string(),
  type: z.nativeEnum(data_reg_type),
  freeParam: z.string(),
  freeParam2: z.string(),
  freeParam3: z.string(),
  freeParam4: z.string(),
  freeParam5: z.string(),
  merchant_id: z.number().int(),
  status: z.string(),
  lastUpdate: z.date(),
  platform: z.string(),
  uid: z.string(),
  saleStatus: z.string(),
  lastSaleNote: z.string(),
  lastSaleNoteDate: z.date(),
  lastTimeActive: z.date(),
  initialftddate: z.date(),
  initialftdtranzid: z.string(),
  isSelfDeposit: z.boolean(),
  ftdamount: z.number(),
  FTDqualificationDate: z.date(),
  traderVolume: z.number(),
  traderTrades: z.number().int(),
  lastStatsRecordDate: z.date(),
  traderValue: z.number(),
  lastDepositRecordDate: z.date(),
  email: z.string(),
  couponName: z.string(),
  campaign_id: z.string().nullish(),
  dummySource: z.number().int(),
  currentDate: z.date(),
  reporttradersTraderID: z.string().nullish(),
  reporttradersAffiliate_id: z.number().int().nullish(),
  reporttradersMerchant_id: z.number().int().nullish(),
})

export interface Completedata_reg extends z.infer<typeof data_regModel> {
  commissions: Completecommissions[]
  merchant: Completemerchants
  affiliate: Completeaffiliates
  reporttraders?: Completereporttraders | null
}

/**
 * Relateddata_regModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const Relateddata_regModel: z.ZodSchema<Completedata_reg> = z.lazy(() => data_regModel.extend({
  commissions: RelatedcommissionsModel.array(),
  merchant: RelatedmerchantsModel,
  affiliate: RelatedaffiliatesModel,
  reporttraders: RelatedreporttradersModel.nullish(),
}))
