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

  public combine() {
    let buffer: string = this.teams[this.teams.length - 1];
    for (let i = this.teams.length - 1; i > 1; i--) {
      this.teams[i] = this.teams[i - 1];
    }
    this.teams[1] = buffer;
  }

  public async addMatch() {
    let object = {
      teamOne: '',
      teamTwo: ''
    };
    for (let i = 0, j = this.teams.length - 1; i < j; i++ , j--) {
      console.log(this.teams[i] + " vs " + this.teams[j]);
      object.teamOne = this.teams[i];
      object.teamTwo = this.teams[j];
      await this.saveMatch(object);
    }
  }
  /**
   * init
   */
  public init() {
    this.rounds = (this.teams.length - 1);
    for (let i = 0; i < this.rounds; i++) {
      this.addMatch();
      this.combine();
      console.log('Round number = ', i + 1);
      console.log('*************************************');
    }
  }

  private async saveMatch(object: any) {
    object.tournamentID = this.tournmanetID;
    let newMatch = new Match(object);
    await newMatch.save();
  }

}