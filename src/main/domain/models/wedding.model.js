import database from "../../database";
import { ParticipantSchema } from "./participant.model";
import { UserSchema } from "./user.model";
import { TaskSchema } from "./task.model";
import { GuestSchema } from "./guest.model";
import forEach from "lodash/forEach";

const WeddingSchema = new database.Schema({
  name: String,
  description: String,
  owners: [UserSchema],
  participants: [ParticipantSchema],
  tasks: [TaskSchema],
  guests: [GuestSchema]
});

WeddingSchema.static({

  findByOwner(owner, select = "name description participants guests owners") {
    return this.findOne({
      owners: {
        $elemMatch: owner
      }
    }).select(select).exec();
  },

  findTasksBy(owner) {
    return this.findOne({
      owners: {
        $elemMatch: owner
      }
    }).select("tasks")
      .exec()
      .then((wedding) => wedding.tasks);
  }

});

WeddingSchema.method({

  addTask(taskToAdd) {
    this.tasks.push(taskToAdd);
    return this;
  },

  removeTask(taskId) {
    this.tasks.id(taskId).remove();
    return this;
  },

  addAllTasks(tasksToAdd) {
    forEach(tasksToAdd, (task) => this.addTask(task));
    return this;
  }

});

export default database.model("Wedding", WeddingSchema);
