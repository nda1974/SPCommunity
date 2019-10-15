import * as React from 'react';
import styles from './Proceslandskab.module.scss';
import { IProceslandskabProps } from './IProceslandskabProps';
import { escape } from '@microsoft/sp-lodash-subset';
import Taxonomy from './Taxonomy/Taxonomy'
import { IProceslandskabState } from './IProceslandskabState';
export default class Proceslandskab extends React.Component<IProceslandskabProps, IProceslandskabState> {

  public constructor(props:IProceslandskabProps,state:IProceslandskabState){  
    super(props);
    this.state={
      items:[]
    }
  
  let tax: Taxonomy=new Taxonomy(
  {
      description:''
  }
  );
  
  const r = tax._getTermset().then(res=>{
    console.log(res);
    this.setState({items:res})
  });

    


  }
  public render(): React.ReactElement<IProceslandskabProps> {
    return (
      <div className={ styles.proceslandskab }>
        <div className={ styles.container }>
          {
            this.state.items.map(term=>{
              return(
                <div>

                  {term.IsRoot==true?
                  <div><h1>{term.Name}</h1></div>:
                  <div>{term.Name}</div>
                  }
                </div>
              )
            })
          }
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
}
