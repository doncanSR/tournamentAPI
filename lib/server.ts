import app from "./app";
import { CreateSchedule } from "./utils/create-schedules";
import { Schedulefill } from "./utils/schedules-fill";
import { ScheduleInterface } from "./utils/interfaces/schedule-interface";
import { Schedules } from "./utils/schedules";

const PORT = 3000;

app.listen(PORT, async () => {
	console.log('Express server listening on port ', PORT);
});