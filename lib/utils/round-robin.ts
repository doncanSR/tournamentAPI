import { matchSchema } from "../models/match-model";
import * as mongoose from 'mongoose';

const Match = mongoose.model('Match', matchSchema);

export class RoundRobin {
  teams: string[];
  groupName: string;
  rounds: number;
  tournmanetID: string;
  constructor(teams: string[], groupName: string, tournmanetID: string) {
    this.teams = teams;
    this.groupName = groupName;
    this.tournmanetID = tournmanetID;
  }


  private async addMatch() {
    let object = {teamOne: '', teamTwo: ''};
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
    object.tournamentID = this.tournmanetID;
    let newMatch = new Match(object);
    await newMatch.save();
  }

}