import app from "./app";
import { createSchedule } from "./utils/create-schedules";
import { Schedulefill } from "./utils/schedules-fill";
import { ScheduleInterface } from "./utils/interfaces/schedule-interface";
import { AddPoints } from "./utils/addPoints";
import { Schedules } from "./utils/schedules";

const PORT = 3000;

app.listen(PORT, () => {
	console.log('Express server listening on port ', PORT);

	// let schedules = new createSchedule(25, '5c6c8c4632600327ae2046c2');
	// let isCorrect: boolean = schedules.verifyTeams();
	// let scheduleData: ScheduleInterface;
	// console.log('This is the result ', schedules);
	// console.log('Is this correct ? ', isCorrect);
	// scheduleData = schedules;
	let schedules = new createSchedule(25, '5c6c8c4632600327ae2046c2');
	let isCorrect: boolean = schedules.verifyTeams();
	let scheduleData: ScheduleInterface;
	console.log('Is this correct ? ', isCorrect);
	scheduleData = schedules;
	
	let fillSchedules = new Schedulefill(scheduleData);
	fillSchedules.fill();


	// let match: MatchDataInterface;
	// match = {
	// 	teamOne: '5cbe1c56a6315754b74f8e60',
	// 	teamTwo: '5cbe1c56a6315754b74f8e5f',
	// 	setsTO: 2,
	// 	setsTT: 0,
	// 	pointsTO: 50,
	// 	pointsTT: 30,
	// 	tournamentID: '5c6c8c4632600327ae2046c2'
	//   }
	// let games = new AddPoints(2);
	// games.wasAdded(match);
	// let finals = new Finals(false, '5c6c8c4632600327ae2046c2');
	// finals.areThereTime();

});