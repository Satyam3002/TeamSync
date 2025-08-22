import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import CreateProjectForm from "@/components/workspace/project/create-project-form";
import useCreateProjectDialog from "@/hooks/use-create-project-dialog";

const CreateProjectDialog = () => {
  const { open, onClose } = useCreateProjectDialog();
  return (
    <div>
      <Dialog modal={true} open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-lg border-0">
          <DialogHeader className="sr-only">
            <DialogTitle>Create Project</DialogTitle>
            <DialogDescription>
              Create a new project in your workspace
            </DialogDescription>
          </DialogHeader>
          <CreateProjectForm {...{ onClose }} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateProjectDialog;
