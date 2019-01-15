import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'KontorartiklerWebPartStrings';
import Kontorartikler from './components/Kontorartikler';
import { IKontorartiklerProps } from './components/IKontorartiklerProps';
import { sp } from "@pnp/sp";
import { IProduct } from './interfaces/IProduct';
import {
  taxonomy,
  ITermStore,
  ITerms,
  ILabelMatchInfo,
  ITerm,
  ITermData,
  ILabels,
  ILabel
} from "@pnp/sp-taxonomy";



export interface IKontorartiklerWebPartProps {
  description: string;
}

export default class KontorartiklerWebPart extends BaseClientSideWebPart<IKontorartiklerWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IKontorartiklerProps > = React.createElement(
      Kontorartikler,
      {
        description: this.properties.description
      }
    );

    ReactDom.render(element, this.domElement);
  }

  public async onInit(): Promise<void> {

    return super.onInit().then(_ => {
  
      // other init code may be present
  
      sp.setup({
        spfxContext: this.context
      }
      );

      this._test();
    });
    
  }
  private async _test():Promise<void>{
    const ProductsList:IProduct[]=[];
    const products = await sp.web.lists.getByTitle("Produkter").items.getAll();
    console.log(products);
    
    const store: ITermStore = await taxonomy.termStores.getById("0707214b-ea45-4b77-ad61-6b684c6b9ca6").get();
    
    // const term: ITerm = await store.getTermById(termGuid).get();
    // const term: ITerm = await store.getTermById(termGuid).get();
    products.map(p=>{
      
      // const a = p.Varegruppe.TermGuid;
      // this._getTaxFieldLabel(a)
      
      ProductsList.push(
        {
          Category:this._getTaxFieldLabel(p.Varegruppe.TermGuid),
          Description:p.Beskrivelse,
          Id:p.ID,
          ImageUrl:p.Produktbillede
        }
      )
    })
    console.log(ProductsList);
  }
  
  private async  _getTaxFieldLabel(fieldName):Promise<string>{
    var resLabel:string="";

    const store: ITermStore = await taxonomy.termStores.getById("0707214bea454b77ad616b684c6b9ca6").get();
    
    const term: ITerm = await store.getTermById(fieldName).get();

    const labels: ILabels = term.labels;

    // labels merged with data
    const labelsWithData = await term.labels.get();

    return labelsWithData[0].Value;
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
