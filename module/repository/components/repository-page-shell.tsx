const RepositoryPageShell = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold tracking-tight">Repositories</h1>
        <p className="text-muted-foreground text-sm">
          Manage and view all your GitHub repositories
        </p>
      </div>
      {children}
    </div>
  );
};

export default RepositoryPageShell;
