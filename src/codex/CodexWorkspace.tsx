import React, { type ReactNode } from 'react';
import { PanelRightClose, PanelRightOpen } from 'lucide-react';

type CodexWorkspaceProps = {
  rail: ReactNode;
  main: ReactNode;
  artifacts?: ReactNode;
  artifactsOpen?: boolean;
  onToggleArtifacts?: () => void;
  artifactsTitle?: string;
  topbar?: ReactNode;
};

/**
 * Codex-style three-pane agent workspace:
 * left rail (sessions/tools) · center transcript/tools · right artifacts
 */
export function CodexWorkspace({
  rail,
  main,
  artifacts,
  artifactsOpen = true,
  onToggleArtifacts,
  artifactsTitle = 'Artifacts',
  topbar,
}: CodexWorkspaceProps) {
  const hasArtifacts = artifacts != null;
  return (
    <div className="codex-root">
      {topbar}
      <div
        className={`codex-body ${hasArtifacts ? 'has-artifacts' : 'no-artifacts'}`}
      >
        <aside className="codex-rail">{rail}</aside>
        <main className="codex-main">{main}</main>
        {hasArtifacts && (
          <aside
            className={`codex-artifacts ${artifactsOpen ? 'codex-artifacts-open' : 'codex-artifacts-closed'}`}
          >
            <div className="codex-artifacts-header">
              <span className="codex-artifacts-title">{artifactsTitle}</span>
              {onToggleArtifacts && (
                <button
                  type="button"
                  className="codex-icon-btn"
                  onClick={onToggleArtifacts}
                  aria-label={artifactsOpen ? 'Collapse artifacts' : 'Expand artifacts'}
                >
                  {artifactsOpen ? (
                    <PanelRightClose className="w-4 h-4" />
                  ) : (
                    <PanelRightOpen className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>
            {artifactsOpen && <div className="codex-artifacts-body">{artifacts}</div>}
          </aside>
        )}
      </div>
    </div>
  );
}

type CodexRailSectionProps = {
  label: string;
  children: ReactNode;
};

export function CodexRailSection({ label, children }: CodexRailSectionProps) {
  return (
    <div className="codex-rail-section">
      <div className="codex-rail-label">{label}</div>
      <div className="codex-rail-items">{children}</div>
    </div>
  );
}

type CodexRailItemProps = {
  active?: boolean;
  icon?: ReactNode;
  label: string;
  onClick?: () => void;
  meta?: string;
};

export function CodexRailItem({
  active,
  icon,
  label,
  onClick,
  meta,
}: CodexRailItemProps) {
  return (
    <button
      type="button"
      className={`codex-rail-item ${active ? 'is-active' : ''}`}
      onClick={onClick}
    >
      {icon && <span className="codex-rail-item-icon">{icon}</span>}
      <span className="codex-rail-item-label">{label}</span>
      {meta && <span className="codex-rail-item-meta">{meta}</span>}
    </button>
  );
}

type CodexToolStepProps = {
  label: string;
  status: 'running' | 'done' | 'error';
  detail?: string;
};

export function CodexToolStep({ label, status, detail }: CodexToolStepProps) {
  return (
    <div className={`codex-tool-step status-${status}`}>
      <div className="codex-tool-step-dot" />
      <div className="codex-tool-step-body">
        <div className="codex-tool-step-label">{label}</div>
        {detail && <div className="codex-tool-step-detail">{detail}</div>}
      </div>
      <div className="codex-tool-step-status">
        {status === 'running' ? 'Running' : status === 'done' ? 'Done' : 'Error'}
      </div>
    </div>
  );
}
