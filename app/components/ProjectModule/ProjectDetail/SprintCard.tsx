"use client";

import { MutationParams, useMutateSprint, useSprintQuery } from "@app/_queries/sprintQueries";
import BaseLabel from "@app/components/commons/BaseLabel";
import Card from "@app/components/commons/Card";
import DynamicFormV2, { DynamicFormV2Config } from "@app/components/commons/FormV2/DynamicFormV2";
import Loader from "@app/components/commons/Loader";
import BaseModal from "@app/components/commons/modals/BaseModal";
import { useGlobal } from "@app/components/commons/providers/GlobalProvider";
import { Button } from "@app/components/ui/button";
import { formatDateString } from "@lib/utils/helper";
import AddOutlined from "@mui/icons-material/AddOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import { format } from "date-fns";
import { DATE_FORMAT } from "lib/commons/constants/base";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";

export interface Sprint {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: "active" | "inactive";
  projectId?: string;
}

export interface SprintFilter {
  status?: "active" | "inactive";
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

const config: DynamicFormV2Config = {
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

  return <DynamicFormV2 config={config} onSubmit={submit} mapValues={sprint} />;
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

  const activeSprint = useMemo(() => activeSprints.find(({ status }: Sprint) => status === "active"), [activeSprints]);

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

  const CardContent = useMemo(() => {
    // Loading then show loader
    if (isSprintsFetching) {
      return <Loader />;
    }
    if (!activeSprints.length) {
      return (
        <Fragment>
          <h3 className="mx-auto my-3 font-medium text-slate-300 text-2xl">There is no sprint</h3>
          <Button onClick={createNewSprint}>Create new sprint</Button>
        </Fragment>
      );
    }
    // there's active sprint and no sprints
    if (!activeSprint) {
      return <h3 className="m-0 font-medium text-slate-300 text-2xl">There is no active sprint</h3>;
    }

    return (
      <div className="h-full w-full flex flex-col">
        <h4 className="capitalize mx-0 my-3 font-medium">{activeSprint?.name}</h4>
        <p className="m-0 flex-1 text-sm">{activeSprint?.description}</p>
        <div className="flex flex-wrap justify-between">
          <div className="text-xs">
            <BaseLabel>Start Date: </BaseLabel>
            {activeSprint.startDate ? format(new Date(activeSprint.startDate), DATE_FORMAT) : "-"}
          </div>
          <div className="text-xs">
            <BaseLabel>End Date: </BaseLabel>
            {activeSprint.endDate ? format(new Date(activeSprint.endDate), DATE_FORMAT) : "-"}
          </div>
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
    return sprints
      .sort((a: Sprint, b: Sprint) => {
        const dateA = new Date(a.startDate).getTime();
        const dateB = new Date(b.startDate).getTime();
        return dateB - dateA;
      })
      .map((sprint: Sprint) => (
        <div
          key={sprint.id}
          className="flex items-center gap-4 px-2 py-2 mb-1 hover:bg-slate-100 dark:hover:bg-slate-700 duration-75 rounded-sm">
          <span
            className={`font-bold rounded-full w-3 h-3 ${
              sprint.status === "active" ? "bg-green-400" : "bg-transparent"
            }`}
          />
          <span className="grow">{sprint.name}</span>
          <span className="text-sm text-slate-400 w-40">
            <b className="text-primary">Start:</b> {formatDateString(sprint.startDate)}
          </span>
          <span className="text-sm text-slate-400 w-40">
            <b className="text-primary">End:</b> {formatDateString(sprint.endDate)}
          </span>
          <span className="flex gap-2">
            <Button size="icon" variant="ghost" onClick={toggleModal("isEditOpen", true, sprint)}>
              <EditIcon fontSize="small" />
            </Button>
          </span>
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
          <ArrowBackIcon fontSize="small" />
        </Button>
      );
    }
    return (
      <Button size="icon" onClick={createNewSprint}>
        <AddOutlined />
      </Button>
    );
  }, [createNewSprint, goBackManageSprints, modalState.isCreateOpen, modalState.isEditOpen]);

  return (
    <Card className={`h-full flex gap-3 ${className}`} loading={isSprintsFetching} onClick={handleCardClick}>
      <div className="flex justify-between">
        <span className="text-lg font-bold capitalize">sprint</span>
        {sprints.length > 0 && (
          <Button
            onClick={toggleModal("isManageOpen", true)}
            className="hover:underline !text-slate-400"
            variant="ghost">
            Manage Sprints
          </Button>
        )}
      </div>
      <div className="flex-1 flex flex-col justify-center items-center">{CardContent}</div>
      <BaseModal
        open={modalState.isManageOpen}
        prefix={Prefix}
        onClose={toggleModal("isManageOpen", false)}
        title="Manage Sprints"
        className="min-w-[96] w-[40rem] min-h-96 overflow-auto"
        closable>
        <div className="mt-3">{ModalContent}</div>
      </BaseModal>
    </Card>
  );
};
