import bugImageSrc from "@app/_assets/images/icons/bug.svg";
import epicImageSrc from "@app/_assets/images/icons/epic.svg";
import issueImageSrc from "@app/_assets/images/icons/issue.svg";
import storyImageSrc from "@app/_assets/images/icons/story.svg";

export enum USER_DETAIL_MODE {
  VIEW = "VIEW",
  EDIT = "EDIT",
}

export enum TaskStatusEnum {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
}

type TaskStatusType = Record<TaskStatusEnum, { label: string; color: string; value: TaskStatusEnum }>;

export const TaskStatus: TaskStatusType = {
  [TaskStatusEnum.TODO]: {
    label: "Backlog",
    value: TaskStatusEnum.TODO,
    color: "#1d4ed8",
  },
  [TaskStatusEnum.IN_PROGRESS]: {
    label: "In Progress",
    value: TaskStatusEnum.IN_PROGRESS,
    color: "#a16207",
  },
  [TaskStatusEnum.DONE]: {
    label: "Done",
    value: TaskStatusEnum.DONE,
    color: "#15803d",
  },
};

export const TaskStatusOptions = Object.values(TaskStatus).map(({ label, value }) => ({ label, value }));

export enum TaskTypeEnum {
  BUG = "BUG",
  ISSUE = "ISSUE",
  EPIC = "EPIC",
  STORY = "STORY",
}

export const TaskType: ObjectType = {
  [TaskTypeEnum.BUG]: {
    icon: bugImageSrc,
    label: "Bug",
    value: TaskTypeEnum.BUG,
  },
  [TaskTypeEnum.ISSUE]: {
    icon: issueImageSrc,
    label: "Issue",
    value: TaskTypeEnum.ISSUE,
  },
  [TaskTypeEnum.STORY]: {
    icon: storyImageSrc,
    label: "Story",
    value: TaskTypeEnum.STORY,
  },
  [TaskTypeEnum.EPIC]: {
    icon: epicImageSrc,
    label: "Epic",
    value: TaskTypeEnum.EPIC,
  },
};

export const TaskTypeOptions = Object.values(TaskType).map(({ label, value }) => ({ label, value }));

const UserStatusType: ObjectType = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  PENDING: "PENDING",
};
