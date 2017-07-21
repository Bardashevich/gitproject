export class GridHeaderAction {
  iconName: string;
  action: Function;
  selectedMode: boolean;


  constructor(iconName: string, action: Function, selectedMode: boolean) {
    this.iconName = iconName;
    this.action = action;
    this.selectedMode = selectedMode;
  }
}