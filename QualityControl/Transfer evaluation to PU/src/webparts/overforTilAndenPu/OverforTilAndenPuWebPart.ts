import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart, PropertyPaneToggle } from '@microsoft/sp-webpart-base';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';

import * as strings from 'OverforTilAndenPuWebPartStrings';
import App from './components/App/App';
import { IAppProps } from './components/App/IAppProps';
import { LinkBase } from 'office-ui-fabric-react';

export interface IOverforTilAndenPuWebPartProps {
  
  isConfigurationTest:boolean;
  testUserEmail:string;
}

export default class OverforTilAndenPuWebPart extends BaseClientSideWebPart<IOverforTilAndenPuWebPartProps> {

  public render(): void {
    
    const element: React.ReactElement<IAppProps > = React.createElement(
      App,
      {
        // currentUserEmail: this.context.pageContext.user.email
        currentUserEmail:this.properties.isConfigurationTest==true
                    ?this.properties.testUserEmail
                    :this.context.pageContext.user.email,
        configuration:this.properties.isConfigurationTest,
        siteUrl:this.properties.isConfigurationTest==true
                    ?"https://lbforsikring.sharepoint.com/sites/Skade"
                    :"https://lbforsikring.sharepoint.com/sites/Skade",
                    evaluationsListId:this.properties.isConfigurationTest==true
                    ?"fc98c6c2-1d45-4502-aedd-970f39c474eb" // https://lbforsikring.sharepoint.com/sites/Skade/Lists/DEV%20-%20Quality%20Control%20%20Claims%20Handler%20Answers
                    :"433d918b-2e51-4ebb-ab2a-3fc9e2b5c540",// https://lbforsikring.sharepoint.com/sites/Skade/Lists/Quality%20Control%20%20Claims%20Handler%20Answers
                    priviledgeUsersListId:'7f1efd48-2c02-4c72-a204-4dd978020b19' 
      }
    );

    ReactDom.render(element, this.domElement);
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
            description: 'Konfigurer webparten til at benytte test eller produktions data' 
          },
          groups: [
            {
              groupFields: [
                
                PropertyPaneToggle('isConfigurationTest', {
                  label: 'Konfiguration',
                  onText:'Test',
                  offText:'Produktion'
                }),
                PropertyPaneTextField('testUserEmail',
                  {
                    label:'Testbrugers email'
                  }
                )
              ]
            }
          ]
        }
      ]
    };
  }
}
