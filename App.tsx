import React, { useState } from 'react';
import { AppStep, CareerRoadmap, UserProfile } from './types';
import { generateRoadmap } from './services/geminiService';
import { ComicButton, ComicInput, ComicPanel, ComicTextArea, SpeechBubble } from './components/ComicUI';
import { FileUp, Target, MapPin, Briefcase, Rocket, AlertTriangle, Github, Globe } from 'lucide-react';

const INITIAL_PROFILE: UserProfile = {
  name: '',
  targetRole: '',
  targetLocation: '',
  githubLink: '',
  portfolioLink: '',
  passionProblem: '',
  resumeFile: null,
  resumeBase64: null,
  resumeMimeType: null,
};

export default function App() {
  const [step, setStep] = useState<AppStep>(AppStep.LANDING);
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [roadmap, setRoadmap] = useState<CareerRoadmap | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        setProfile(prev => ({
          ...prev,
          resumeFile: file,
          resumeBase64: base64String,
          resumeMimeType: file.type
        }));
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    setStep(AppStep.LOADING);
    try {
      const result = await generateRoadmap(profile);
      setRoadmap(result);
      setStep(AppStep.RESULT);
    } catch (err: any) {
      console.error(err);
      setError("The Oracle is momentarily offline (API Error). Try again!");
      setStep(AppStep.ERROR);
    }
  };

  // --- Views ---

  const renderLanding = () => (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full text-center space-y-8 animate-fade-in-up">
        <h1 className="font-display text-7xl md:text-9xl text-comic-black drop-shadow-[4px_4px_0px_#FFFFFF]">
          HERO<span className="text-comic-magenta">PATH</span>
        </h1>
        <h2 className="font-comic text-2xl md:text-4xl bg-comic-yellow inline-block px-4 py-2 border-4 border-comic-black transform -rotate-1 shadow-comic">
          Forge Your Tech Destiny!
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8 mt-12 text-left">
          <ComicPanel variant="cyan" className="transform rotate-1">
            <h3 className="font-display text-2xl mb-2">Identify Your Origin</h3>
            <p className="font-comic text-lg">Upload your resume to analyze your current stats and abilities.</p>
          </ComicPanel>
          <ComicPanel variant="magenta" className="transform -rotate-1">
            <h3 className="font-display text-2xl text-white mb-2">Choose Your Mission</h3>
            <p className="font-comic text-lg text-white">Target a role and defeat the skill gaps standing in your way.</p>
          </ComicPanel>
        </div>

        <div className="mt-12">
          <ComicButton onClick={() => setStep(AppStep.INPUT_DETAILS)} className="text-2xl px-12 py-6">
            Start Your Journey
          </ComicButton>
        </div>
      </div>
    </div>
  );

  const renderInputDetails = () => (
    <div className="min-h-screen flex items-center justify-center p-4">
      <ComicPanel title="Mission Parameters" className="max-w-2xl w-full">
        <div className="space-y-6">
          <ComicInput 
            name="name" 
            label="Hero Name" 
            placeholder="e.g. Alex Chen" 
            value={profile.name} 
            onChange={handleInputChange} 
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ComicInput 
              name="targetRole" 
              label="Target Role" 
              placeholder="e.g. Senior PM, AI Engineer" 
              value={profile.targetRole} 
              onChange={handleInputChange} 
            />
            <ComicInput 
              name="targetLocation" 
              label="Target Location" 
              placeholder="e.g. London, NYC, Remote" 
              value={profile.targetLocation} 
              onChange={handleInputChange} 
            />
          </div>
          <ComicTextArea 
            name="passionProblem" 
            label="The Problem You Must Solve (Your Passion)" 
            placeholder="What keeps you up at night? e.g., 'Financial literacy for teens' or 'Sustainable food supply'" 
            rows={3}
            value={profile.passionProblem} 
            onChange={handleInputChange} 
          />
          
          <div className="flex justify-between pt-4">
            <ComicButton variant="secondary" onClick={() => setStep(AppStep.LANDING)}>Back</ComicButton>
            <ComicButton 
              onClick={() => {
                if(profile.name && profile.targetRole) setStep(AppStep.INPUT_RESUME);
                else alert("Identify yourself and your mission first!");
              }}
            >
              Next Step
            </ComicButton>
          </div>
        </div>
      </ComicPanel>
    </div>
  );

  const renderInputResume = () => (
    <div className="min-h-screen flex items-center justify-center p-4">
      <ComicPanel title="Equipment Check" variant="yellow" className="max-w-2xl w-full">
        <div className="space-y-6">
          
          <div className="border-4 border-dashed border-comic-black bg-white p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors relative">
             <input 
              type="file" 
              accept=".pdf,.txt,.md" 
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center">
              <FileUp size={48} className="mb-4 text-comic-black" />
              <h3 className="font-display text-xl">Upload Resume / CV</h3>
              <p className="font-comic text-sm opacity-70">PDF, TXT, or MD supported</p>
              {profile.resumeFile && (
                <div className="mt-4 bg-comic-cyan px-4 py-1 border-2 border-comic-black font-bold transform -rotate-2">
                  {profile.resumeFile.name}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ComicInput 
              name="githubLink" 
              label="GitHub Link (Optional)" 
              placeholder="https://github.com/..." 
              value={profile.githubLink} 
              onChange={handleInputChange} 
            />
            <ComicInput 
              name="portfolioLink" 
              label="Portfolio Link (Optional)" 
              placeholder="https://..." 
              value={profile.portfolioLink} 
              onChange={handleInputChange} 
            />
          </div>

          <div className="flex justify-between pt-4">
            <ComicButton variant="secondary" onClick={() => setStep(AppStep.INPUT_DETAILS)}>Back</ComicButton>
            <ComicButton variant="success" onClick={handleSubmit}>
              Generate Roadmap!
            </ComicButton>
          </div>
        </div>
      </ComicPanel>
    </div>
  );

  const renderLoading = () => (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
       <div className="animate-bounce mb-8">
         <Rocket size={80} className="text-comic-magenta drop-shadow-comic" />
       </div>
       <h2 className="font-display text-4xl mb-4">Consulting the Oracle...</h2>
       <p className="font-comic text-xl max-w-md">
         Our AI sidekicks are analyzing your stats and preparing your battle plan. Hang tight, hero!
       </p>
    </div>
  );

  const renderError = () => (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <AlertTriangle size={80} className="text-red-500 mb-6 drop-shadow-comic" />
      <h2 className="font-display text-4xl mb-4">Mission Aborted!</h2>
      <p className="font-comic text-xl text-red-600 bg-white border-2 border-red-600 p-4 mb-8">
        {error}
      </p>
      <ComicButton onClick={() => setStep(AppStep.INPUT_DETAILS)}>Try Again</ComicButton>
    </div>
  );

  const renderResult = () => {
    if (!roadmap) return null;

    return (
      <div className="min-h-screen p-4 pb-20">
        <header className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center mb-12 border-b-4 border-comic-black pb-6 bg-white p-6 shadow-comic sticky top-0 z-50">
          <div>
            <h1 className="font-display text-4xl">The Saga of {profile.name}</h1>
            <p className="font-comic text-lg text-gray-600">Target: {profile.targetRole} @ {profile.targetLocation}</p>
          </div>
          <ComicButton variant="secondary" onClick={() => window.print()} className="mt-4 md:mt-0 text-sm py-2 px-4">Print Issue #1</ComicButton>
        </header>

        <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Left Column: Context & Villain */}
          <div className="md:col-span-4 space-y-8">
            <ComicPanel title="Origin Story" variant="white">
              <p className="font-comic text-lg leading-relaxed">{roadmap.heroOrigin}</p>
            </ComicPanel>

            <ComicPanel title="The Villain (Gaps)" variant="magenta" className="text-white">
              <p className="font-comic text-lg leading-relaxed">{roadmap.theVillain}</p>
            </ComicPanel>

            <ComicPanel title="Local Intel" variant="cyan">
              <div className="flex items-start gap-3">
                <MapPin className="shrink-0 mt-1" />
                <p className="font-comic text-lg">{roadmap.localContextTip}</p>
              </div>
            </ComicPanel>

            <ComicPanel title="Super Weapon" variant="yellow" className="border-dashed">
              <h4 className="font-display text-2xl mb-2">{roadmap.superWeaponProject.title}</h4>
              <p className="font-comic text-md mb-4">{roadmap.superWeaponProject.description}</p>
              <div className="bg-white border-2 border-comic-black p-3 mb-4">
                <p className="font-bold font-comic text-sm uppercase mb-1">Impact Damage:</p>
                <p className="font-comic text-sm italic">{roadmap.superWeaponProject.impact}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {roadmap.superWeaponProject.techStack.map((tech, i) => (
                  <span key={i} className="bg-comic-black text-white px-2 py-1 font-display text-sm transform hover:scale-110 transition-transform">
                    {tech}
                  </span>
                ))}
              </div>
            </ComicPanel>
          </div>

          {/* Right Column: Roadmap Phases */}
          <div className="md:col-span-8 space-y-12">
            
            <SpeechBubble direction="left">
               Listen up, hero! Here is your mission plan to conquer the {profile.targetRole} role. Follow it precisely!
            </SpeechBubble>

            <div className="relative border-l-8 border-comic-black ml-4 md:ml-8 pl-8 md:pl-12 space-y-12 py-8">
              {roadmap.phases.map((phase, index) => (
                <div key={index} className="relative">
                  {/* Timeline Dot */}
                  <div className="absolute -left-[54px] md:-left-[70px] top-0 w-12 h-12 bg-comic-yellow border-4 border-comic-black rounded-full flex items-center justify-center font-display text-xl z-10">
                    {index + 1}
                  </div>
                  
                  <ComicPanel className="transform hover:-rotate-1 transition-transform">
                    <div className="flex justify-between items-start mb-4 border-b-2 border-comic-black pb-2">
                      <h3 className="font-display text-3xl">{phase.title}</h3>
                      <span className="bg-comic-black text-white font-comic font-bold px-3 py-1 text-sm transform rotate-2">
                        {phase.duration}
                      </span>
                    </div>
                    
                    <p className="font-comic text-lg mb-6">{phase.description}</p>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-display text-xl mb-2 flex items-center gap-2">
                          <Target size={20} /> Actions
                        </h4>
                        <ul className="list-disc list-inside font-comic space-y-2">
                          {phase.actionItems.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-display text-xl mb-2 flex items-center gap-2">
                          <Briefcase size={20} /> Skills
                        </h4>
                        <div className="flex flex-wrap gap-2">
                           {phase.skillFocus.map((skill, i) => (
                             <span key={i} className="border-2 border-comic-black px-2 py-0.5 bg-gray-100 font-comic text-sm">
                               {skill}
                             </span>
                           ))}
                        </div>
                      </div>
                    </div>
                  </ComicPanel>
                </div>
              ))}
            </div>

            <div className="flex justify-center pt-8">
              <ComicButton onClick={() => setStep(AppStep.LANDING)} variant="success" className="text-2xl px-12 py-6 animate-pulse">
                Mission Complete? Start New.
              </ComicButton>
            </div>

          </div>
        </main>
      </div>
    );
  };

  return (
    <>
      {step === AppStep.LANDING && renderLanding()}
      {step === AppStep.INPUT_DETAILS && renderInputDetails()}
      {step === AppStep.INPUT_RESUME && renderInputResume()}
      {step === AppStep.LOADING && renderLoading()}
      {step === AppStep.RESULT && renderResult()}
      {step === AppStep.ERROR && renderError()}
    </>
  );
}
