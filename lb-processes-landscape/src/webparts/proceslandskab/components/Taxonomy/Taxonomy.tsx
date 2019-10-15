import * as React from 'react';
import {ITaxonomyProps} from './ITaxonomyProps'
import { escape } from '@microsoft/sp-lodash-subset';
import { Session, ITermStore, ITermSet, ITermData, ITerm } from "@pnp/sp-taxonomy";
export default class Taxonomy extends React.Component<ITaxonomyProps, {}> {
  public constructor(props:ITaxonomyProps){  
    super(props);
  
  
  }
  public async  _getTermset():Promise<(ITermData & ITerm)[]>
  {
    const taxonomy = new Session("https://lbforsikring.sharepoint.com/sites/FunctionalDocumentation");

    const store: ITermStore = taxonomy.termStores.getById("0707214bea454b77ad616b684c6b9ca6");

    const terms:Promise<(ITerm & ITermData)[]> = store.getTermSetById("9e91d608-4edf-4028-ad72-caf75cd260eb").terms.get();
    
     return await terms.then(t=>{

      return t;
     });
    
  }
}
