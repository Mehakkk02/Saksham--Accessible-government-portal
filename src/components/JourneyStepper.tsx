/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React from 'react';
import {
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Lock,
} from 'lucide-react';
import {
  JOURNEY_STEPS,
  isBookHelpNeeded,
  checkStepReachability,
  isStepCompleted,
  normalizeJourneyStep,
  type JourneyStepId,
} from '../utils/journey';
import { useSakshamStore, type ScreenId } from '../store/useSakshamStore';

interface JourneyStepperProps {
  activeScreen: ScreenId;
  onNavigate: (step: JourneyStepId) => void;
}

export const JourneyStepper: React.FC<JourneyStepperProps> = ({
  activeScreen,
  onNavigate,
}) => {
  const {
    barriers,
    scanState,
    bookingStatus,
    documents,
  } = useSakshamStore();

  const scanPassed = scanState === 'success';
  const journeyContext = {
    barriers,
    scanPassed,
    bookingStatus,
    documents,
  };

  // Canonical active step among the 5 steps: Barriers -> Document -> Book help -> Track -> Summary
  const currentStepId: JourneyStepId = normalizeJourneyStep(activeScreen);
  const currentStepIndex = JOURNEY_STEPS.findIndex((s) => s.id === currentStepId);
  const currentStepObj = JOURNEY_STEPS[currentStepIndex] || JOURNEY_STEPS[0];

  const handleStepClick = (stepId: JourneyStepId) => {
    const reachability = checkStepReachability(stepId, journeyContext);
    if (reachability.allowed) {
      onNavigate(stepId);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      const prevStep = JOURNEY_STEPS[currentStepIndex - 1];
      handleStepClick(prevStep.id);
    }
  };

  const handleNext = () => {
    if (currentStepIndex < JOURNEY_STEPS.length - 1) {
      const nextStep = JOURNEY_STEPS[currentStepIndex + 1];
      handleStepClick(nextStep.id);
    }
  };

  const bookHelpNeeded = isBookHelpNeeded(barriers);

  return (
    <nav
      aria-label="Application Journey Progress"
      className="w-full flex items-center justify-center"
    >
      {/* ------------------------------------------------------------- */}
      {/* Mobile Stepper: Collapsed "Step X of 5: Name" with Back/Next */}
      {/* ------------------------------------------------------------- */}
      <div className="flex md:hidden items-center justify-between gap-2 w-full py-1.5 px-2 bg-slate-100/90 rounded-2xl border border-slate-200/80">
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentStepIndex === 0}
          aria-label="Previous step"
          className="p-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">
              Step {currentStepIndex + 1} of 5:
            </span>
            <span className="text-xs font-extrabold text-slate-900">
              {currentStepObj.label}
            </span>
            {currentStepObj.id === 'book-help' && !bookHelpNeeded && (
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-bold">
                Skipped
              </span>
            )}
          </div>
          <span className="text-[10px] text-slate-500 line-clamp-1 max-w-[200px]">
            {currentStepObj.description}
          </span>
        </div>

        <button
          type="button"
          onClick={handleNext}
          disabled={
            currentStepIndex === JOURNEY_STEPS.length - 1 ||
            !checkStepReachability(JOURNEY_STEPS[currentStepIndex + 1]?.id, journeyContext).allowed
          }
          aria-label="Next step"
          className="p-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* Desktop Stepper: 5-step journey with status icons & skip badge */}
      {/* ------------------------------------------------------------- */}
      <ol className="hidden md:flex items-center gap-1 p-1.5 rounded-2xl bg-slate-100/90 border border-slate-200/70 shadow-xs">
        {JOURNEY_STEPS.map((step, idx) => {
          const isCurrent = currentStepId === step.id;
          const isCompleted = isStepCompleted(step.id, currentStepId, journeyContext);
          const reachability = checkStepReachability(step.id, journeyContext);
          const isSkippedBookHelp = step.id === 'book-help' && !bookHelpNeeded;

          return (
            <React.Fragment key={step.id}>
              {idx > 0 && (
                <li aria-hidden="true" className="flex items-center px-0.5 text-slate-300">
                  <ChevronRight className="w-3.5 h-3.5" />
                </li>
              )}

              <li>
                <button
                  type="button"
                  onClick={() => handleStepClick(step.id)}
                  disabled={!reachability.allowed}
                  aria-current={isCurrent ? 'step' : undefined}
                  aria-disabled={!reachability.allowed}
                  title={
                    reachability.allowed
                      ? isSkippedBookHelp
                        ? 'Book help: Skipped (not needed). Help request (demo): the hospital still decides the date. You can still open it.'
                        : step.id === 'book-help'
                        ? `${step.stepNumber}. Book help: Help request (demo): the hospital still decides the date.`
                        : `${step.stepNumber}. ${step.label} (${step.description})`
                      : reachability.reason || 'This step is locked until prior steps are completed'
                  }
                  className={`group relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isCurrent
                      ? 'bg-white text-blue-700 shadow-sm border border-blue-200'
                      : !reachability.allowed
                      ? 'text-slate-400 opacity-60 cursor-not-allowed hover:bg-transparent'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  {/* Step status icon: not color alone */}
                  <span
                    className={`flex items-center justify-center w-4 h-4 rounded-full text-[10px] shrink-0 font-bold ${
                      isCompleted
                        ? 'bg-emerald-600 text-white'
                        : isCurrent
                        ? 'bg-blue-600 text-white'
                        : !reachability.allowed
                        ? 'bg-slate-300 text-slate-600'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {isCompleted ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                        <span className="sr-only">(Completed)</span>
                      </>
                    ) : !reachability.allowed ? (
                      <>
                        <Lock className="w-2.5 h-2.5 text-slate-600" />
                        <span className="sr-only">(Locked)</span>
                      </>
                    ) : (
                      step.stepNumber
                    )}
                  </span>

                  {/* Step Name */}
                  <span className="whitespace-nowrap">{step.label}</span>

                  {/* "Skipped (not needed)" badge for Book help */}
                  {isSkippedBookHelp && (
                    <span
                      className="text-[9px] px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-800 font-semibold border border-amber-200 whitespace-nowrap"
                      title="Skipped because travel or caregiver was not chosen. Help request (demo): the hospital still decides the date."
                    >
                      Skipped (not needed)
                    </span>
                  )}
                </button>
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

export default JourneyStepper;
