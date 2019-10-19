import app from "./app";
import { createSchedule } from "./utils/create-schedules";
import { Schedulefill } from "./utils/schedules-fill";
import { ScheduleInterface } from "./utils/interfaces/schedule-interface";
import { Schedules } from "./utils/schedules";

const PORT = 3000;

app.listen(PORT, () => {
	console.log('Express server listening on port ', PORT);

	// let schedules = new createSchedule(40, '5bb975f97ccc872a398cfc25');
	// let isCorrect: boolean = schedules.verifyTeams();
	// let scheduleData: ScheduleInterface;
	// console.log('Is this correct ? ', isCorrect);
	// scheduleData = schedules;

	// let fillSchedules = new Schedulefill(scheduleData);
	// fillSchedules.fill();
	
	// let schedule = new Schedules('5bb975f97ccc872a398cfc25');
	// schedule.scheduleInit();
	// let finals = new Finals(false, '5c6c8c4632600327ae2046c2');
	// finals.areThereTime();



});