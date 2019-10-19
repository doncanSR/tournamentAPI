import { FinalSchedule} from "./interfaces/finalSchedule-interface";
import { tournamentSchema } from "../models/tournament-model";
import { matchSchema } from "../models/match-model";
import * as mongoose from 'mongoose';
import { faseSchema } from "../models/fase/fase-model";

const FaseSchema = mongoose.model('FaseSchema', faseSchema);
const Match = mongoose.model('Match', matchSchema);
const Tournament = mongoose.model('Tournament', tournamentSchema);

export class Keys {
  tournamentId: string;
  courts: number;
  hoursPerDay: number;
  days: number;
  matchesPerDay: number;
  allPosibleMatches: number;
  matchesCreated: number;
  matchTime: number;
  tournament: any;
  matchesPerCourts: number;

  constructor(tournamenId: string) {
    this.tournamentId = tournamenId;
    this.matchTime = 1;

  }

  public async getTournamentInfo() {
    this.tournament = await Tournament.find({ '_id': this.tournamentId });
    this.courts = this.tournament[0].courts;
    this.hoursPerDay = this.tournament[0].hoursPerDay;
    this.days = (this.tournament[0].EndDate.getDate() - this.tournament[0].starDate.getDate() + 1);
    this.distributeMatches();
  }

  private async distributeMatches() {
    let posibleMatches: number;
    this.matchesPerDay = (this.hoursPerDay / this.matchTime) * (this.courts);
    this.allPosibleMatches = this.matchesPerDay * this.days;
    this.matchesCreated = await Match.countDocuments({ 'tournamentID': this.tournamentId });


    //Refactor
    posibleMatches = this.matchesCreated + 16;
    if (this.matchesCreated && posibleMatches < this.allPosibleMatches) {
      console.log('There are time for 8th', posibleMatches);
      this.createKeys('eighth');
    } else {
      posibleMatches = this.matchesCreated + 8;
      if (this.matchesCreated && posibleMatches < this.allPosibleMatches){
        console.log('There are  time for 4th', posibleMatches);
        this.createKeys('quarters');
      }else{
        posibleMatches = this.matchesCreated + 4;
        if (this.matchesCreated && posibleMatches < this.allPosibleMatches) {
          console.log('There are  time for semis', posibleMatches);
          this.createKeys('semifinal')
        }else{
          console.log('There are not time', posibleMatches);
        }
      }
    }
    this.matchesPerCourts = this.matchesCreated / (this.days * this.courts);
    console.log('matches per day ', this.matchesPerDay);
    console.log('All pasible matches ', this.allPosibleMatches);
    console.log('matches created', this.matchesCreated);
  }
  
  private async createKeys(round: string) {
    let catFaseId;
    let finalistTeams: string[];
    switch (round) {
      case 'eighth':
        catFaseId = '5ccbcf0c07863277340026f9';
        finalistTeams = this.createList(16);
        await this.createFaseMatch(finalistTeams, catFaseId); 
      
      case 'quarters':
        catFaseId = '5ccbcf0c07863277340026fa';
        finalistTeams = this.createList(8);
        await this.createFaseMatch(finalistTeams, catFaseId); 

      case 'semifinal':
        catFaseId = '5ccbcf0c07863277340026fb';
        finalistTeams = this.createList(4);      
        await this.createFaseMatch(finalistTeams, catFaseId); 
      
      case 'final':
        catFaseId = '5ccbcf0c07863277340026fc';
        await this.createFaseMatch(finalistTeams, catFaseId); 
      break;

      default:
        break;
    }
    //this.assignSchedules();
  }

  private createList(teams: number){
    //Create teams
    let listTeam = [];
    for (let i = 0; i < teams; i++)
      listTeam.push('team' + i);
    return listTeam;
  }

  private async createFaseMatch(finalistTeams, catFaseId){
    //Create fase and matches
    let object = { teamId: finalistTeams, tournamentID: this.tournamentId, catFaseId: catFaseId };
    let newFase = new FaseSchema(object);
    //let faseCreated = await newFase.save();
    let objectMatch = { teamOne: '', teamTwo: '', tournamentID: this.tournamentId, faseID: 'faseCreated._id.toString()' };

    for (let i = 0; i < finalistTeams.length / 2; i++) {
      objectMatch.teamOne = finalistTeams[i];
      objectMatch.teamTwo = finalistTeams[finalistTeams.length - i - 1];
      let newMatch = new Match(objectMatch);
      //await newMatch.save();
      this.matchesCreated++;
      
    }
  }

}