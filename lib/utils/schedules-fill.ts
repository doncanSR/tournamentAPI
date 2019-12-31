import { ScheduleInterface } from "./interfaces/schedule-interface";
import { teamSchema } from "../models/team-model";
import { model } from 'mongoose';
import { groupSchema } from "../models/group-model";
import { clasificationSchema } from "../models/clasificatio.model";
import { RoundRobin } from "./round-robin";
import { Schedules } from "./schedules"

const Team = model('Team', teamSchema);
const Group = model('Group', groupSchema);
const Classification = model('Classification', clasificationSchema);

export class Schedulefill {
  teams: number;
  teamsId: string[] = [];
  groups: number;
  excededGroups: number;
  teamsPerGroup: number;
  teamsPerGruopExc: number;
  totalClasifications: number;
  allTeams: any;
  tournamentId: Object;

  constructor(scheduleData: ScheduleInterface) {
    this.teams = scheduleData.teams;
    this.groups = scheduleData.groups;
    this.excededGroups = scheduleData.excededGroups || 0;
    this.teamsPerGroup = scheduleData.teamsPerGroup;
    this.teamsPerGruopExc = scheduleData.teamsPerGruopExc || 0;
    this.totalClasifications = scheduleData.totalClasifications || 0;
    this.tournamentId = scheduleData.tournamentId;
  }
  /**
   * fill
   */
  public async fill() {
    await this.getTeams();
    if (this.totalClasifications && this.totalClasifications > 3) {
      this.createClassifications();
      await this.createGroups();
    } else {
      await this.createGroups();
    }
  }
  private async getTeams() {
    this.allTeams = await Team.find({ 'tournamentId': this.tournamentId }, '_id');
  }

  private createClassifications(): void {
    let object = { level: 0, tournamentId: this.tournamentId };
    //create groups per clasifications and check fase that it is 
    for (let index = 0; index < this.totalClasifications; index++) {
      object.level = index + 1;
      let newClassification = new Classification(object)
      newClassification.save((err, classification) => {
        if (err) {
          console.log('Something went wrong, ', err);
        }
        console.log('this is the number of ', classification);
      });
    }
    Classification.find({}, (err, clasificatios) => {
      if (err) {
        console.log('Something went wrong, ', err);
      }
      console.log('Here are all the teams: ', clasificatios);
    });
  }

  private async createGroups() {
    let index;
    let object = { nameGroup: 0, tournamentId: this.tournamentId, teamsId: [] };

    for (index = 0; index < this.groups; index++) {
      await this.fillTeamPerGroup(this.teamsPerGroup);
      if (this.teamsId) {
        object.teamsId = this.teamsId;
        object.nameGroup = (index + 1);
        await this.saveGroup(object);
        if (index === (this.groups - 1)) {
          this.groups = 0;
        }
        this.teamsId = [];
      } else {
        break;
      };
    }
    let indexGroups = index;
    if (this.excededGroups && this.groups === 0) {
      for (; index < this.excededGroups + indexGroups; index++) {
        await this.fillTeamPerGroup(this.teamsPerGruopExc);
        if (this.teamsId) {
          object.teamsId = this.teamsId;
          object.nameGroup = (index + 1);//await Team.find({ 'tournamentId': this.tournamentId }, 'nameGroup').sort({ date: -1 }).limit(1);
          await this.saveGroup(object);
          this.teamsId = [];
        } else {
          break;
        };
      }
    }
    let schedulesFinal = new Schedules(this.tournamentId);
    schedulesFinal.getTournamentInfo();
  }

  private async saveGroup(object: any) {
    let newGroup = new Group(object);
    let group;
    group = await newGroup.save();
    let rr = new RoundRobin(group.teamsId, group._id.toString(), group.tournamentId);
    await rr.init();
  }
  private async fillTeamPerGroup(teamsPerGroup: number) {
    let numberRan: number;
    if (this.allTeams && this.allTeams.length >= teamsPerGroup) {
      for (let i = 0; i < teamsPerGroup; i++) {
        numberRan = Math.floor(Math.random() * this.allTeams.length);
        this.teamsId[i] = this.allTeams[numberRan]._id;
        this.allTeams.splice(numberRan, 1);
      }
    } else {
      this.teamsId = null;
    }
  }

}