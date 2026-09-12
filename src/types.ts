export type PromptVersion = 'standard' | 'compact' | 'workspace';

export interface PromptCriterion {
  id: number;
  label: string;
  originalRequirement: string;
  systemInstructionMapping: string;
  keyRule: string;
}

export interface CustomizerSettings {
  includeA11y: boolean;
  vendorPath: string;
  bootstrapVersion: string;
  strictNegativeConstraints: boolean;
  twoStageOutput: boolean;
}
