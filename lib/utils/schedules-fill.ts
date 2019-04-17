import { ScheduleInterface } from "./interfaces/schedule-interface";
import { teamSchema } from "../models/team-model";
import * as mongoose from 'mongoose';
import { groupSchema } from "../models/group-model";
import { clasificationSchema } from "../models/clasificatio.model";

const Team = mongoose.model('Team', teamSchema);
const Group = mongoose.model('Group', groupSchema);
const Classification = mongoose.model('Classification', clasificationSchema);

export class Schedulefill {
  teams: number;
  teamsID: string[] = [];
  groups: number;
  excededGroups: number;
  teamsPerGroup: number;
  teamsPerGruopExc: number;
  totalClasifications: number;
  allTeams: any;
  tournamentId: string;

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
    if (this.totalClasifications) {
      this.createClassifications();
      this.createGroups();
    } else {
      this.createGroups();
    }
  }
  private async getTeams() {
    this.allTeams = await Team.find({ 'tournamentID': this.tournamentId }, '_id');
  }

  private createClassifications(): void {
    let object = { level: 0, tournamentID: this.tournamentId };
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

  private async createGroups(): Promise<void> {
    let object = { nameGroup: 0, tournamentID: this.tournamentId, teamID: [] };

    for (let index = 0; index < this.groups; index++) {
      await this.fillTeamPerGroup(this.teamsPerGroup);
      if (this.teamsID) {
        object.teamID = this.teamsID;
        object.nameGroup = (index + 1);
        await this.saveGroup(object);
        if (index === (this.groups - 1)) {
          this.groups = 0;
        }
        this.teamsID = [];
      } else {
        break;
      };
    }
    if (this.excededGroups && this.groups === 0) {
      for (let index = 0; index < this.excededGroups; index++) {
        await this.fillTeamPerGroup(this.teamsPerGruopExc);
        if (this.teamsID) {
          object.teamID = this.teamsID;
          object.nameGroup = await Team.find({ 'tournamentID': this.tournamentId }, 'nameGroup').sort({ date: -1 }).limit(1);
          await this.saveGroup(object);
          this.teamsID = [];
        } else {
          break;
        };
      }
    }
    Group.find({}, (err, groups) => {
      if (err) {
        console.log('Something went wrong, ', err);
      }
      console.log('Here are all the teams: ', groups);
    });
  }

  private async saveGroup(object: any) {
    let newGroup = new Group(object);
    await newGroup.save();
  }
  private async fillTeamPerGroup(teamsPerGroup: number) {
    let numberRan: number;
    if (this.allTeams && this.allTeams.length >= teamsPerGroup) {
      for (let i = 0; i < teamsPerGroup; i++) {
        numberRan = Math.floor(Math.random() * this.allTeams.length);
        this.teamsID[i] = this.allTeams[numberRan]._id.toString();
        this.allTeams.splice(numberRan, 1);
      }
      console.log('random team was called', this.teamsID);
    } else {
      this.teamsID = null;
      console.log('All the teams were used');
    }
  }

}