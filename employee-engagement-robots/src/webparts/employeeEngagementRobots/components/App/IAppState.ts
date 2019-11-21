export interface IAppState {
  sections: any[];
  businessValue: any[];
  robotIdea:IRobotIdea;
  isLoading:boolean;
  createItemSucceded?:boolean;
  showDialog: boolean;


}
export interface IRobotIdea{
  Title:string;
  BusinessValue:string;
  Section:string;
}
