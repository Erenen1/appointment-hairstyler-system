'use client';
import React from 'react';
import { StepperProps } from '../types/StepperType';


export default function Stepper({ currentStep, steps }: StepperProps) {
    return (
        <ol className="lg:flex items-center w-full space-y-4 lg:space-y-0 lg:space-x-4 mb-6">
            {steps.map((title, index) => {
                const stepNum = index + 1;
                const isActive = currentStep === stepNum;
                const isCompleted = currentStep > stepNum;

                return (
                    <li key={stepNum} className="relative">
                        <div className="flex items-center font-medium w-full">
                            <span
                                className={`w-6 h-6 lg:w-8 lg:h-8 rounded-full flex justify-center items-center mr-3 text-sm border
                    ${isActive
                                        ? 'bg-indigo-600 text-white border-transparent'
                                        : isCompleted
                                            ? 'bg-indigo-100 text-indigo-600 border-indigo-200'
                                            : 'bg-gray-50 text-gray-900 border-gray-200'
                                    }`}
                            >
                                {stepNum}
                            </span>
                            <div>
                                <h4
                                    className={`text-base ${isActive ? 'text-indigo-600' : 'text-gray-900'
                                        }`}
                                >
                                    {title}
                                </h4>
                            </div>
                        </div>
                    </li>
                );
            })}
        </ol>

    );
}
