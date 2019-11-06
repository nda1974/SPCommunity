import { any } from "prop-types";

export interface IDomainProps {
    name: string;
    id:string;
    description: string;
    url: string;
    icon: string;
    hoverCallBack:any;
    processes:any[];
  }