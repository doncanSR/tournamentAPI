import { FinalSchedule} from "./interfaces/finalSchedule-interface";
import { tournamentSchema } from "../models/tournament-model";
import { matchSchema } from "../models/match-model";
import * as mongoose from 'mongoose';
import { faseSchema } from "../models/fase/fase-model";
import * as moment from 'moment';

const FaseSchema = mongoose.model('FaseSchema', faseSchema);
const Match = mongoose.model('Match', matchSchema);
const Tournament = mongoose.model('Tournament', tournamentSchema);

export class Schedules {
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
    this.assignSchedules();
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

  async assignSchedules(){
    let matches = await Match.find({ tournamentID: this.tournamentId },{ });
    let skeletonSchedule = await this.SkeletonSchedule();
    let auxMatches = 0;
    this.matchesCreated = 56;

    for (let i = 0; i < this.days; i++)
      for (let j = 0; j < this.courts; j++)
        for (let e = 0; e < this.matchesPerCourts; e++, auxMatches++){
          if(matches[auxMatches])
            await Match.findOneAndUpdate({ _id: matches[auxMatches]._id.toString() },{ 
            dateMatch: skeletonSchedule[i].name + ' ' + skeletonSchedule[i].courts[j].hours[e].start,
            court: skeletonSchedule[i].courts[j].name
            });
            console.log('match ' + auxMatches + ' --> ' + skeletonSchedule[i].courts[j].name + ' --> ' + skeletonSchedule[i].name + ' ' + skeletonSchedule[i].courts[j].hours[e].start);
            
          if(auxMatches >= this.allPosibleMatches || auxMatches >= this.matchesCreated)
            return console.log('insufficient time');
        }

    
  }

  private async SkeletonSchedule(){
    let hours = new Array();
    let days = new Array();
    let courts = new Array();
    let start = moment(this.tournament[0].starDate);
    let end = moment(this.tournament[0].endDate);

    for (let i = 0; i < this.matchesPerCourts; i++)
      hours.push({start: start.format('HH:mm'), end: start.add(this.matchTime,'h').format('HH:mm')});

    for (let i = 0; i < this.courts; i++)
      courts.push({name: 'Cancha: '+i, hours: hours});

    for (let i = 0; i < this.days; i++){
      days.push({name: start.format('YYYY-MM-DD'), courts: courts});
      start.add(1,'d')
    }
    console.log(days);
    
    return days;    

  }

}