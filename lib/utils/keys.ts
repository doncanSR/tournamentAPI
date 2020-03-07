import { FinalSchedule} from "./interfaces/finalSchedule-interface";
import { tournamentSchema } from "../models/tournament-model";
import { matchSchema } from "../models/match-model";
import { model } from 'mongoose';
import { phaseSchema } from "../models/phase/phase-model";

const PhaseSchema = model('PhaseSchema', phaseSchema);
const Match = model('Match', matchSchema);
const Tournament = model('Tournament', tournamentSchema);

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
    this.tournament = await Tournament.findOne({ '_id': this.tournamentId });
    this.courts = this.tournament.courts;
    this.hoursPerDay = this.tournament.hoursPerDay;
    this.days = (this.tournament.endDate.getDate() - this.tournament.startDate.getDate() + 1);
    this.distributeMatches();
  }

  private async distributeMatches() {
    let posibleMatches: number;
    this.matchesPerDay = (this.hoursPerDay / this.matchTime) * (this.courts);
    this.allPosibleMatches = this.matchesPerDay * this.days;
    this.matchesCreated = await Match.countDocuments({ 'tournamentId': this.tournamentId });


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
    let catPhaseId;
    let finalistTeams: string[];
    switch (round) {
      case 'eighth':
        catPhaseId = '5ccbcf0c07863277340026f9';
        finalistTeams = this.createList(16);
        await this.createPhaseMatch(finalistTeams, catPhaseId); 
      
      case 'quarters':
        catPhaseId = '5ccbcf0c07863277340026fa';
        finalistTeams = this.createList(8);
        await this.createPhaseMatch(finalistTeams, catPhaseId); 

      case 'semifinal':
        catPhaseId = '5ccbcf0c07863277340026fb';
        finalistTeams = this.createList(4);      
        await this.createPhaseMatch(finalistTeams, catPhaseId); 
      
      case 'final':
        catPhaseId = '5ccbcf0c07863277340026fc';
        await this.createPhaseMatch(finalistTeams, catPhaseId); 
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

  private async createPhaseMatch(finalistTeams, catPhaseId){
    //Create phase and matches
    let object = { teamId: finalistTeams, tournamentId: this.tournamentId, catPhaseId: catPhaseId };
    let newPhase = new PhaseSchema(object);
    //let phaseCreated = await newPhase.save();
    let objectMatch = { teamOne: '', teamTwo: '', tournamentId: this.tournamentId, phaseId: 'phaseCreated._id' };

    for (let i = 0; i < finalistTeams.length / 2; i++) {
      objectMatch.teamOne = finalistTeams[i];
      objectMatch.teamTwo = finalistTeams[finalistTeams.length - i - 1];
      let newMatch = new Match(objectMatch);
      //await newMatch.save();
      this.matchesCreated++;
      
    }
  }

}