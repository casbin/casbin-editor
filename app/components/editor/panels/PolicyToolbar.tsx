import { FileUploadButton } from '@/app/components/editor/common/FileUploadButton';
import { EngineSelector } from '@/app/components/editor/core/EngineSelector';
import { EndpointSelector } from '@/app/components/editor/common/EndpointSelector';

interface PolicyToolbarProps {
  setPolicyPersistent: (content: string) => void;
  selectedEngine: string;
  comparisonEngines: string[];
  handleEngineChange: (newPrimary: string, newComparison: string[]) => void;
  casbinVersion?: string;
  javaVersion?: {
    libVersion: string;
    engineVersion: string;
  };
  goVersion?: {
    libVersion: string;
    engineVersion: string;
  };
  engineGithubLinks: Record<string, string>;
}

export const PolicyToolbar: React.FC<PolicyToolbarProps> = ({
  setPolicyPersistent,
  selectedEngine,
  comparisonEngines,
  handleEngineChange,
  casbinVersion,
  javaVersion,
  goVersion,
  engineGithubLinks,
}) => {
  return (
    <div className="text-right mr-4 text-sm flex items-center justify-end gap-2">
      <div className="font-normal text-base">
        <FileUploadButton onFileContent={setPolicyPersistent} accept=".csv" />
      </div>
      <EndpointSelector />
      <EngineSelector
        selectedEngine={selectedEngine}
        comparisonEngines={comparisonEngines}
        onEngineChange={handleEngineChange}
        casbinVersion={casbinVersion}
        javaVersion={javaVersion}
        goVersion={goVersion}
        engineGithubLinks={engineGithubLinks}
      />
    </div>
  );
};
