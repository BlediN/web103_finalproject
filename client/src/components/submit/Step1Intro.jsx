import { useState } from "react";

export default function Step1Intro({ nextStep, currentStep, totalSteps }) {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    nextStep();
  };

  return (
    <>
      <p className="step-text">
        Step {currentStep} of {totalSteps}
      </p>

      <h1 className="title">Submit Your Layoff Story</h1>
      <p className="subtitle">
        This short form will guide you through sharing your experience.
      </p>

      <div className="button-row">
        <div />
        <button onClick={handleClick} disabled={isClicked}>
          Start
        </button>
      </div>
    </>
  );
}