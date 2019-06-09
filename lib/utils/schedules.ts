import { tournmanetSchema } from "../models/tournament-model";
import { matchSchema } from "../models/match-model";
import * as mongoose from 'mongoose';
import { groupSchema } from "../models/group-model";

const Match = mongoose.model('Match', matchSchema);
const Group = mongoose.model('Group', groupSchema)
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
  /**
    * getTournamentInfo
    * Get info of the current tournament
    */
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
  public async schedulefill() {
    let teamsPerGroup: number[] = [];
    let maxGroup = await Group.aggregate([
      { $unwind: "$teamID" },
      { $group: { _id: "$_id", teamNumber: { $sum: 1 } } },
      { $sort: { len: -1 } },
      { $limit: 1 }
    ]);
    teamsPerGroup.push(maxGroup[0].teamNumber)
    // let matches = Match.find({})
    let groups = await Group.find({ 'tournamentID': this.tournamentId });
    groups.forEach(group => {
      if (!teamsPerGroup.includes(group.teamID.length)) {
        teamsPerGroup.push(group.teamID.length)
      }
    });
    let groupWithMajorMatches = await Match.find({ groupName: maxGroup[0]._id.toString() });
    console.log('all the matches: ', groupWithMajorMatches);
    console.log('all the matches, for the group with more teams: ', groupWithMajorMatches.length / 2);

  }

  /**
   * fourRules
   * it helps to know if the match culd be scheduled
   * Accourding the four rules
   */
  public async fourRules(match: any): Promise<boolean> {
    let isCorrect = false;
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
      if (subs > 3) {
        ruleTwo = false;
      }
      //rule three check distance and time to move
      //rule four one team can not play three time in a day.
      if (m.dateMatch === match.dateMatch) {
        moreThanThreeTimes++;
      }
      if (moreThanThreeTimes > 3) {
        ruleFour = false;
      }
    });
    return isCorrect = (ruleOne && ruleTwo && ruleThree && ruleFour) ? true : false;
  }
}