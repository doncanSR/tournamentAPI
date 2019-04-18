import app from "./app";
import { createSchedule } from "./utils/create-schedules";
import { Schedulefill } from "./utils/schedules-fill";
import { ScheduleInterface } from "./utils/interfaces/schedule-interface";
import { RoundRobin } from "./utils/round-robin";
import { Finals } from "./utils/finals";
const PORT = 3000;

app.listen(PORT, () => {
	console.log('Express server listening on port ', PORT);

	// let schedules = new createSchedule(33, '5c6c8c4632600327ae2046c2');
	// let isCorrect: boolean = schedules.verifyTeams();
	// let scheduleData: ScheduleInterface;
	// console.log('Is this correct ? ', isCorrect);
	// scheduleData = schedules;
	// console.log('This is the result ', scheduleData);

	// let fillSchedules = new Schedulefill(scheduleData);
	// fillSchedules.fill();

	// let teams: string[] = ['team 1', 'team 2', 'team 3', 'team 4'];
	// let groupName: string = 'equipo A';
	// let rr = new RoundRobin(teams, groupName, '5c6c8c4632600327ae2046c2');
	// rr.init();

	// let finals = new Finals(false, '5c6c8c4632600327ae2046c2');
	// finals.areThereTime();

});