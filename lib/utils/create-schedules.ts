
export class createSchedule {
  public teams: number;
  public groups: number;
  public clasification: number;
  public numberGroup: number;
  public numberTeamGroup: number;
  private excededGroups: number;
  private completeGroups: number;
  private correctTeams: number;


  constructor(teams: number) {
    this.teams = teams;
  }

  public createClasification(): void {
    this.clasification = Math.log2(this.teams);
    this.clasification = parseInt(this.clasification.toFixed(1));
    console.log('this is clasifications ----> ', this.clasification);
    this.clasification
  }

  public createGroups(): void {
    this.groups = Math.log2(this.teams);
    this.groups = parseInt(this.groups.toFixed(1));
    console.log('this is group when there is not clasifications ----> ', this.groups);
    this.groups
  }

  public numberGroups(): void {
    this.numberGroup = (this.teams / this.clasification);
    this.numberGroup = parseInt(this.numberGroup.toFixed(1));
    console.log('This is the number of group ----> ', this.numberGroup);
  }

  public numberTeamPerGroup(): void {
    this.numberTeamGroup = (this.teams / this.numberGroup);
    this.excededGroups = (this.numberTeamGroup - Math.floor(this.numberTeamGroup));
    this.numberTeamGroup = parseInt(this.numberTeamGroup.toFixed(1));
    console.log('This is the teams per group ----> ', this.numberTeamGroup);
    console.log('This is the rest ----> ', this.excededGroups);
  }

  public nGroupsExceded(): void {
    this.excededGroups = (this.excededGroups * this.numberGroup);
    console.log('This is the number of excedded grups: ', this.excededGroups);
  }

  public groupInitialValue(): void {
    this.completeGroups = (this.numberGroup - this.excededGroups);
    console.log('This is the number of groups with the initial team values: ', this.completeGroups);
    console.log('This is the number of groups with an extra team: ', this.excededGroups);
  }

  public verifyTeams(): boolean {
    let isCorrect: boolean;
    this.correctTeams = (this.excededGroups * (this.numberTeamGroup + 1)) + (this.numberTeamGroup * this.completeGroups);
    isCorrect = (this.teams === this.correctTeams) ? true : false;
    return isCorrect;
  }

}