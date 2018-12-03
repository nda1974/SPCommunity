import * as React from 'react';
import styles from './GenerateInvoiceCsvFile.module.scss';
import { IGenerateInvoiceCsvFileProps } from './IGenerateInvoiceCsvFileProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { MSGraphClient } from '@microsoft/sp-http';
//https://docs.microsoft.com/en-us/sharepoint/dev/spfx/use-aad-tutorial


export default class GenerateInvoiceCsvFile extends React.Component<IGenerateInvoiceCsvFileProps, {}> {
  public render(): React.ReactElement<IGenerateInvoiceCsvFileProps> {
    this._readGroups();
    return (
      <div className={ styles.generateInvoiceCsvFile }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            <div className={ styles.column }>
              <span className={ styles.title }>Welcome to SharePoint!</span>
              <p className={ styles.subTitle }>Customize SharePoint experiences using Web Parts.</p>
              <p className={ styles.description }>{escape(this.props.description)}</p>
              <a href="https://aka.ms/spfx" className={ styles.button }>
                <span className={ styles.label }>Learn more</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      
    );
    
  }
  private _searchWithGraph(): void {

    // Log the current operation
    console.log("Using _searchWithGraph() method");

    this.props.ctx.msGraphClientFactory
      .getClient()
      .then((client: MSGraphClient): void => {
        // From https://github.com/microsoftgraph/msgraph-sdk-javascript sample
        client
          .api("users")
          .version("v1.0")
          .select("displayName,mail,userPrincipalName")
          .filter(`(givenName eq '${escape(this.state.searchFor)}') or (surname eq '${escape(this.state.searchFor)}') or (displayName eq '${escape(this.state.searchFor)}')`)
          .get((err, res) => {  

            if (err) {
              console.error(err);
              return;
            }

            // Prepare the output array
            var users: Array<IUserItem> = new Array<IUserItem>();

            // Map the JSON response to the output array
            res.value.map((item: any) => {
              users.push( { 
                displayName: item.displayName,
                mail: item.mail,
                userPrincipalName: item.userPrincipalName,
              });
            });

            // Update the component state accordingly to the result
            this.setState(
              {
                users: users,
              }
            );
          });
      });
  }
  protected _readGroups(){
    // Query for all groups on the tenant using Microsoft Graph.
    this.context.graphHttpClient.get(`v1.0/groups?$orderby=displayName`, GraphHttpClient.configurations.v1).then((response: HttpClientResponse) => {
      if (response.ok) {
        return response.json();
      } else {
        console.warn(response.statusText);
      }
    }).then((result: any) => {
      // Transfer result values to the group variable
      
    });
 }
  protected _readGroupsNICD(){
    // Query for all groups on the tenant using Microsoft Graph.
    // https://graph.microsoft.com/beta/bookingBusinesses/LBForsikring@lbforsikring.onmicrosoft.com/calendarView?start=2018-11-01T00:00:00.00Z&end=2018-11-30T00:00:00.00Z
    this.context.graphHttpClient.get("v1.0/bookingBusinesses/LBForsikring@lbforsikring.onmicrosoft.com/calendarView?start=2018-11-01T00:00:00.00Z&end=2018-11-30T00:00:00.00Z", 
      GraphHttpClient.configurations.v1).then((response: HttpClientResponse) => {
      if (response.ok) {
        console.log(response.json())
        return response.json();
      } else {
        console.warn(response.statusText);
      }
    }).then((result: any) => {
      // Transfer result values to the group variable
      
    });
 }
 
}
