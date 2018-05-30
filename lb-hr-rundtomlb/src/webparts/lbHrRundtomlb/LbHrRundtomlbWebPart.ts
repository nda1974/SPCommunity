import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';

import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneChoiceGroup,
  PropertyPaneToggle
} from '@microsoft/sp-webpart-base';

import * as strings from 'LbHrRundtomlbWebPartStrings';
import { IAppProps } from './components/App/AppProps';
import App from './components/App/App'

export interface ILbHrRundtomlbWebPartProps {
  description: string;
  eventType: string;
  sortOrder:boolean;
}
export interface ILbHrRundtomlbWebPartState {
  description: string;
  listItems:any[];
  eventType: string;
}
export default class LbHrRundtomlbWebPart extends BaseClientSideWebPart<ILbHrRundtomlbWebPartProps> {

 
  public render(): void {
    
    const element: React.ReactElement<IAppProps > = React.createElement(
      App,
      {
        eventType:this.properties.eventType,
        webPartHeader:this.properties.description,
        sortOrder:this.properties.sortOrder
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: "Konfigurer webparten"
          },
          groups: [
            {
              groupName: "",
              groupFields: [
                PropertyPaneTextField('description', {
                  label: "Overskrift på webparten"
                }),
                PropertyPaneChoiceGroup('eventType',{
                  label:'Vælg begivenhed',
                  options:[{ key: 'Fratrædelse', text: 'Fratrædelse'}, 
                       { key: 'Jubilæum', text: 'Jubilæum' }, 
                       { key: 'Ny kollega', text: 'Ny kollega' },
                       { key: 'Pension', text: 'Pension' },
                       { key: 'Rokering', text: 'Rokering' },  
                       { key: 'Rund dag', text: 'Rund dag' },  
                       { key: 'Udnævnelse', text: 'Udnævnelse' }  
                  ]
                }),
                PropertyPaneToggle('sortOrder', {
                  label: 'Sorter begivenheder efter dato',
                  onText:'Førstkomne begivenheder øverst',
                  offText:'Førstkomne begivenheder nederst',
                  checked:true

                })
              ]
            }
          ]
        }
      ]
    };
  }
}
