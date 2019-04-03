import { ScheduleInterface } from "./interfaces/schedule-interface";
export class createSchedule implements ScheduleInterface {
  teams: number;
  groups: number;
  clasification: number;
  numberGroup: number;
  numberTeamGroup: number;
  excededGroups: number;
  completeGroups: number;
  correctTeams: number;

  constructor(teams: number) {
    this.teams = teams;
  }
  /**
   * buildSchedule
   */
  private buildSchedule(): void {
    if (this.teams < 6) {
      console.log('this should be used the round robbin method');

    }
    if (this.teams >= 6 && this.teams < 25) {
      this.createGroups();
      this.numberTeamPerGroup();
      this.nGroupsExceded();
      this.groupInitialValue();
    }
    if (this.teams >= 25) {
      this.createClasification();
      this.numberGroups();
      this.numberTeamPerGroup();
      this.nGroupsExceded();
      this.groupInitialValue();
    }

  }

  private createClasification(): void {
    this.clasification = Math.log2(this.teams);
    this.clasification = parseInt(this.clasification.toFixed(1));
    console.log('this is clasifications ----> ', this.clasification);
  }

  private createGroups(): void {
    this.groups = Math.log2(this.teams);
    this.groups = parseInt(this.groups.toFixed(1));
    console.log('this is group when there is not clasifications ----> ', this.groups);
  }

  private numberGroups(): void {
    this.numberGroup = (this.teams / this.clasification);
    this.numberGroup = parseInt(this.numberGroup.toFixed(1));
    console.log('This is the number of group ----> ', this.numberGroup);
  }

  private numberTeamPerGroup(): void {
    this.numberTeamGroup = (this.teams / this.numberGroup);
    this.excededGroups = (this.numberTeamGroup - Math.floor(this.numberTeamGroup));
    this.numberTeamGroup = parseInt(this.numberTeamGroup.toFixed(1));
    console.log('This is the teams per group ----> ', this.numberTeamGroup);
    console.log('This is the rest ----> ', this.excededGroups);
  }

  private nGroupsExceded(): void {
    this.excededGroups = parseInt((this.excededGroups * this.numberGroup).toFixed());
    console.log('This is the number of excedded grups: ', this.excededGroups);
  }

  private groupInitialValue(): void {
    this.completeGroups = (this.numberGroup - this.excededGroups);
    console.log('This is the number of groups with the initial team values: ', this.completeGroups);
    console.log('This is the number of groups with an extra team: ', this.excededGroups);
  }

  public verifyTeams(): boolean {
    let isCorrect: boolean;
    this.buildSchedule();
    this.correctTeams = (this.excededGroups * (this.numberTeamGroup + 1)) + (this.numberTeamGroup * this.completeGroups);
    isCorrect = (this.teams === this.correctTeams) ? true : false;
    return isCorrect;
  }

}