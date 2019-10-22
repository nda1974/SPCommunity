import * as React from 'react';
import {ITaxonomyProps} from './ITaxonomyProps'
import { escape } from '@microsoft/sp-lodash-subset';
import { Session, ITermStore, ITermSet, ITermData, ITerm, taxonomy } from "@pnp/sp-taxonomy";
export interface IPTerm {
  parent?: string;
  id: string;
  name: string;
}
export default class Taxonomy extends React.Component<ITaxonomyProps, {}> {
  public constructor(props:ITaxonomyProps){  
    super(props);
  
    
  }
  public async  _getParentTermset():Promise<(ITermData & ITerm)[]>
  {

    // const c = this.getTermsetWithChildren();
    
    const termStoreId='0707214bea454b77ad616b684c6b9ca6';
    const termSetId='9e91d608-4edf-4028-ad72-caf75cd260eb';
    const taxonomySessionUrl = 'https://lbforsikring.sharepoint.com/sites/FunctionalDocumentation';
    const taxonomy = new Session("https://lbforsikring.sharepoint.com/sites/nicd");
    const store: ITermStore = taxonomy.termStores.getById(termStoreId);
    const terms:Promise<(ITerm & ITermData)[]> = store.getTermSetById("a618850d-bf83-4fab-b831-c25678ba32d4").terms.select('Name','Id','IsRoot').get();
    
     return await terms.then(t=>{
        return t;
     });
    
  }

  
  public async _getChildTerms():Promise<(ITermData & ITerm)[]> {
    const termStoreId='0707214bea454b77ad616b684c6b9ca6';
    const termGroupId='1e1ff369-f019-47fe-9540-bba376af5373';
    const termId='b8bd8e01-a499-45ec-9eaa-b8f385e8d16b';
    
    const store: ITermStore = taxonomy.termStores.getById(termStoreId);

    const term:Promise<(ITerm & ITermData)>= store.getTermSetById("a618850d-bf83-4fab-b831-c25678ba32d4").getTermById(termId).get();

    return await term.then(t=>{

      const term2:Promise<(ITerm & ITermData)[]>=t.terms.get();
      // term2.then(t2=>{
      //   console.log(t2)
      // })
      return term2;
    })
    
     
    
  }
  public async getTermsetWithChildrenORG(): Promise<IPTerm[]> {
    const termStoreId='0707214bea454b77ad616b684c6b9ca6';
    const termGroupId='1e1ff369-f019-47fe-9540-bba376af5373';
    
    let tms: IPTerm[] = [];
    return new Promise<any[]>((resolve, reject) => {
      const tbatch = taxonomy.createBatch();
      return taxonomy.termStores.getById(termStoreId).get().then((resp1: ITermStore) => {        
        return resp1.getTermGroupById(termGroupId).termSets.get().then((resp2: ITermSet[]) => {
          resp2.forEach((ele: ITermSet) => {
            ele.terms.select('Name', 'Id').inBatch(tbatch).get().then((resp3: ITerm[]) => {
              resp3.forEach((t: ITerm) => {
                let ip1 = {
                  parent: ele['Name'],
                  name: t['Name'],
                  id: t['Id'].replace("/Guid(", "").replace(")/", "")
                };
                tms.push(ip1);
              });
            });
          });
          tbatch.execute().then(_r => {
            resolve(tms);
          });
        });
      });
    });
  }
  
  
}
