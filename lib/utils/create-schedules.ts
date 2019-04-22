import { ScheduleInterface } from "./interfaces/schedule-interface";
export class createSchedule implements ScheduleInterface {
  teams: number;
  groups: number;
  clasification: number;
  teamsPerGroup: number;
  excededGroups: number;
  completeGroups: number;
  correctTeams: number;
  totalClasifications:number;
  teamsPerGruopExc:number;
  tournamentId:string;

  constructor(teams: number, tournamentId:string) {
    this.teams = teams;
    this.tournamentId = tournamentId;
  }
  /**
   * buildSchedule
   */
  private buildSchedule(): void {
    if (this.teams < 6) {

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
      this.clasifications();
      this.numberTeamPerGroup();
      this.nGroupsExceded();
      this.groupInitialValue();
    }

  }

  private createClasification(): void {
    this.clasification = Math.log2(this.teams);
    this.clasification = parseInt(this.clasification.toFixed(1));
  }

  private createGroups(): void {
    this.groups = Math.log2(this.teams);
    this.groups = parseInt(this.groups.toFixed(1));
  }

  private numberGroups(): void {
    this.groups = (this.teams / this.clasification);
    this.groups = parseInt(this.groups.toFixed(1));
  }

  private numberTeamPerGroup(): void {
    this.teamsPerGroup = (this.teams / this.groups);
    this.excededGroups = (this.teamsPerGroup - Math.floor(this.teamsPerGroup));
    this.teamsPerGroup = parseInt(this.teamsPerGroup.toFixed(1));
  }

  private nGroupsExceded(): void {
    this.excededGroups = parseInt((this.excededGroups * this.groups).toFixed());
  }

  private groupInitialValue(): void {
    this.completeGroups = (this.groups - this.excededGroups);
    this.teamsPerGruopExc = (this.teamsPerGroup + 1);
    if (this.completeGroups != this.groups) {
      this.groups = this.completeGroups;
    }
  }

  private clasifications(): void {
    this.totalClasifications = (this.groups / this.clasification);
    this.totalClasifications = parseInt(this.totalClasifications.toFixed());
  }

  public verifyTeams(): boolean {
    let isCorrect: boolean;
    this.buildSchedule();
    this.correctTeams = (this.excededGroups * (this.teamsPerGroup + 1)) + (this.teamsPerGroup * this.completeGroups);
    isCorrect = (this.teams === this.correctTeams) ? true : false;
    return isCorrect;
  }

}