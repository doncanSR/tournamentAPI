import * as mongoose from 'mongoose';
import { teamSchema } from "../models/team-model";
import { faseSchema } from "../models/fase/fase-model";
import { matchSchema } from "../models/match-model";

const FaseSchema = mongoose.model('FaseSchema', faseSchema);
const Match = mongoose.model('Match', matchSchema);
const Team = mongoose.model('Team', teamSchema);

export class Finals {
  areTime: boolean;
  tournamentId: string;
  constructor(areTime: boolean, tournamentId: string) {
    this.areTime = areTime;
    this.tournamentId = tournamentId;
  }

  public areThereTime(): void {
    if (this.areTime) {
      this.createEighth();
    } else {
      this.createQuarter();
    }
  }

  private async createEighth() {
    let object = { teamId: '', tournamentID: this.tournamentId, catFaseId: '5cb802fc3259cd048a783696' };
    let finalistTeams;
    // this.finalistTeams = await Team.find({ 'tournamentID': this.tournamentId }, '_id');
    finalistTeams = ['team1', 'team2', 'team3', 'team4', 'team5', 'team6', 'team7', 'team8', 'team9', 'team10', 'team11', 'team12', 'team13', 'team14', 'team15', 'team16'];
    object.teamId = finalistTeams;
    let newFase = new FaseSchema(object);
    let faseCreated = await newFase.save();
    let objectMatch = { teamOne: '', teamTwo: '', tournamentID: this.tournamentId, faseID: '' };
    let last = finalistTeams.length;
    objectMatch.faseID = faseCreated._id.toString();
    for (let i = 0; i < (last / 2); i++) {
      objectMatch.teamOne = finalistTeams[i];
      objectMatch.teamTwo = finalistTeams[last - (i + 1)];
      let newMatch = new Match(objectMatch);
      await newMatch.save();

    }
  }

  private async createQuarter() {
    let objectMatchEven = { teamOne: '', teamTwo: '', tournamentID: this.tournamentId, faseID: '' };
    let objectMatchOdd = { teamOne: '', teamTwo: '', tournamentID: this.tournamentId, faseID: '' };
    let objectFase = { teamId: [], tournamentID: this.tournamentId, catFaseId: '5bd4c46815bf9f0badb531e7' };
    let finalistTeams;
    let even: string[] = [];
    let odd: string[] = [];
    finalistTeams = await Match.find({ 'faseID': '5cb821b9662e921b9b83c073' });
    for (let i = 0; i < finalistTeams.length; i++) {
      if (((finalistTeams.length - i) % 2) === 0) {

        if (finalistTeams[i].setsTeamOne > finalistTeams[i].setsTeamOne) {
          even.push(finalistTeams[i].teamOne);
        } else {
          even.push(finalistTeams[i].teamTwo);

        }

      } else {
        if (finalistTeams[i].setsTeamOne > finalistTeams[i].setsTeamOne) {
          odd.push(finalistTeams[i].teamOne);
        } else {
          odd.push(finalistTeams[i].teamTwo);
        }
      }
    }
    objectFase.teamId = even;
    objectFase.teamId = objectFase.teamId.concat(odd);
    let newFase = new FaseSchema(objectFase);
    let faseCreated = await newFase.save();
    objectMatchEven.faseID = faseCreated._id.toString();
    objectMatchOdd.faseID = faseCreated._id.toString();
    for (let k = 0; k <= 1; k++) {
      objectMatchEven.teamOne = even[k];
      objectMatchEven.teamTwo = even[k + 1];
      if (k === 1) {
        objectMatchEven.teamOne = even[k + 1];
        objectMatchEven.teamTwo = even[k + 2];
      }
      let newMatch = new Match(objectMatchEven);
      await newMatch.save();
    }
    for (let k = 0; k <= 1; k++) {
      objectMatchOdd.teamOne = odd[k];
      objectMatchOdd.teamTwo = odd[k + 1];
      if (k === 1) {
        objectMatchOdd.teamOne = odd[k + 1];
        objectMatchOdd.teamTwo = odd[k + 2];
      }
      let newMatch = new Match(objectMatchOdd);
      await newMatch.save();
    }
  }

}