import * as z from "zod"
import * as imports from "../zod-add-schema"
import { permissionprofile_defaultViewForDealType } from "@prisma/client"
import { Completeaffiliates, RelatedaffiliatesModel } from "./index"

export const permissionprofileModel = z.object({
  id: z.number().int(),
  defaultViewForDealType: z.nativeEnum(permissionprofile_defaultViewForDealType),
  name: z.string(),
  rdate: z.date(),
  affiliate_id: z.number().int(),
  reportsPermissions: z.string(),
  fieldsPermissions: z.string(),
  valid: z.boolean(),
  created_by_admin_id: z.number().int(),
})

export interface Completepermissionprofile extends z.infer<typeof permissionprofileModel> {
  affiliates: Completeaffiliates[]
}

/**
 * RelatedpermissionprofileModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedpermissionprofileModel: z.ZodSchema<Completepermissionprofile> = z.lazy(() => permissionprofileModel.extend({
  affiliates: RelatedaffiliatesModel.array(),
}))
