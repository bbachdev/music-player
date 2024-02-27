import { Dispatch, SetStateAction } from 'react';
import { Button } from '../ui/button';

interface WelcomeStepProps {
  setStep: Dispatch<SetStateAction<number>>
}

export default function WelcomeStep({ setStep } : WelcomeStepProps) {
  return (
    <>
      <h1 className={`font-semibold text-2xl mb-2`}>Welcome to Music Player!</h1>
      <p className={`mb-4`}>{`Let's configure a few things first.`}</p>
      <Button onClick={() => setStep(1)}>Get Started</Button>
    </>
  )
}