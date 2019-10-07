import { tournamentSchema } from "../models/tournament-model";
import { matchSchema } from "../models/match-model";
import * as mongoose from 'mongoose';
import { groupSchema } from "../models/group-model";
import { CourtSchema } from "../models/court-model";

const Match = mongoose.model('Match', matchSchema);
const Group = mongoose.model('Group', groupSchema)
const Tournament = mongoose.model('Tournament', tournamentSchema);
const Court = mongoose.model('Court', CourtSchema)

export class Schedules {
  tournamentId: string;
  totalCourts: number;
  courts: any;
  hoursPerDay: number;
  days: string[] = [];
  matchesPerDay: number;
  allPosibleMatches: number;
  matchesCreated: any = [];
  maxGroup: any;
  asiggnedMatches: any;

  constructor(tournamenId: string) {
    this.tournamentId = tournamenId;
  }
  /**
    * getTournamentInfo
    * Get info of the current tournament
    */
  public async getTournamentInfo() {
    let tournament = await Tournament.find({ '_id': this.tournamentId });
    let diffDays = 0;
    let allDays: string[] = [];
    this.totalCourts = tournament[0].courts;
    this.hoursPerDay = tournament[0].hoursPerDay;

    diffDays = tournament[0].EndDate.getDate() - tournament[0].starDate.getDate();
    for (let i = 0; i <= diffDays; i++) {
      let dToSave = new Date();
      dToSave.setDate(tournament[0].starDate.getDate() + i)
      allDays.push(dToSave.toISOString());
    }
    this.days = allDays;
    let matches = await Match.find({ 'tournamentID': this.tournamentId });
    for (const match of matches) {
      let m = {
        id: match._id.toString(),
        historicId: 0,
        teamOne: match.teamOne,
        teamTwo: match.teamTwo, 
        courtId: null
      }
      this.matchesCreated.push(m)
    }
    this.courts = await Court.find({}).sort({ 'availability': -1 });
    this.maxGroup = await Group.aggregate([
      { $unwind: "$teamID" },
      { $group: { _id: "$_id", teamNumber: { $sum: 1 } } },
      { $sort: { len: -1 } }
      // { $limit: 1 }
    ]);

    // this.distributeMatches();
  }

  private async distributeMatches() {
    let matchTime = 1;
    let posibleMatches: number;
    this.matchesPerDay = (this.hoursPerDay / matchTime) * (this.totalCourts);
    this.allPosibleMatches = this.matchesPerDay * this.days.length;

    //Refactor
    posibleMatches = this.matchesCreated.length + 16;
    if (this.matchesCreated.length && posibleMatches < this.allPosibleMatches) {
      console.log('there are time for 8th', posibleMatches);
    } else {
      posibleMatches = this.matchesCreated.length + 8;
      if (this.matchesCreated.length && posibleMatches < this.allPosibleMatches) {
        console.log('There are  time for 4th', posibleMatches);
      } else {
        posibleMatches = this.matchesCreated.length + 4;
        if (this.matchesCreated.length && posibleMatches < this.allPosibleMatches) {
          console.log('There are  time for semis', posibleMatches);
        } else {
          console.log('There are not time', posibleMatches);
        }
      }
    }
    console.log('matches per day ', this.matchesPerDay);
    console.log('All pasible matches ', this.allPosibleMatches);
    console.log('matches created', this.matchesCreated.length);

  }
  /**
   * schedulefill
   * Will fill all the schedule according the four rules method
   */
  public async scheduleInit() {

    await this.getTournamentInfo();
    let days = this.scheduler();// this.scheduler();
    this.matchUpdate();
    this.printSchedule(days);
  }
  /**
   * createDays
   * @Description Vreate objec day it has the schedule per day 
   * @returns days object
   */
  private createDays(): any {
    let days = [];
    for (let i = 0; i < this.days.length; i++) {
      let day = [];
      for (const court of this.courts) {
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
    return days;
  }

  /**
 * scheduler
 * @Description Create the schedule
 * @returns days if the schedule is good, null if not
 */
  private scheduler() {
    let days = this.createDays();
    let matchToEvaluate = {
      id: '',
      historicId: 0
    };
    let historyIdSuccess = 0;
    for (const [d, courts] of days.entries()) { //days
      for (const [c, court] of courts.entries()) { // courts
        for (const [h, hour] of court.hours.entries()) { // hours 
          matchToEvaluate = this.searchMatchFirstAvailable();
          while (matchToEvaluate) {
            if (this.ruleOne(courts, matchToEvaluate, h, c) && this.ruleTwo(courts, matchToEvaluate) &&
              this.ruleThree(courts, matchToEvaluate, h)) {
              hour.matchId = matchToEvaluate.id;
              matchToEvaluate.historicId = ++historyIdSuccess;
              this.updateHistoryId(matchToEvaluate, courts[c].id,  hour.hours, d);
              this.searchForPending();
              matchToEvaluate = this.searchMatchFirstAvailable();
              break;
            } else {
              matchToEvaluate.historicId = -1;
              this.updateHistoryId(matchToEvaluate, null, null, null);
              matchToEvaluate = this.searchMatchFirstAvailable();
              //console.log('Fail ==> ', this.matchesCreated);
            }
          }
          if (!matchToEvaluate && this.searchPendingMatches()) {
            this.searchForPending();
            continue;
          } else if (!matchToEvaluate) {
            return days;
          }
        }
      }
    }

  }
  /**
   * @name searchMatchFirstAvailable
   * @description this method look for the firts match avaiblable
   * @returns the first match avaiblable
   */
  private searchMatchFirstAvailable() {
    for (const match of this.matchesCreated) {
      if (match.historicId === 0) {
        return match;
      }
    }
    return null;
  }

  /**
* @name searchPendingMatches
* @description this method look for the matches who are pending
* @returns true if there are any match pending, if not false
*/
  private searchPendingMatches(): boolean {
    for (const match of this.matchesCreated) {
      if (match.historicId === -1) {
        return true;
      }
    }
    return false;
  }
  /**
  * @name updateHistoryId
  * @description this method update the history id, depending of it is valid or isn't it
  */
  private updateHistoryId(m, courtId, hour, day) {
    for (const match of this.matchesCreated) {
      if (match.id === m.id) {
        match.historicId = m.historicId
        match.courtId = courtId, 
        match.hour = hour,
        match.day = day
      }
    }
  }
  /**
   * @name searchForPending
   * @description this method makes available all the pendings matches
   * @returns the first match avaiblable
   */
  private searchForPending() {
    for (const match of this.matchesCreated) {
      if (match.historicId === -1) {
        match.historicId = 0
      }
    }
  }

  /**
   * @name ruleOne
   * @description This rule verify that the matches are in the same time
   * @param courts 
   * @param gMatch 
   * @param hour 
   * @param court 
   * @returns true if the rule is done or false if not
   */
  private ruleOne(courts, gMatch, hour, court): boolean {

    for (let i = 0; i < courts.length; i++) {
      if (!courts[i].hours[hour]) {
        continue;
      } else if (i !== court) {
        let teamsMatch = this.getTeamsFromMatch(courts[i].hours[hour].matchId);
        if (gMatch.teamOne === teamsMatch[0] || gMatch.teamTwo === teamsMatch[0]
          || gMatch.teamOne === teamsMatch[1] || gMatch.teamTwo === teamsMatch[1]) {
          return false;
        }
      }
    }
    return true;

  }
  /**
   * @name ruleTwo
   * @param hours 
   * @param gMatch 
   * @param hour 
   * @returns true if the rule is done or false if not
   * @description Validate one team can not play more than four times in a day. 
   */
  private ruleTwo(courts, gMatch): boolean {
    let teamOne = 0, teamTwo = 0;
    for (let j = 0; j < courts.length; j++) {
      for (let i = 0; i < courts[j].hours.length; i++) {
        if (!courts[j].hours[i].matchId) {
          continue;
        } else {
          let teamsMatch = this.getTeamsFromMatch(courts[j].hours[i].matchId);
          if (gMatch.teamOne === teamsMatch[0] || gMatch.teamOne === teamsMatch[1]) {
            teamOne++;
          }
          if (gMatch.teamTwo === teamsMatch[0] || gMatch.teamTwo === teamsMatch[1]) {
            teamTwo++;
          }
        }
      }
    }
    if (teamOne >= 4 || teamTwo >= 4) {
      return false;
    }
    return true;
  }

  /**
   * @name ruleThree
   * @param hours 
   * @param gMatch 
   * @param hour 
   * @returns true if the rule is done or false if not
   * @description Validate one team can not play more than four times in a day. 
   */
  private ruleThree(courts, gMatch, y): boolean {
    let teamOne = true, teamTwo = true;
    let times = 2;
    teamOne = this.countTimesDown(courts, gMatch.teamOne, y, y + times, true) &&
              (y - times < 0) ? true: this.countTimesUp(courts, gMatch.teamOne, y, y - times, true);
    teamTwo = this.countTimesDown(courts, gMatch.teamTwo, y, y + times, true) &&
              (y - times < 0) ? true: this.countTimesUp(courts, gMatch.teamTwo, y, y - times, true);
    if (teamOne && teamTwo) {
      return true;
    }
    return false;
  }

  private countTimesDown(courts, teamId, h, times, aux) {

    if (h < times) { 
      courts.forEach(court => {
        if (court.hours[h + 1] && court.hours[h + 1].matchId != '') {
          let teamsMatch = this.getTeamsFromMatch(court.hours[h + 1].matchId);
          if (teamId === teamsMatch[0] || teamId === teamsMatch[1]) {
            aux = this.countTimesDown(courts, teamId, h + 1, times, aux);
          }
        }
      });
    }else{
      return false;
    }
    return aux;
  }

  private countTimesUp(courts, teamId, h, times, aux) {

    if (times < h) { 
      courts.forEach(court => {
        if (court.hours[h - 1] && court.hours[h - 1].matchId && court.hours[h - 1].matchId != '') {
          let teamsMatch = this.getTeamsFromMatch(court.hours[h - 1].matchId);
          if (teamId === teamsMatch[0] || teamId === teamsMatch[1]) {
            aux = this.countTimesUp(courts, teamId, h - 1, times, aux);
          }
        }
      });
    }else{
      return false;
    }
    return aux;
  }

  /**
   * @name getTeamsFromMatch
   * @description Get the teams from a match
   * @param matchId 
   * @returns teams
   */
  private getTeamsFromMatch(matchId): any[] {
    let teams = [];
    if (!matchId) {
      return teams;
    }
    for (const match of this.matchesCreated) {
      if (match.id === matchId) {
        teams.push(match.teamOne);
        teams.push(match.teamTwo);
      }
    }
    return teams;
  }
  /**
   * matchUpdate
   * @param match 
   * @param hour eg. "10:00"
   * @param day number
   * @param courtid
   * @description it should update the match with its time and court
   */
  private async matchUpdate() {
    let matchToUpdate = {
      _id: null,
      dateMatch: null,
      court: null
    };
    this.matchesCreated.forEach(async m => {
      let dateMatch = new Date(Date.parse(this.days[m.day]));
      dateMatch.setHours(parseInt(m.hour));
      dateMatch.setMinutes(0);
      dateMatch.setSeconds(0)
      matchToUpdate.dateMatch = dateMatch;
      matchToUpdate._id = m.id;
      matchToUpdate.court = m.courtId;
      await Match.findOneAndUpdate({ _id: matchToUpdate._id }, matchToUpdate, { new: true });
    });
  }

  private printSchedule(days) {

    console.log(this.matchesCreated);

  }

}