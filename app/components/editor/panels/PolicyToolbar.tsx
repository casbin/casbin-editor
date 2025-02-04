import { FileUploadButton } from '@/app/components/editor/common/FileUploadButton';
import { EngineSelector } from '@/app/components/editor/common/EngineSelector';
import { EndpointSelector } from '@/app/components/editor/common/EndpointSelector';
import type { EngineType } from '@/app/config/engineConfig';
import type { VersionInfo } from '@/app/components/hooks/useRemoteEnforcer';

interface PolicyToolbarProps {
  setPolicyPersistent: (content: string) => void;
  selectedEngine: EngineType;
  comparisonEngines: EngineType[];
  handleEngineChange: (newPrimary: EngineType, newComparison: EngineType[]) => void;
  versions: Record<EngineType, VersionInfo>;
  engineGithubLinks: Record<EngineType, string>;
}

export const PolicyToolbar: React.FC<PolicyToolbarProps> = ({
  setPolicyPersistent,
  selectedEngine,
  comparisonEngines,
  handleEngineChange,
  versions,
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
        versions={versions}
        engineGithubLinks={engineGithubLinks}
      />
    </div>
  );
};
