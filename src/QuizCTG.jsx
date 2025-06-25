import React, { useState } from "react";
import TutorialICTG from "./TutorialUsoICTG";
import QuizCTG from "./QuizCTG";
import CertificateGenerator from "./CertificateGenerator";

function App() {
  const [tutorialDone, setTutorialDone] = useState(false);
  const [quizDone, setQuizDone] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      {!tutorialDone && <TutorialICTG onFinish={() => setTutorialDone(true)} />}
      {tutorialDone && !quizDone && <QuizCTG onFinish={() => setQuizDone(true)} />}
      {tutorialDone && quizDone && <CertificateGenerator />}
    </div>
  );
}

export default App;
