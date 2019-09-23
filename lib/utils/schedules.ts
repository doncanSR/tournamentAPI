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
        teamTwo: match.teamTwo
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
    this.scheduler();

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
  private scheduler() {
    let days = this.createDays();
    let matchToEvaluate = {
      id: '',
      historicId: 0
    };
    let historyIdSuccess = 0;
    for (const courts of days) { //days
      for (const [c, court] of courts.entries()) { // courts
        for (const [h, hour] of court.hours.entries()) { // hours 
          matchToEvaluate = this.searchMatchFirstAvailable();
          while (matchToEvaluate) {
            if (this.ruleOne(courts, matchToEvaluate, h, c) && this.ruleTwo(courts, matchToEvaluate) &&
              this.ruleThree(courts, matchToEvaluate)) {
              hour.matchId = matchToEvaluate.id;
              matchToEvaluate.historicId = ++historyIdSuccess;
              this.updateHistoryId(matchToEvaluate);
              this.searchForPending();
              matchToEvaluate = this.searchMatchFirstAvailable();
              console.log('Success ==> ', this.matchesCreated);
              console.log('This is days ==> ', days);
              break;

            } else {
              matchToEvaluate.historicId = -1;
              this.updateHistoryId(matchToEvaluate);
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
  * @description this method update the history id, depending of it is valid isn't it
  */
  private updateHistoryId(m) {
    for (const match of this.matchesCreated) {
      if (match.id === m.id) {
        match.historicId = m.historicId
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
   * @returns scoreRuleOne
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
   * @description Validate one team can not play more than four times in a day. 
   */
  private ruleTwo(hours, gMatch): boolean {
    let teamOne = 0, teamTwo = 0;

    let teamsMatchToEvaluate = this.getTeamsFromMatch(gMatch);
    for (let i = 0; i < hours.length; i++) {
      if (!hours[i].matchId) {
        continue;
      } else {
        let teamsMatch = this.getTeamsFromMatch(hours[i].matchId);
        if (teamsMatchToEvaluate[0] === teamsMatch[0] || teamsMatchToEvaluate[0] === teamsMatch[1]) {
          teamOne++;
        }
        if (teamsMatchToEvaluate[1] === teamsMatch[0] || teamsMatchToEvaluate[1] === teamsMatch[1]) {
          teamTwo++;
        }
      }
    }
    if (teamOne >= 4 || teamTwo >= 4) {
      return false;
    }
    return true;
  }

  private countTimes(courts, teamId) {
    let court = 0;
    let counter = 0;
    while (court < courts.length) {
      courts[court].hours.forEach(hour => {
        if (hour && hour.matchId && hour.matchId !== "") {
          let teamsMatch = this.getTeamsFromMatch(hour.matchId);
          if (teamId === teamsMatch[0] || teamId === teamsMatch[1]) {
           counter++;
          }else{
            counter = 0;
          }
        }
      });
      console.log(counter)
      court++;
    }
    return counter;
  }
  private ruleThree(courts, gMatch) {
    let teamOne = 0, teamTwo = 0;

    teamOne = this.countTimes(courts, gMatch.teamOne);
    teamTwo = this.countTimes(courts, gMatch.teamTwo);

    if (teamOne >= 2 || teamTwo >= 2) {
      return false;
    }
    return true;
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
   * @param hour
   * @description it should update the match with its time and court
   */
  private async matchUpdate(match, hour, day, court) {
    let matchToUpdate = {
      id: match.id,
      dateMatch: null,
      court: null
    };
    let dateMatch = new Date(Date.parse(this.days[day]));
    dateMatch.setHours(parseInt(hour));
    dateMatch.setMinutes(0);
    dateMatch.setSeconds(0)
    // matchToUpdate.dateMatch = dateMatch;
    console.log('this is the match ==> ', matchToUpdate);
    await Match.findOneAndUpdate({ _id: matchToUpdate.id }, matchToUpdate, { new: true });
  }

}