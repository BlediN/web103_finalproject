export default function Step1Intro({ nextStep, currentStep, totalSteps }) {
  return (
    <div style={{ marginTop: "2rem" }}>
      <p style={{ fontSize: "0.95rem", color: "#666" }}>
        Step {currentStep} of {totalSteps}
      </p>

      <h1>Submit Your Layoff Story</h1>
      <p>
        This short form will guide you through sharing your layoff experience.
      </p>

      <div style={{ marginTop: "1.5rem" }}>
        <button onClick={nextStep}>Start</button>
      </div>
    </div>
  );
}