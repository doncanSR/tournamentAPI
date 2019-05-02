import { tournmanetSchema } from "../models/tournament-model";
import { matchSchema } from "../models/match-model";
import * as mongoose from 'mongoose';

const Match = mongoose.model('Match', matchSchema);

const Tournament = mongoose.model('Tournament', tournmanetSchema);

export class Schedules {
  tournamentId: string;
  courts: number;
  hoursPerDay: number;
  days: number;
  matchesPerDay: number;
  allPosibleMatches: number;

  constructor(tournamenId: string) {
    this.tournamentId = tournamenId;
  }

  public async getTournamentInfo() {
    let tournament = await Tournament.find({ '_id': this.tournamentId });
    this.courts = tournament[0].courts;
    this.hoursPerDay = tournament[0].hoursPerDay;
    this.days = (tournament[0].EndDate.getDate() - tournament[0].starDate.getDate() + 1);
    this.distributeMatches();
  }

  private async distributeMatches() {
    let matchTime = 1;
    let posibleMatches: number;
    this.matchesPerDay = (this.hoursPerDay / matchTime) * (this.courts);
    this.allPosibleMatches = this.matchesPerDay * this.days;
    let matchesCreated = await Match.countDocuments({ 'tournamentID': this.tournamentId });

    //Refactor
    posibleMatches = matchesCreated + 16;
    if (matchesCreated && posibleMatches < this.allPosibleMatches) {
      console.log('there are time for 8th', posibleMatches);
    } else {
      posibleMatches = matchesCreated + 8;
      if (matchesCreated && posibleMatches < this.allPosibleMatches){
        console.log('There are  time for 4th', posibleMatches);
      }else{
        posibleMatches = matchesCreated + 4;
        if (matchesCreated && posibleMatches < this.allPosibleMatches) {
          console.log('There are  time for semis', posibleMatches);
        }else{
          console.log('There are not time', posibleMatches);
        }
      }
    }
    console.log('matches per day ', this.matchesPerDay);
    console.log('All pasible matches ', this.allPosibleMatches);
    console.log('matches created', matchesCreated);

  }
}