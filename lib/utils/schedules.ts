import { tournmanetSchema } from "../models/tournament-model";
import { matchSchema } from "../models/match-model";
import * as mongoose from 'mongoose';
import { groupSchema } from "../models/group-model";
import { CourtSchema } from "../models/court-model";

const Match = mongoose.model('Match', matchSchema);
const Group = mongoose.model('Group', groupSchema)
const Tournament = mongoose.model('Tournament', tournmanetSchema);
const Court = mongoose.model('Court', CourtSchema)

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
  /**
    * getTournamentInfo
    * Get info of the current tournament
    */
  public async getTournamentInfo() {
    let tournament = await Tournament.find({ '_id': this.tournamentId });
    this.courts = tournament[0].courts;
    this.hoursPerDay = tournament[0].hoursPerDay;
    this.days = (tournament[0].EndDate.getDate() - tournament[0].starDate.getDate() + 1);
    // this.distributeMatches();
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
      if (matchesCreated && posibleMatches < this.allPosibleMatches) {
        console.log('There are  time for 4th', posibleMatches);
      } else {
        posibleMatches = matchesCreated + 4;
        if (matchesCreated && posibleMatches < this.allPosibleMatches) {
          console.log('There are  time for semis', posibleMatches);
        } else {
          console.log('There are not time', posibleMatches);
        }
      }
    }
    console.log('matches per day ', this.matchesPerDay);
    console.log('All pasible matches ', this.allPosibleMatches);
    console.log('matches created', matchesCreated);

  }
  /**
   * schedulefill
   * Will fill all the schedule according the four rules method
   */
  public async scheduleInit() {


    let groups = [];
    let days = [];
    let courts = await Court.find({}).sort({ 'availability': -1 });
    let maxGroup = await Group.aggregate([
      { $unwind: "$teamID" },
      { $group: { _id: "$_id", teamNumber: { $sum: 1 } } },
      { $sort: { len: -1 } }
      // { $limit: 1 }
    ]);
    await this.getTournamentInfo();
    for (let i = 0; i < this.days; i++) {
      let day = [];
      for (const court of courts) {
        let ct = {
          id: court._id.toString(),
          hours: []
        };
        for (const dayHour of court.dayHours) {
          let dh = {
            hours: dayHour,
            matchId: ''
          }
          ct.hours.push(dh);
        }
        day.push(ct);
      }
      days.push(day);
    }

    for (const group of maxGroup) {
      let matches = await Match.find({ 'groupName': group._id.toString() });
      let gp = {
        id: group._id.toString(),
        matches: matches
      };
      groups.push(gp);
    }

    this.scheduleFill(groups, days);

  }
  /**
   * scheduleFill
   * @param groups
   * @param days
   * @returns done:string
   */
  private scheduleFill(groups, days) {
    for (let i = 0; i < days.length; i++) {
      for (let j = 0; j < days[i].length; j++) {
        for (let k = 0; k < days[i][j].hours.length; k++) {
          for (let l = 0; l < groups.length; l++) {
            for (let m = 0; m < groups[l].matches.length; m++) {
              console.log('groupsm ===> ',groups[l].matches[m]);
              console.log('hora ===> ',days[i][j].hours[k]);
              this.matchUpdate(groups[l].matches[m], days[i][j].hours);
            }            
          }
          
        }        
      }      
    }
  }
  /**
   * fourRules
   * @param match
   * @param hour
   * @description it helps to know if the match culd be scheduled Accourding the four rules,
   * and it will return a bolean when all the rules are valid.
   * Validate with hour or idMatch 
   * @returns boolean primise
   * 
   */
  public async fourRules(match: any, hour): Promise<boolean> {
    let ruleOne = true;
    let ruleTwo = true;
    let ruleThree = true;
    let ruleFour = true;
    let moreThanThreeTimes = 0;

    let matchToEvaluate = await Match.find(
      {
        groupName: match.groupName,
        teamOne: match.teamOne
      });
    // rule one, a team can not play at the same time
    matchToEvaluate.forEach(m => {

      if (m.dateMatch === match.dateMatch && m.teamTwo === match.teamTwo) {
        ruleOne = false;
      }
      //rule two, a team can not wait more than 3 hrs.
      let subs = -1 * (m.dateMatch.getHours() - match.dateMatch.getHours());
      if (subs >= 3) {
        ruleTwo = false;
      }
      //rule three check distance and time to move
      //rule four one team can not play three time in a day.
      if (m.dateMatch === match.dateMatch) {
        moreThanThreeTimes++;
      }
      if (moreThanThreeTimes >= 3) {
        ruleFour = false;
      }
    });
    return (ruleOne && ruleTwo && ruleThree && ruleFour);
  }
  /**
   * matchUpdate
   * @param match 
   * @param hour
   * @description it should update the match with its time and court
   */
  private async matchUpdate(match, hour) {
    if (this.fourRules(match,hour)) {
      Match.findOneAndUpdate({ _id: match.id }, match, { upsert: true, new: true });
    } else {
      return;
    }
  }

}