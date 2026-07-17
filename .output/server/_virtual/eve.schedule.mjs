import { fileURLToPath as __eveFileURLToPath } from "node:url";
import { dirname as __eveDirname } from "node:path";
__eveDirname(__eveFileURLToPath(import.meta.url));
import { I as dispatchScheduleTask } from "../_libs/eve.mjs";
//#region #eve-schedule-task/eve.schedule.c2NoZWR1bGVzL2RhaWx5LWNvbXBldGl0aXZlLXNjYW4udHM
const config = { "kind": "production" };
var eve_schedule_default = {
	meta: { description: "Run eve schedule \"daily-competitive-scan\" from \"schedules/daily-competitive-scan.ts\"." },
	async run(event) {
		return { result: await dispatchScheduleTask(event.name, config) };
	}
};
//#endregion
export { eve_schedule_default as default };
