import React from "react";
import { Link } from "react-router-dom";

export type StepStatus = "complete" | "current" | "upcoming";

export type Step = {
    id: string;
    label: string;
    href: string;
    status: StepStatus;
};

interface TabProgressProps {
    steps: Step[];
    className?: string;
}

const TabProgress = ({ steps, className }: TabProgressProps) => {
    return (
        <nav className={`mx-auto w-full max-w-7xl px-4 ${className || ""}`}>
            <ol
                role="list"
                className="flex items-center justify-between"
            >
                {steps.map((step, stepIdx) => (
                    <li key={step.id} className="relative flex items-center">
                        <Link
                            to={step.href}
                            className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold ${step.status === "complete"
                                ? "bg-purple-600 text-white"
                                : step.status === "current"
                                    ? "border-2 border-purple-600 bg-white dark:bg-gray-900 text-purple-600 dark:text-purple-400"
                                    : "border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400"
                                }`}
                            aria-current={step.status === "current" ? "step" : undefined}
                        >
                            {step.status === "complete" ? (
                                <span className="flex items-center justify-center">
                                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </span>
                            ) : (
                                <span>{stepIdx + 1}</span>
                            )}
                        </Link>

                        {stepIdx !== steps.length - 1 && (
                            <div className="h-0.5 w-16 md:w-24 lg:w-36 bg-gray-300 dark:bg-gray-700" />
                        )}

                        <div className="absolute top-14 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm font-medium text-gray-700 dark:text-gray-300">
                            {step.label}
                        </div>
                    </li>
                ))}
            </ol>
        </nav>
    );
};

export default TabProgress; 