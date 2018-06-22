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
import * as moment from 'moment'

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
                  drafts:[],
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
    var arrPeriodsDays:any[]=[];
    var arrBookings:any[]=[];
    
    this.fetchSharePointData().then(
        response=>{
          response.map((item)=>
          {
            var startOfPeriod=this.getDateFromDateString(item.EventDate)
            
            
            if (item.RecurrenceData!=null) {
              var p=new DOMParser()
              var o=p.parseFromString(item.RecurrenceData,"text/xml")  
              var endOfPeriod=this.getDateFromDateString(o.childNodes[0].childNodes[0].childNodes[2].childNodes[0].nodeValue)
              // var start= moment(item.EventDate)
              // var end= moment(item.EndDate)
              // var days =end.diff(start,"days");
            
              var periodCounterStart = new Date(Number(startOfPeriod))
              var periodCounterEnd = new Date(Number(startOfPeriod))
              while (Number(startOfPeriod)<=Number(endOfPeriod)) {
                console.log(startOfPeriod)
                
                
                if (startOfPeriod.getDay()==6) {
                  
                  periodCounterEnd=startOfPeriod
                  var MyPeriode={
                    start:periodCounterStart,
                    end:periodCounterEnd
                  }
                  arrPeriods.push(MyPeriode)
                  periodCounterStart=periodCounterEnd
                }
                
                startOfPeriod.setDate(startOfPeriod.getDate()+1)
              }
            }
            
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
    );
              
    this.placeReservation=this.placeReservation.bind(this);
    
}
  
  private  fetchSharePointData():Promise<any>{
    return pnp.sp.web.lists.getByTitle("VillaI")
                    .items
                    .select("Title,Category,RecurrenceData,EventDate,EndDate")
                    // .filter("Category eq 'Perioder'")
                    .getAll();
                    
  }
  private getDateFromDateString(dateString):Date{
    var year =dateString.split('-')[0]
    var month =dateString.split('-')[1]
    var day =dateString.split('-')[2].split('T')[0]
    return new Date(year,month-1,day);
  }
  private addSharePointData(eventDate,endDate){
    
    
    var localTime = eventDate.getTime();
    var localTimeoffset =  eventDate.getTimezoneOffset() * 60000;
    eventDate.setTime(localTime + localTimeoffset);

    localTime = endDate.getTime();
    localTimeoffset =  endDate.getTimezoneOffset() * 60000;
    endDate.setTime(localTime + localTimeoffset);
    
    
    pnp.sp.web.lists.getByTitle("VillaI").items.add({
      Title: 'Hello SPFX All day',
      Category:'Reservation',
      EventDate:eventDate,
      EndDate:endDate,
      fAllDayEvent:true
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
            <div>  
              {this.state.periods.map((item)=>{
                var startDate = new Date(item.EventDate)
                var endDate = new Date(item.EndDate)

                  return this.newMethod(startDate, endDate)
              })}
            </div>
          );
  }
  private newMethod(startDate: Date, endDate: Date): JSX.Element {
    return (<Periods eventDate={startDate} endDate={endDate} makeReservation={this.placeReservation} displayStartDate={new Intl.DateTimeFormat('da-DK', {
      year: 'numeric',
      month: 'long',
      day: '2-digit'
    }).format(startDate)} displayEndDate={new Intl.DateTimeFormat('da-DK', {
      year: 'numeric',
      month: 'long',
      day: '2-digit'
    }).format(endDate)} />);
  }

  private placeReservation(eventDate,endDate){
    this.addSharePointData(eventDate,endDate)
    console.log(eventDate +'--'+ endDate)
  }
}
