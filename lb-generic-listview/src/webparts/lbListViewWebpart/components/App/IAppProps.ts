import { IPickerTerms } from "@pnp/spfx-property-controls/lib/PropertyFieldTermPicker";

export interface IAppProps {
  description: string;
  targetListId:string;
  targetSiteUrl:string;
  standardSearchEnabled:boolean;

  //*** solution specific properties ***//
  // SR - Medlemsgrupper //
  medlemsGruppe?:IPickerTerms;
}
