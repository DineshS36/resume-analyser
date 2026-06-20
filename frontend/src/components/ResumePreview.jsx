'use client';

import React from 'react';
import {
  ClassicTemplate,
  ModernTemplate,
  MinimalTemplate,
  CreativeTemplate,
  ExecutiveTemplate,
  TechnicalTemplate,
  AcademicTemplate,
  TwoColumnTemplate,
  StartupTemplate,
  ConsultantTemplate,
  MedicalTemplate,
  FinanceTemplate
} from './themes';

export default function ResumePreview({ data, template }) {
  return (
    <div className="bg-white shadow-sm">
      {template === 'classic' && <ClassicTemplate data={data} />}
      {template === 'modern' && <ModernTemplate data={data} />}
      {template === 'minimal' && <MinimalTemplate data={data} />}
      {template === 'creative' && <CreativeTemplate data={data} />}
      {template === 'executive' && <ExecutiveTemplate data={data} />}
      {template === 'technical' && <TechnicalTemplate data={data} />}
      {template === 'academic' && <AcademicTemplate data={data} />}
      {template === 'two-column' && <TwoColumnTemplate data={data} />}
      {template === 'startup' && <StartupTemplate data={data} />}
      {template === 'consultant' && <ConsultantTemplate data={data} />}
      {template === 'medical' && <MedicalTemplate data={data} />}
      {template === 'finance' && <FinanceTemplate data={data} />}
    </div>
  );
}
