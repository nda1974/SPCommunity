import * as React from 'react';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';

export interface IPeriodsState {
  test:string;
}

export interface IPeriodsProps {
  displayStartDate:string;
  displayEndDate:string
  eventDate:Date;
  endDate:Date;
  makeReservation:any;
}

export class Periods extends React.Component<IPeriodsProps, IPeriodsState> {
  public constructor(props: IPeriodsProps) {
    super(props);

    this.state = {
      test: null
    };
    
    this._bookPeriod=this._bookPeriod.bind(this);
  }

  public render(): JSX.Element {
    
    return (
      <div> {this.props.displayStartDate} - {this.props.displayEndDate} 
        <DefaultButton text='Book periode' onClick={this._bookPeriod} />
      </div>
    );
  }
  private  _bookPeriod():void{
    // console.log('Book mig: '  +  this.props.eventDate );
    this.props.makeReservation(this.props.eventDate,this.props.endDate);
  }
  private  makeReservation():void{
    // console.log('Book mig: '  +  this.props.eventDate );
    this.props.makeReservation(this.props.eventDate,this.props.endDate);
  }

  
  
}
