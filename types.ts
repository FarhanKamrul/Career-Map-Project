export interface UserProfile {
  name: string;
  targetRole: string;
  targetLocation: string;
  githubLink: string;
  portfolioLink: string;
  passionProblem: string; // The problem they care about
  resumeFile: File | null;
  resumeBase64: string | null;
  resumeMimeType: string | null;
}

export enum AppStep {
  LANDING,
  INPUT_DETAILS,
  INPUT_RESUME,
  LOADING,
  RESULT,
  ERROR
}

export interface RoadmapPhase {
  title: string;
  duration: string;
  description: string;
  actionItems: string[];
  skillFocus: string[];
}

export interface CareerRoadmap {
  heroOrigin: string; // Current state summary
  missionObjective: string; // Target role analysis
  theVillain: string; // Gaps/Weaknesses
  superWeaponProject: {
    title: string;
    description: string;
    techStack: string[];
    impact: string;
  };
  phases: RoadmapPhase[];
  localContextTip: string;
}
