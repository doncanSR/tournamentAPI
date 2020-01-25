import { matchSchema } from "../models/match-model";
import { model, ObjectId } from 'mongoose';
import * as constants from "../utils/tournamentConstants";

const Match = model('Match', matchSchema);

export class RoundRobin {
  teams: string[];
  groupId: Object;
  rounds: number;
  tournamentID: string;
  constructor(teams: string[], groupId: Object, tournamentID: string) {
    this.teams = teams;
    this.groupId = groupId;
    this.tournamentID = tournamentID;
  }


  private async addMatch() {
    let object = {
      faseId: constants.GROUP_FASE_ID,
      tournamentId: this.tournamentID,
      groupId: this.groupId
    };
    for (let i = 0; i < this.teams.length - 1; i++) {
        for(let j = i + 1; j < this.teams.length; j++){
          object['teamOne'] = this.teams[i];
          object['teamTwo'] = this.teams[j];
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
    object.tournamentId = this.tournamentID;
    let newMatch = new Match(object);
    await newMatch.save();
  }

}