import pnp ,{setup}from "sp-pnp-js";
import * as React from 'react';
import styles from './App.module.scss'
import { IAppProps } from './IAppProps';
import { IAppState } from './IAppState';
import { escape } from '@microsoft/sp-lodash-subset';
import {CalendarInlineExample} from '../Calendar/CalendarInlineExample'
import { DateRangeType } from 'office-ui-fabric-react/lib/Calendar';
import { DatePicker, DayOfWeek, IDatePickerStrings } from 'office-ui-fabric-react/lib/DatePicker';
import {Periods} from '../Periods/Periods'

const DayPickerStrings: IDatePickerStrings = {
  months: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ],

  shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],

  days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],

  shortDays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],

  goToToday: 'Go to today',
  prevMonthAriaLabel: 'Go to previous month',
  nextMonthAriaLabel: 'Go to next month',
  prevYearAriaLabel: 'Go to previous year',
  nextYearAriaLabel: 'Go to next year',

  isRequiredErrorMessage: 'Field is required.',
  invalidInputErrorMessage: 'Invalid date format.',

  isOutOfBoundsErrorMessage: `Date must be between -}`
};

export interface IDatePickerRequiredExampleState {
  firstDayOfWeek?: DayOfWeek;
}

export default class App extends React.Component<IAppProps, IAppState> {
  
  public constructor(props:IAppProps,state:IAppState){  
    super(props);
    
    this.state= {
                  events:[],
                  periods:[],
                  bookings:[]
                }

                setup({
                  sp: {
                      headers: {
                          Accept: "application/json; odata=nometadata"
                      },
                      baseUrl:"https://lbforsikring.sharepoint.com/sites/hr"
                  }
              });
              
    //.filter(`Start lt datetime'${today.toISOString()}' and Slut gt datetime'${today.toISOString()}'`)
    var arrPeriods:any[]=[];
    var arrBookings:any[]=[];
    this.fetchSharePointData().then(
        response=>{
          response.map((item)=>
            // console.log(item.Title);
          {
            if(item.Category == "Perioder"){
              arrPeriods.push(item)
            }
            else if(item.Category == "Reservation"){
              arrBookings.push(item)
            }
          }
            
          )
          this.setState({periods:arrPeriods,bookings:arrBookings})
        }
      // (data:any[])=>{this.setState({periods:data})}
    );
              
    this.placeReservation=this.placeReservation.bind(this);
    
}
  // private fetchSharePointData(){
  //   pnp.sp.web.lists.getByTitle("VillaI")
  //                   .items
  //                   // .select("Title,Category")
  //                   .filter("Category eq 'Perioder'")
  //                   .get()
  //                   .then(
  //                     (data:any[])=>{this.setState({events:data})}
  //                   );
  // }
  
  
//   private SetMyStates(response):any{
//     let p:any[]=[];
//     response.map((e)=>{
//       if(e.Category == 'Perioder'){
//         p.push(e);
//       }
//       return p;
// })



//   }
  private  fetchSharePointData():Promise<any>{
    return pnp.sp.web.lists.getByTitle("VillaI")
                    .items
                    // .select("Title,Category")
                    // .filter("Category eq 'Perioder'")
                    .getAll();
                    
  }
  private addSharePointData(eventDate,endDate){
    
    
    var localTime = eventDate.getTime();
    var localTimeoffset =  eventDate.getTimezoneOffset() * 60000;
    eventDate.setTime(localTime + localTimeoffset);

    localTime = endDate.getTime();
    localTimeoffset =  endDate.getTimezoneOffset() * 60000;
    endDate.setTime(localTime + localTimeoffset);
    
    
    pnp.sp.web.lists.getByTitle("VillaI").items.add({
      Title: 'Hello SPFX All day - TEST',
      Category:'Reservation',
      EventDate:eventDate,
      EndDate:endDate
    }).then((iar: any) => {
      console.log(iar);
      // status = <span></span>;
      // this.setState({ status:status });
      
      // this.setState({ hideDialog:false });
      //window.location.href = "https://lbforsikring.sharepoint.com/sites/Service";
      
    });
  }
  public render(): React.ReactElement<IAppProps> {
    return (
      
            <div >
              
              {this.state.periods.map((item)=>{
                  var startDate = new Date(item.EventDate)
                  var endDate = new Date(item.EndDate)
                  return(
                        <Periods  eventDate ={startDate}
                                  endDate={endDate}
                                  makeReservation={this.placeReservation}
                                  displayStartDate={new Intl.DateTimeFormat('da-DK', { 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: '2-digit' 
                                  }).format(startDate)}
                                  displayEndDate={new Intl.DateTimeFormat('da-DK', { 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: '2-digit' 
                                  }).format(endDate)}/>
                  )
                })}

            </div>
          
    );
  }
  private placeReservation(eventDate,endDate){
    this.addSharePointData(eventDate,endDate)
    console.log(eventDate +'--'+ endDate)
  }
}
