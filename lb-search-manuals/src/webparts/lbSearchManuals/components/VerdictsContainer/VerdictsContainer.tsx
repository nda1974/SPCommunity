import * as React from "react";
import * as ReactDom from 'react-dom';




export interface IVerdictsContainerProps {
    // 
    verdictsCollection:string;
}

export interface IVerdictsContainerState {
    // 
    text:string;
}

export default class VerdictsContainer extends React.Component<IVerdictsContainerProps, IVerdictsContainerState> {
    private queryText:string;
    public constructor(props:IVerdictsContainerProps,state:IVerdictsContainerState){  
            super(props);  
        this.state={
            text:'statetext'
        }
            
    }
      



      
    
    
      


      public render(): React.ReactElement<IVerdictsContainerProps> {  
          return(
            <div>
              <div>{this.props.verdictsCollection}</div>
            </div>
          );
      }
    }