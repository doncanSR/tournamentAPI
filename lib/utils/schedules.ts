import { tournamentSchema } from "../models/tournament-model";
import { matchSchema } from "../models/match-model";
import { model, Types } from 'mongoose';
import { groupSchema } from "../models/group-model";
import { courtSchema } from "../models/court-model";
import { phaseSchema } from "../models/phase/phase-model";
import * as constants from "../utils/tournamentConstants";
import { tournamentRoutes } from "routes/tournament-routes";


const Match = model('Match', matchSchema);
const PhaseSchema = model('PhaseSchema', phaseSchema);
const Group = model('Group', groupSchema);
const Tournament = model('Tournament', tournamentSchema);
const Court = model('Court', courtSchema);

export class Schedules {
  tournamentId: Object;
  totalCourts: number;
  courts: any;
  hoursPerDay: number;
  days: string[] = [];
  matchesPerDay: number;
  matchTime: number;
  allPosibleMatches: number;
  matchesCreated: any = [];
  maxGroup: any;
  asiggnedMatches: any;
  matchesUpdated = 0;
  numberOfPhases: number;


  constructor(tournamenId: Object) {
    this.tournamentId = tournamenId;
  }
  /**
   * @name getTournamentInfo
   * @description Get the info of the current tournament
   */
  public async getTournamentInfo() {
    let tournament = await Tournament.findOne({ '_id': this.tournamentId });
    let diffDays = 0;
    let allDays: string[] = [];
    this.totalCourts = tournament.courts;
    this.hoursPerDay = tournament.hoursPerDay;
    this.matchTime = tournament.matchTime;
    this.numberOfPhases = tournament.numberOfPhases;

    diffDays = tournament.endDate.getDate() - tournament.startDate.getDate();
    for (let i = 0; i <= diffDays; i++) {
      let dToSave = new Date();
      dToSave.setDate(tournament.startDate.getDate() + i)
      allDays.push(dToSave.toISOString());
    }
    this.days = allDays;
    let matches = await Match.find({ 'tournamentId': this.tournamentId });
    for (const match of matches) {
      let m = {
        id: match._id,
        historicId: 0,
        teamOne: match.teamOne,
        teamTwo: match.teamTwo, 
        courtId: null
      }
      this.matchesCreated.push(m)
    }
    this.matchesCreated = this.matchesCreated.sort(() => Math.random() - 0.5)
    this.courts = await Court.find({}).sort({ 'availability': -1 });
    this.maxGroup = await Group.aggregate([
      { $unwind: "$teamId" },
      { $group: { _id: "$_id", teamNumber: { $sum: 1 } } },
      { $sort: { len: -1 } }
      // { $limit: 1 }
    ]);

    // this.distributeMatches();
  }

    /**
   * @name distributeMatches
   * @description Verify if there are time to make the keys and were made depending the available time 
   * @returns return false if the matches can't be
   */

  private async distributeMatches(numberOfPhases: number) {

    //Get the values to do the keys
    let posibleMatches: number;
    this.matchesPerDay = (this.hoursPerDay / this.matchTime) * (this.courts);
    this.allPosibleMatches = this.matchesPerDay * this.days.length;
    this.matchesCreated = await Match.countDocuments({ 'tournamentId': this.tournamentId });
    return this.checkTime(numberOfPhases);

  }
   /**
   * @name matchesPerNumberPhases
   * @description calcute the total of matches that the teams need
   * @param phases
   */
  private matchesPerNumberPhases (phases){
    let matches = 0;
    for (let index = phases; index < 3; index--) {
      matches += Math.pow(2, index);
    }
    return matches;
  }
   /**
   * @name checkTime
   * @description check if the time is enough to complete the tournament
   * @param numberOfPhases
   */
  private checkTime(numberOfPhases){

    if (numberOfPhases < 3) {
      return false;
    }
    if((this.matchesCreated + this.matchesPerNumberPhases(numberOfPhases)) < this.allPosibleMatches){
      return this.createKeys(numberOfPhases, null);
    }else{
      return this.checkTime(numberOfPhases - 1);
    }
   
  }
  /**
   * @name createKeys
   * @description this method create the keys
   * @param round
   */
  public async createKeys(bestTeams:[], phases: number) {
    let catPhaseId;
    let finalistTeams: string[];
    switch (phases) {
      //Create phase of eighth with 32 teams which are not real
      case 5:
        catPhaseId = Types.ObjectId(constants.SIXTEENTHS_PHASE_ID);
        await this.createPhaseMatch(finalistTeams, catPhaseId);
      break;

      //Create phase of eighth with 16 teams which are not real
      case 4:
        catPhaseId = Types.ObjectId(constants.EIGHTHS_PHASE_ID);
        await this.createPhaseMatch(finalistTeams, catPhaseId);
      break;

      //Create phase of quartes with 8 teams wtich are not real      
      case 3:
        catPhaseId = Types.ObjectId(constants.QUARTERS_PHASE_ID);
        await this.createPhaseMatch(finalistTeams, catPhaseId);
      break;
  
      //Create phase of semifinal with 4 teams witch are not real
      case 2:
        catPhaseId = Types.ObjectId(constants.SEMIFINAL_PHASE_ID);
        await this.createPhaseMatch(finalistTeams, catPhaseId);
      break;

      //Create phase of final with 2 teams witch are not real
      case 1:
        catPhaseId = Types.ObjectId(constants.FINAL_PHASE_ID);
        await this.createPhaseMatch(finalistTeams, catPhaseId); 
      break;

      default:
        return false;
    }
  }

  /**
   * @name createPhaseMatch
   * @description this method create a fake list to make the matches
   * @param teams
   * @returns a list with the teams
   */
  public async createPhaseMatch(finalListTeams, catPhaseId){
    //Create phase and matches
    let object = { teamId: finalListTeams, tournamentId: this.tournamentId, catPhaseId: catPhaseId };
    let newPhase = new PhaseSchema(object);
    let phaseCreated = await newPhase.save();
    for (let i = 0; i < finalListTeams.length / 2; i++) {
      let dataMatch = this.getPossibleDataMatch();
      let objectMatch = {
        teamOne: finalListTeams[i],
        teamTwo: finalListTeams[finalListTeams.length - i - 1],
        dateMatch: dataMatch.date,
        court: dataMatch.court,
      }
      let newMatch = new Match(objectMatch);
      await newMatch.save();
    }
  }

    /**
   * getPossibleDataMatch
   * 
   */
  private getPossibleDataMatch() {


    return {date: 'oneday', court: 'onecourt'}

  }

  /**
   * schedulefill
   * Will fill all the schedule according the four rules method
   */
  public async scheduleInit() {

    await this.getTournamentInfo();
    let days = this.scheduler();
    this.matchUpdate();
    return true;
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
          id: court._id,
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
    let h = 0, c = 0;
    let longestCourt = this.getLongestCourt(days[0]);
    let matchToEvaluate = {
      id: '',
      historicId: 0
    };
    let historyIdSuccess = 0;
    for (const [d, courts] of days.entries()) { //days
      //for (const [h, hour] of court.hours.entries()) { // hours 
      while(courts[c] && h < longestCourt){
        //for (const [c, courts] of day.entries()) { // courtss
        while(courts[c]){
          if (!courts[c].hours[h]) {
            c++;
            continue;
          }    
          matchToEvaluate = this.searchMatchFirstAvailable();
          while (matchToEvaluate) {
            if (this.ruleOne(courts, matchToEvaluate, h, c) && this.ruleTwo(courts, matchToEvaluate) &&
              this.ruleThree(courts, matchToEvaluate, h)) {
              courts[c].hours[h].matchId = matchToEvaluate.id;
              matchToEvaluate.historicId = ++historyIdSuccess;
              this.updateHistoryId(matchToEvaluate, courts[c].id, courts[c].hours[h], d);
              this.searchForPending();
              matchToEvaluate = this.searchMatchFirstAvailable();
              c++;
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
            break;
          } else if (!matchToEvaluate) {
            return days;
          }
        }
        c=0;
        h++;
      }
      h = 0;
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
   * @name getLongestCourt
   * @description this method look for the longest court
   * @returns the size of the largest court
   */
  private getLongestCourt(courts) {
    let number = 0;
    courts.forEach(court => {
      if (number < court.hours.length ) {
        number = court.hours.length;
      }
    });
    return number;
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
   * @description This rule verify that the matches are not in the same time
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
      } else if (i !== court && courts[i].hours[hour].matchId) {
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
      dateMatch.setHours(parseInt(m.hour.hours));
      dateMatch.setMinutes(0);
      dateMatch.setSeconds(0)
      matchToUpdate.dateMatch = dateMatch;
      matchToUpdate._id = m.hour.matchId;
      matchToUpdate.court = m.courtId;
      let matcheUpaded = await Match.findByIdAndUpdate(matchToUpdate._id, matchToUpdate, { new: true });
      //console.log(matcheUpaded() + " " + ++ this.matchesUpdated);
      
    });
  }
}