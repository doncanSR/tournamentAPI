import { matchSchema } from "../models/match-model";
import * as mongoose from 'mongoose';

const Match = mongoose.model('Match', matchSchema);

export class RoundRobin {
  teams: string[];
  groupId: string;
  rounds: number;
  tournmanetID: string;
  constructor(teams: string[], groupId: string, tournmanetID: string) {
    this.teams = teams;
    this.groupId = groupId;
    this.tournmanetID = tournmanetID;
  }


  private async addMatch() {
    let object = {
      faseId: '',
      refereeId: '',
      setsTeamOne: '',
      setsTeamTwo: '',
      pointsTeamOne: '',
      pointsTeamTwo: '',
      dateMatch: '',
      teamOne: '',
      teamTwo: '',
      tournamentId: '',
      groupId: this.groupId
    };
    for (let i = 0; i < this.teams.length - 1; i++) {
        for(let j = i + 1; j < this.teams.length; j++){
          object.teamOne = this.teams[i];
          object.teamTwo = this.teams[j];
          await this.saveMatch(object);
        }
    }
  }
  /**
   * init
   */
  public async init() {
    this.rounds = (this.teams.length - 1);
    await this.addMatch();
    
  }

  private async saveMatch(object: any) {
    object.tournamentId = this.tournmanetID;
    let newMatch = new Match(object);
    await newMatch.save();
  }

}