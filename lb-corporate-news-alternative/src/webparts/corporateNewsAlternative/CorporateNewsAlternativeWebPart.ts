import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown,
  IPropertyPaneDropdownOption
} from '@microsoft/sp-webpart-base';

import App from './components/App/App';
import { IAppProps } from './components/App/IAppProps';
import pnp from 'sp-pnp-js/lib/pnp';

export interface ICorporateNewsAlternativeWebPartProps {
  description: string;
  itemName:string;
}

export default class CorporateNewsAlternativeWebPart extends BaseClientSideWebPart<ICorporateNewsAlternativeWebPartProps> {

  private selectedFilter:IPropertyPaneDropdownOption[]=[];
  private lists: IPropertyPaneDropdownOption[];
  private listsDropdownDisabled: boolean = true;

  public render(): void {
    const element: React.ReactElement<IAppProps > = React.createElement(
      App,
      {
        webPartContext:this.context,
        filter:this.properties.itemName
      }
    );

    ReactDom.render(element, this.domElement);

  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
  protected onPropertyPaneConfigurationStart(): void {
    this.listsDropdownDisabled = !this.lists;
 
    if (this.lists) {
      return;
    }
 
    this.context.statusRenderer.displayLoadingIndicator(this.domElement, 'Vent venligst..');
 
    let listOptions: IPropertyPaneDropdownOption[]=[];
    listOptions.push({key:"",text:""})
    pnp.sp.web.lists.getByTitle("NyhedsAfsendere")
    .items
    .select()
    .get()
    .then((items: any[]) => {
      items.map((i)=>{
        listOptions.push({key:i.Title,text:i.Title})
      })
          this.lists = listOptions;
          this.listsDropdownDisabled = false;
          this.context.propertyPane.refresh();
          this.context.statusRenderer.clearLoadingIndicator(this.domElement);
          this.render();
    });
  }
  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: "Her vælger du hvilken Sektion der er afsender af nyheden, så vises den både på forsiden af Intranette og på Sektionens egen forside"
          },
          groups: [
            {
              groupName: "",
              groupFields: [
                PropertyPaneDropdown('itemName', {
                  label:"Angiv afsender sektion",
                  options: this.lists,
                  disabled: this.listsDropdownDisabled
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
