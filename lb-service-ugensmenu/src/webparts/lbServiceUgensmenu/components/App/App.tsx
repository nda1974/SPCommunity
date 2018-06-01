import * as React from 'react';
import styles from './App.module.scss';
import pnp ,{setup}from "sp-pnp-js";
import { escape } from '@microsoft/sp-lodash-subset';
import { IAppProps } from './AppProps';
import { IAppState } from './AppState';
import MenuContainer from '../MenuContainer/MenuContainer'
export default class App extends React.Component<IAppProps, IAppState> {
  public constructor(props:IAppProps,state:IAppState){  
    super(props);
  
    this.state= {
                  listItems:[]
                }

                setup({
                  sp: {
                      headers: {
                          Accept: "application/json; odata=nometadata"
                      },
                      baseUrl:"https://lbforsikring.sharepoint.com/sites/service"
                  }
              });
              
              this.fetchSharePointData();
              
    
}

private fetchSharePointData(){
  var numDayOfWeek = 0;
	var theCurrentDate = new Date();
	var numDayOfMonth = theCurrentDate.getDate();
	var theRecipe = null;
	var theInformation = null;
	var theWeekDays = new Array();
	var theDates = new Array();
	var theRecipes = ["Ingen varm ret", "Ingen varm ret", "Ingen varm ret", "Ingen varm ret", "Ingen varm ret"];
  var strDates = "";
  numDayOfWeek = theCurrentDate.getDay();
  // Monday, tuesday, wednesday, thursday and friday of current week
  theWeekDays = [1 - numDayOfWeek, 2 - numDayOfWeek, 3 - numDayOfWeek, 4 - numDayOfWeek, 5 - numDayOfWeek];
  var startDate = new Date();
  var endDate = new Date();
  startDate.setDate(numDayOfMonth + theWeekDays[0]);
  endDate.setDate(numDayOfMonth + theWeekDays[4]);
  var startDateFx = startDate.toLocaleDateString();
  var endDateFx = endDate.toLocaleDateString();
  
  startDate.setHours(0,0,0,0);
  endDate.setHours(23,59,59,999);
  
  //.filter(`Start lt datetime'${today.toISOString()}' and Slut gt datetime'${today.toISOString()}'`)
  
  pnp.sp.web.lists.getByTitle("Ugens Menu")
              .items.select("Title,Dato")
              .filter(`Dato ge datetime'${startDate.toISOString()}' and Dato lt datetime'${endDate.toISOString()}'`)
              .orderBy("Dato")
              .get().then(
                (data:any[])=>{this.setState({listItems:data})}
              );
}
  public render(): React.ReactElement<IAppProps> {
    return (
      <div >
        <MenuContainer listItems={this.state.listItems} title={this.props.title}/> 
      </div>
    );
  }
}
