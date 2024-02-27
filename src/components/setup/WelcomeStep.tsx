import { Dispatch, SetStateAction } from 'react';
import { Button } from '../ui/button';

interface WelcomeStepProps {
  setStep: Dispatch<SetStateAction<number>>
}

export default function WelcomeStep({ setStep } : WelcomeStepProps) {
  return (
    <>
      <h1>Welcome to Music Player!</h1>
      <p>{`Let's configure a few things first.`}</p>
      <Button onClick={() => setStep(1)}>Get Started</Button>
    </>
  )
}