"use client";

import BaseLabel from "@app/components/commons/BaseLabel";
import Card from "@app/components/commons/Card";
import DynamicForm, { DynamicFormConfig } from "@app/components/commons/Form/DynamicForm";
import Loader from "@app/components/commons/Loader";
import BaseButton from "@app/components/commons/buttons/BaseButton";
import BaseModal from "@app/components/commons/modals/BaseModal";
import { MutationParams, useMutateSprint } from "@app/queries/sprintQueries";
import { DATE_FORMAT } from "@lib/shared/commons/constants/base";
import AddOutlined from "@mui/icons-material/AddOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import { format } from "date-fns";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";

export interface Sprint {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
}

export interface SprintCardProps {
  isLoading: boolean;
  projectId: string;
  sprints: Sprint[];
  className?: string;
  onClick?: () => void;
}

export interface ModalState {
  isManageOpen: boolean;
  isCreateOpen: boolean;
  isEditOpen: boolean;
}

export const SprintForm: React.FC<{ projectId: string; sprint?: Sprint; onSuccess?: () => void }> = ({
  projectId,
  sprint,
  onSuccess,
}) => {
  const { mutateAsync, isSuccess, isError } = useMutateSprint();

  const config: DynamicFormConfig = useMemo(
    () => ({
      fields: [
        {
          type: "text",
          name: "name",
          options: {
            placeholder: "Sprint name",
          },
          validate: {
            required: true,
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
            placeholder: "start date",
          },
        },
        {
          type: "datepicker",
          name: "endDate",
          className: "w-1/2",
          validate: {
            min: "startDate",
          },
        },
      ],
    }),
    [],
  );

  const submit = useCallback(
    async (formData: FieldValues, formInstance?: UseFormReturn) => {
      let body = { ...formData, projectId };
      if (sprint) {
        body = { ...sprint, ...formData, projectId };
      }

      try {
        await mutateAsync({ body, method: sprint ? "PATCH" : "POST" } as MutationParams);
      } catch (error) {
        console.error(error);
      } finally {
      }
    },
    [mutateAsync, projectId, sprint],
  );

  useEffect(() => {
    if (isSuccess) {
      // TODO: Display success toast
      console.log("success");
      if (onSuccess) onSuccess();
    }
    if (isError) {
      // TODO: Display error toast
      console.error("error");
    }
  });

  return <DynamicForm config={config} onSubmit={submit} mapValues={sprint} />;
};

export const SprintCard = ({ isLoading, sprints = [], projectId, className = "", onClick }: SprintCardProps) => {
  const [modalState, setModalState] = useState<ModalState>({
    isManageOpen: false,
    isCreateOpen: false,
    isEditOpen: false,
  });
  const [selectedSprint, setSelectedSprint] = useState<Sprint | undefined>(undefined);

  const activeSprint = useMemo(() => sprints.find(({ status }: Sprint) => status === "active"), [sprints]);

  const toggleModal = useCallback(
    (modal: keyof ModalState, value: boolean, sprint?: Sprint) => () => {
      setModalState((prev) => ({ ...prev, [modal]: value }));
      if (sprint) {
        setSelectedSprint(sprint);
      }
    },
    [],
  );
  const createNewSprint = useCallback(() => {
    setModalState((prev) => ({ ...prev, isCreateOpen: true, isManageOpen: true }));
  }, []);

  const CardContent = useMemo(() => {
    // Loading then show loader
    if (isLoading) {
      return <Loader />;
    }
    if (!sprints.length) {
      return (
        <Fragment>
          <h3 className="mx-auto my-3 font-medium text-slate-300 text-2xl">There is no sprint</h3>
          <BaseButton label="Create new sprint" onClick={createNewSprint} />
        </Fragment>
      );
    }
    // there's active sprint and no sprints
    if (!activeSprint) {
      return <h3 className="m-0 font-medium text-slate-300 text-2xl">There is no active sprint</h3>;
    }

    return (
      <div className="h-full w-full flex flex-col">
        <h4 className="capitalize mx-0 my-3">{activeSprint?.name}</h4>
        <p className="m-0 flex-1">{activeSprint?.description}</p>
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
  }, [activeSprint, createNewSprint, isLoading, sprints?.length]);

  const handleCardClick = useCallback(() => {
    if (onClick && typeof onClick === "function") {
      onClick();
    }
  }, [onClick]);

  const goBackManageSprints = useCallback(() => {
    setModalState((prev) => ({ ...prev, isCreateOpen: false, isEditOpen: false }));
  }, []);

  const ModalContent = useMemo(() => {
    if (modalState.isCreateOpen) {
      return <SprintForm projectId={projectId} onSuccess={goBackManageSprints} />;
    }
    if (modalState.isEditOpen) {
      return <SprintForm projectId={projectId} sprint={selectedSprint} onSuccess={goBackManageSprints} />;
    }
    return sprints.map((sprint) => (
      <div key={sprint.id} className="flex items-center gap-4 px-2 py-2 mb-1 hover:bg-slate-100 duration-75 rounded-sm">
        <span className="grow">{sprint.name}</span>
        <span>{format(new Date(sprint.startDate), DATE_FORMAT)}</span>
        <span>{format(new Date(sprint.endDate), DATE_FORMAT)}</span>
        <span className="flex gap-2">
          <BaseButton
            icon={<EditIcon fontSize="small" />}
            variants="text"
            onClick={toggleModal("isEditOpen", true, sprint)}
          />
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
      return <BaseButton icon={<ArrowBackIcon fontSize="small" />} variants="text" onClick={goBackManageSprints} />;
    }
    return <BaseButton icon={<AddOutlined />} onClick={createNewSprint} />;
  }, [createNewSprint, goBackManageSprints, modalState.isCreateOpen, modalState.isEditOpen]);

  return (
    <Card className={`h-full flex gap-3 ${className}`} loading={isLoading} onClick={handleCardClick}>
      <div className="flex justify-between">
        <BaseLabel>sprint</BaseLabel>
        {sprints.length > 0 && (
          <BaseButton
            label="Manage Sprints"
            onClick={toggleModal("isManageOpen", true)}
            className="hover:underline !text-slate-400"
            variants="text"
          />
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
