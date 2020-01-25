import { model, ObjectId } from 'mongoose';
import { teamSchema } from "../models/team-model";
import { faseSchema } from "../models/fase/fase-model";
import { matchSchema } from "../models/match-model";

const FaseSchema = model('FaseSchema', faseSchema);
const Match = model('Match', matchSchema);
const Team = model('Team', teamSchema);

export class Finals {
  areTime: boolean;
  tournamentId: Object;
  constructor(areTime: boolean, tournamentId: Object) {
    this.areTime = areTime;
    this.tournamentId = tournamentId;
  }

  public areThereTime(): void {
    if (this.areTime) {
      this.createEighth();
    } else {
      this.createFinals();
    }
  }

  private async createEighth() {
    let object = { teamId: '', tournamentId: this.tournamentId, catFaseId: new ObjectId('5cb802fc3259cd048a783696') };
    let finalistTeams;
    // this.finalistTeams = await Team.find({ 'tournamentId': this.tournamentId }, '_id');
    finalistTeams = ['team1', 'team2', 'team3', 'team4', 'team5', 'team6', 'team7', 'team8', 'team9', 'team10', 'team11', 'team12', 'team13', 'team14', 'team15', 'team16'];
    object.teamId = finalistTeams;
    let newFase = new FaseSchema(object);
    let faseCreated = await newFase.save();
    let objectMatch = { teamOne: '', teamTwo: '', tournamentId: this.tournamentId, faseId: '' };
    let last = finalistTeams.length;
    objectMatch.faseId = faseCreated._id;
    for (let i = 0; i < (last / 2); i++) {
      objectMatch.teamOne = finalistTeams[i];
      objectMatch.teamTwo = finalistTeams[last - (i + 1)];
      let newMatch = new Match(objectMatch);
      await newMatch.save();

    }
  }

  private async createQuarter() {
    let objectMatchEven = { teamOne: '', teamTwo: '', tournamentId: this.tournamentId, faseId: '' };
    let objectMatchOdd = { teamOne: '', teamTwo: '', tournamentId: this.tournamentId, faseId: '' };
    let objectFase = { teamId: [], tournamentId: this.tournamentId, catFaseId: '5bd4c46815bf9f0badb531e7' };
    let finalistTeams;
    let even: string[] = [];
    let odd: string[] = [];
    finalistTeams = await Match.find({ 'faseId': '5cb821b9662e921b9b83c073' });
    for (let i = 0; i < finalistTeams.length; i++) {
      if (((finalistTeams.length - i) % 2) === 0) {

        if (finalistTeams[i].setsTeamOne > finalistTeams[i].teamTwo) {
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
    objectMatchEven.faseId = faseCreated._id;
    objectMatchOdd.faseId = faseCreated._id;
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

  private async createSemis() {
    let finalistTeams;
    let semifinalist: string[] = [];

    finalistTeams = await Match.find({ 'faseId': '5cb8f1af7512b120e13b3ac9' });
    for (let i = 0; i < finalistTeams.length; i++) {

      if (finalistTeams[i].setsTeamOne > finalistTeams[i].teamTwo) {
        semifinalist.push(finalistTeams[i].teamOne);
      } else {
        semifinalist.push(finalistTeams[i].teamTwo);

      }
    }
    let objectMatch = { teamOne: '', teamTwo: '', tournamentId: this.tournamentId, faseId: '' }
    let objectFase = { teamId: semifinalist, tournamentId: this.tournamentId, catFaseId: '5bd4c46815bf9f0badb531e9' }
    let newFase = new FaseSchema(objectFase);
    let faseCreated = await newFase.save();
    objectMatch.faseId = faseCreated._id;
    for (let k = 0; k <= 1; k++) {
      objectMatch.teamOne = semifinalist[k];
      objectMatch.teamTwo = semifinalist[k + 1];
      if (k === 1) {
        objectMatch.teamOne = semifinalist[k + 1];
        objectMatch.teamTwo = semifinalist[k + 2];
      }

      let newMatch = new Match(objectMatch);
      await newMatch.save();
    }
  }

  private async createFinals() {
    let finalistTeams;
    let finalTeams: string[] = [];
    let losersTeam: string[] = [];
    finalistTeams = await Match.find({ 'faseId': '5cbcf12ff5525a0a74a74e38' });
    for (let i = 0; i < finalistTeams.length; i++) {
      if (finalistTeams[i].setsTeamOne > finalistTeams[i].setsTeamTwo) {
        finalTeams.push(finalistTeams[i].teamOne);
        losersTeam.push(finalistTeams[i].teamTwo)
      }
      if (finalistTeams[i].setsTeamTwo > finalistTeams[i].setsTeamOne) {
        finalTeams.push(finalistTeams[i].teamTwo);
        losersTeam.push(finalistTeams[i].teamOne);
      }
    }
    console.log('This is the winner teams ', finalTeams);
    console.log('This is the loser teams ', losersTeam);
    let objectMatch = { teamOne: '', teamTwo: '', tournamentId: this.tournamentId, faseId: '' };
    let objectMatchThird = { teamOne: '', teamTwo: '', tournamentId: this.tournamentId, faseId: '' };
    let objectFase = { teamId: finalTeams, tournamentId: this.tournamentId, catFaseId: '5bd4c48715bf9f0badb531ea' };
    let objectFaseTwo = { teamId: losersTeam, tournamentId: this.tournamentId, catFaseId: '5bd4c49015bf9f0badb531eb' };
    let newFase = new FaseSchema(objectFase);
    let champion = await newFase.save();
    let newFaseTwo = new FaseSchema(objectFaseTwo);
    let faseThird = await newFaseTwo.save();

    objectMatch.faseId = champion._id;
    objectMatchThird.faseId = faseThird._id;
    objectMatch.teamOne = finalTeams[0];
    objectMatch.teamTwo = finalTeams[1];
    objectMatchThird.teamOne = losersTeam[0];
    objectMatchThird.teamTwo = losersTeam[1];

    let newMatchFinal = new Match(objectMatch);
    await newMatchFinal.save();

    let newMatchThird = new Match(objectMatchThird);
    await newMatchThird.save();
  }

}