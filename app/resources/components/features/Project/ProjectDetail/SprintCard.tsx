"use client";

import { Sprint, SprintEnum } from "@lib/types/sprint";
import { formatDateString } from "@lib/utils/helper";
import { Button } from "@resources/components/common/Button";
import Card, { CardContent, CardFooter, CardHeader } from "@resources/components/common/Card";
import Loader from "@resources/components/common/Loader";
import BaseModal from "@resources/components/common/modals/BaseModal";
import { useGlobal } from "@resources/components/common/providers/GlobalProvider";
import DynamicForm, { DynamicFormConfig } from "@resources/components/form/DynamicForm";
import { MutationParams, useMutateSprint, useSprintQuery } from "@resources/queries/sprintQueries";
import { format } from "date-fns";
import { DATE_FORMAT } from "lib/commons/constants/base";
import { Plus, ArrowLeft, Pencil } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";

export interface SprintFilter {
  status?: SprintEnum;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface SprintCardProps {
  projectId: string;
  className?: string;
  onClick?: () => void;
}

export interface ModalState {
  isManageOpen: boolean;
  isCreateOpen: boolean;
  isEditOpen: boolean;
}

const config: DynamicFormConfig = {
  fields: [
    {
      type: "text",
      name: "name",
      options: {
        placeholder: "Sprint name",
      },
      validate: {
        required: true,
        min: 3,
        max: 50,
      },
    },
    {
      type: "textarea",
      name: "description",
      options: {
        placeholder: "Sprint goal",
      },
      validate: {
        required: true,
        min: 10,
        max: 500,
      },
    },
    {
      type: "select",
      name: "status",
      options: {
        placeholder: "Sprint status",
        options: [
          { label: "Active", value: "active" },
          { label: "Inactive", value: "inactive" },
        ],
      },
      validate: {
        required: true,
      },
    },
    {
      type: "datepicker",
      name: "startDate",
      className: "w-1/2",
      options: {
        placeholder: "Start date",
      },
      validate: {
        required: true,
      },
    },
    {
      type: "datepicker",
      name: "endDate",
      className: "w-1/2",
      validate: {
        required: true,
        min: "startDate",
      },
    },
  ],
};

export const SprintForm: React.FC<{ projectId: string; sprint?: Sprint; onSuccess?: () => void }> = ({
  projectId,
  sprint,
  onSuccess,
}) => {
  const { mutateAsync, reset } = useMutateSprint();
  const { notify } = useGlobal();

  const submit = useCallback(
    async (formData: FieldValues, formInstance?: UseFormReturn) => {
      const body = sprint ? { ...sprint, ...formData, projectId } : { ...formData, projectId };

      try {
        await mutateAsync({
          body,
          method: sprint ? "PATCH" : "POST",
        } as MutationParams);
        notify(sprint ? "Sprint updated successfully!" : "Sprint created successfully!", "success");
        formInstance?.reset();
        if (onSuccess) {
          onSuccess();
        }
      } catch (error) {
        console.error("Sprint submission error:", error);
        const errorMessage = error instanceof Error ? error.message : "Failed to save sprint. Please try again.";
        notify(errorMessage, "error");
        if (formInstance) {
          formInstance.setError("root", {
            type: "manual",
            message: errorMessage,
          });
        }
      }
    },
    [sprint, projectId, mutateAsync, notify, onSuccess],
  );

  // Reset mutation state when component unmounts or sprint changes
  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset, sprint?.id]);

  return <DynamicForm config={config} onSubmit={submit} mapValues={sprint as Record<string, unknown> | undefined} />;
};

export const SprintCard = ({ projectId, onClick, className }: SprintCardProps) => {
  const { data: sprints = [], isFetching: isSprintsFetching } = useSprintQuery(projectId, {});
  const { data: activeSprints = [] } = useSprintQuery(projectId, { status: "active" });

  const [modalState, setModalState] = useState<ModalState>({
    isManageOpen: false,
    isCreateOpen: false,
    isEditOpen: false,
  });
  const [selectedSprint, setSelectedSprint] = useState<Sprint | null>(null);

  const activeSprint = useMemo(() => activeSprints.find(({ status }) => status === SprintEnum.ACTIVE), [activeSprints]);

  const toggleModal = useCallback(
    (modal: keyof ModalState, value: boolean, sprint?: Sprint) => () => {
      setModalState((prev) => ({ ...prev, [modal]: value }));
      if (sprint) {
        setSelectedSprint(sprint);
      } else if (!value) {
        // Clear selected sprint when closing modals
        setSelectedSprint(null);
      }
    },
    [],
  );

  const createNewSprint = useCallback(() => {
    setModalState((prev) => ({ ...prev, isCreateOpen: true, isManageOpen: true }));
  }, []);

  const SprintContent = useMemo(() => {
    // Loading then show loader
    if (isSprintsFetching) {
      return <Loader />;
    }
    if (!activeSprints.length) {
      return (
        <div className="text-center py-6">
          <p className="text-gray-500 dark:text-gray-400 mb-4">No sprints yet</p>
          <Button onClick={createNewSprint} size="sm">
            Create Sprint
          </Button>
        </div>
      );
    }
    // there's active sprint and no sprints
    if (!activeSprint) {
      return (
        <div className="text-center py-6">
          <p className="text-gray-500 dark:text-gray-400">No active sprint</p>
        </div>
      );
    }

    return (
      <div className="flex items-start justify-start h-full">
        <div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 capitalize mb-1">
            {activeSprint?.name}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{activeSprint?.description}</p>
        </div>
      </div>
    );
  }, [activeSprint, createNewSprint, isSprintsFetching, activeSprints?.length]);

  const handleCardClick = useCallback(() => {
    if (onClick && typeof onClick === "function") {
      onClick();
    }
  }, [onClick]);

  const goBackManageSprints = useCallback(() => {
    setModalState((prev) => ({ ...prev, isCreateOpen: false, isEditOpen: false, isManageOpen: true }));
    setSelectedSprint(null);
  }, []);

  const ModalContent = useMemo(() => {
    if (modalState.isCreateOpen) {
      return <SprintForm projectId={projectId} onSuccess={goBackManageSprints} />;
    }
    if (modalState.isEditOpen && selectedSprint) {
      return <SprintForm projectId={projectId} sprint={selectedSprint} onSuccess={goBackManageSprints} />;
    }
    return (sprints as unknown as Sprint[])
      .sort((a: Sprint, b: Sprint) => {
        const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
        const dateB = b.endDate ? new Date(b.endDate).getTime() : 0;
        return dateB - dateA;
      })
      .map((sprint: Sprint) => (
        <div
          key={sprint.id}
          className="flex items-center gap-3 p-3 mb-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
          <div
            className={`w-2 h-2 rounded-full flex-shrink-0 ${
              sprint.status === SprintEnum.ACTIVE ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
            }`}
          />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 dark:text-gray-100 truncate">{sprint.name}</p>
            <div className="flex gap-4 mt-1 text-xs text-gray-600 dark:text-gray-400">
              <span>Start: {formatDateString(sprint.startDate)}</span>
              <span>End: {formatDateString(sprint.endDate)}</span>
            </div>
          </div>
          <Button size="icon" variant="ghost" onClick={toggleModal("isEditOpen", true, sprint)}>
            <Pencil className="w-4 h-4" />
          </Button>
        </div>
      ));
  }, [
    goBackManageSprints,
    modalState.isCreateOpen,
    modalState.isEditOpen,
    projectId,
    selectedSprint,
    sprints,
    toggleModal,
  ]);

  const Prefix = useMemo(() => {
    if (modalState.isEditOpen || modalState.isCreateOpen) {
      return (
        <Button size="icon" variant="ghost" onClick={goBackManageSprints}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
      );
    }
    return (
      <Button size="icon" onClick={createNewSprint}>
        <Plus className="w-5 h-5" />
      </Button>
    );
  }, [createNewSprint, goBackManageSprints, modalState.isCreateOpen, modalState.isEditOpen]);

  return (
    <Card className={`flex flex-col ${className}`} onClick={handleCardClick}>
      <CardHeader className="p-5 pb-3">
        <div className="flex justify-between items-center">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Sprint</span>
          {sprints.length > 0 && (
            <Button
              onClick={toggleModal("isManageOpen", true)}
              size="sm"
              variant="ghost"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
              Manage Sprints
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-5 pt-0 flex-1">{SprintContent}</CardContent>
      {activeSprint && (
        <CardFooter className="px-5 pb-5 pt-0 flex gap-4 text-xs text-gray-600 dark:text-gray-400">
          <div>
            <span className="font-semibold">Start: </span>
            {activeSprint.startDate ? format(new Date(activeSprint.startDate), DATE_FORMAT) : "-"}
          </div>
          <div>
            <span className="font-semibold">End: </span>
            {activeSprint.endDate ? format(new Date(activeSprint.endDate), DATE_FORMAT) : "-"}
          </div>
        </CardFooter>
      )}
      <BaseModal
        open={modalState.isManageOpen}
        prefix={Prefix}
        onClose={toggleModal("isManageOpen", false)}
        title="Manage Sprints"
        className="min-w-[96] w-[40rem] min-h-96 overflow-auto"
        closable>
        <div className="mt-4">{ModalContent}</div>
      </BaseModal>
    </Card>
  );
};
