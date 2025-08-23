import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import useCreateProjectDialog from "@/hooks/use-create-project-dialog";
import WorkspaceAnalytics from "@/components/workspace/workspace-analytics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RecentProjects from "@/components/workspace/project/recent-projects";
import RecentTasks from "@/components/workspace/task/recent-tasks";
import RecentMembers from "@/components/workspace/member/recent-members";
import { useAuthContext } from "@/context/auth-provider";
import { useNavigate } from "react-router-dom";

const WorkspaceDashboard = () => {
  const { onOpen } = useCreateProjectDialog();
  const { user, workspace } = useAuthContext();
  const navigate = useNavigate();

  // If user has no current workspace, show a different view
  if (!user?.currentWorkspace?._id) {
    return (
      <main className="flex flex-1 flex-col py-4 md:pt-3">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">
              Welcome to TeamSync!
            </h2>
            <p className="text-muted-foreground max-w-md">
              You don't have any workspaces yet. Create your first workspace to
              get started.
            </p>
            <Button onClick={() => navigate("/workspace/create")}>
              <Plus className="mr-2 h-4 w-4" />
              Create Workspace
            </Button>
          </div>
        </div>
      </main>
    );
  }

  // If workspace doesn't exist, show error
  if (!workspace) {
    return (
      <main className="flex flex-1 flex-col py-4 md:pt-3">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">
              Workspace Not Found
            </h2>
            <p className="text-muted-foreground max-w-md">
              The workspace you're looking for doesn't exist or you don't have
              access to it.
            </p>
            <Button onClick={() => navigate("/dashboard")}>
              Go to Dashboard
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col py-4 md:pt-3">
      <div className="flex items-center justify-between space-y-2 mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Workspace Overview
          </h2>
          <p className="text-muted-foreground">
            Here&apos;s an overview for this workspace!
          </p>
        </div>
        <Button onClick={onOpen}>
          <Plus />
          New Project
        </Button>
      </div>
      <WorkspaceAnalytics />
      <div className="mt-4">
        <Tabs defaultValue="projects">
          <TabsList className="w-full justify-start border-0 bg-gray-50 px-1 h-12">
            <TabsTrigger className="py-2" value="projects">
              Recent Projects
            </TabsTrigger>
            <TabsTrigger className="py-2" value="tasks">
              Recent Tasks
            </TabsTrigger>
            <TabsTrigger className="py-2" value="members">
              Recent Members
            </TabsTrigger>
          </TabsList>
          <TabsContent value="projects">
            <RecentProjects />
          </TabsContent>
          <TabsContent value="tasks">
            <RecentTasks />
          </TabsContent>
          <TabsContent value="members">
            <RecentMembers />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default WorkspaceDashboard;
