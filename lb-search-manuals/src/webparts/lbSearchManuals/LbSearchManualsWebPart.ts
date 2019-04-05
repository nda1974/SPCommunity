import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneChoiceGroup
} from '@microsoft/sp-webpart-base';

import * as strings from 'LbSearchManualsWebPartStrings';

import App, { IAppProps } from './components/App/App';

export interface ILbSearchManualsWebPartProps {
  description: string;
  manualType: string;
  searchUrl:string;
}



export default class LbSearchManualsWebPart extends BaseClientSideWebPart<ILbSearchManualsWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IAppProps > = React.createElement(
      App,
      {
        manualType: this.properties.manualType,
        webPartContext:this.context,
        searchUrl:this.properties.searchUrl
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
            
            description: "Vælg typen af håndbøger der skal vises" 
          },
          groups: [
            {
              groupName: 'Håndbog',
              groupFields: [
                PropertyPaneChoiceGroup('manualType',{
                  label:'Vælg type',
                  options:[
                      { key: 'Ansvar', text: 'Ansvar' },
                      { key: 'Bil', text: 'Bil' },
                      { key: 'BPG', text: 'Bilskade Portal Guide' },
                      { key: 'Beredskab', text: 'Beredskab' },
                      { key: 'Bygning', text: 'Bygning' },
                      { key: 'Båd', text: 'Båd'}, 
                      { key: 'Ejerskifte', text: 'Ejerskifte' }, 
                      { key: 'Erhverv', text: 'Erhverv' }, 
                      { key: 'Generel skadepolitik', text: 'Generel skadepolitik' }, 
                      { key: 'Gerningsmand', text: 'Gerningsmand' },
                      { key: 'Hund', text: 'Hund' },
                      { key: 'IDIT', text: 'IDIT' },
                      { key: 'Indbo', text: 'Indbo' },
                      { key: 'Individuel lønsikring', text: 'Lønsikring - individuel' },
                      { key: 'Lønsikring kollektiv', text: 'Lønsikring - kollektiv' },
                      { key: 'Personskade', text: 'Personskade' },
                      { key: 'Regres', text: 'Regres' },
                      { key: 'Rejse', text: 'Rejse' },
                      { key: 'Retshjælp', text: 'Retshjælp' },
                      { key: 'Sanering', text: 'Sanering' },
                      { key: 'ScalePoint', text: 'ScalePoint' },
                      { key: 'Skadeservice', text: 'Skadeservice' },
                      { key: 'Skybrudsmanual', text: 'Skybrudsmanual' },
                      { key: 'Stormflod', text: 'Stormflod' },
                      { key: 'Stormmanual', text: 'Stormmanual' },
                      { key: 'Storskade', text: 'Storskade' },
                      { key: 'Ulykkeskade', text: 'Ulykkeskade' }
                  ]
                }),
                PropertyPaneTextField('searchUrl',{
                  label:'Indtast site scope'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
