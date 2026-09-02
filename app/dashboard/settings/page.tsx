import ProfileForm from "@/module/settings/components/profile-form";
import RepositoryList from "@/module/settings/components/repository-list";

const SettingsPage = () => {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold">Settings</h1>
        <p className="text-muted-foreground text-sm">
          Manage your account settings and connected repositories
        </p>
      </div>
      <ProfileForm />
      <RepositoryList />
    </div>
  );
};

export default SettingsPage;
