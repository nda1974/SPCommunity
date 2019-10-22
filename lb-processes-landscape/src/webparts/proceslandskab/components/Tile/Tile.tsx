import * as React from 'react';
import styles from './Tile.module.scss';
import { ITileProps } from './ITileProps';
import { Icon } from 'office-ui-fabric-react/lib/components/Icon';

export class Tile extends React.Component<ITileProps, {}> {

    public constructor(props:ITileProps,{}){  
        super(props);
        // this.state= {
        //             }
    this._onclickCallBack = this._onclickCallBack.bind(this);
    }
  private _onclickCallBack():void{
      this.props.hoverCallBack(this.props.id);
  }  
  public render(): React.ReactElement<ITileProps> {
    const tileStyle: React.CSSProperties = {};
    

    return (
      <div className={styles.tile} style={tileStyle} onClick={this._onclickCallBack}>
          <div>
            {this.props.name}
          </div>
        
        {/* <div>
          
          <div className={styles.tileIcon}>
            <Icon iconName={this.props.icon} />
          </div>
          <div className={styles.tileTitle}>
            {this.props.title}
          </div>

          
          </div> */}
      </div>
    );
  }
}