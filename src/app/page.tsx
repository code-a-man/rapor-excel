"use client";

import React from "react";
import FileUpload from "@/components/FileUpload";
import ColumnSelection from "@/components/ColumnSelection";
import DataCleanup from "@/components/DataCleanup";

import { AppProvider, useAppContext } from "@/contexts/AppContext";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import Overview from "@/components/Overview";
import Link from "next/link";

const HomePageContent = () => {
  const { step, setStep } = useAppContext();
  const steps = [
    "Dosya Seçimi",
    "Veri Sütunu Seçimi",
    "Veri Ayıklaması",
    "Önizleme",
  ];
  const stepComponents = [FileUpload, ColumnSelection, DataCleanup, Overview];
  return (
    <main className="container  mx-auto flex flex-col items-center gap-2">
      <Card className="p-4 w-[80%] mx-auto">
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            {steps.slice(0, step).map((stepName, index) => (
              <React.Fragment key={index}>
                <BreadcrumbItem
                  className="text-primary"
                  onClick={() => setStep(index + 1)}
                  // active={step === index + 1}
                >
                  {stepName}
                </BreadcrumbItem>
                {index !== steps.length - 1 && (
                  <BreadcrumbSeparator className="text-primary" />
                )}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>

        <div>{stepComponents[step - 1]()}</div>
      </Card>
      <footer>
        <p className="text-muted-foreground">
          Made with ❤️ by{" "}
          <Link
            href="https://codeaman.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Code a Man
          </Link>
        </p>
      </footer>
    </main>
  );
};

export default function HomePage() {
  return (
    <AppProvider>
      <HomePageContent />
    </AppProvider>
  );
}
