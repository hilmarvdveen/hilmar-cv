/**
 * Structured Data Component
 * Renders JSON-LD structured data for comprehensive SEO
 * Implements Google 2024 best practices with E-E-A-T focus
 */

"use client";

import { useEffect } from "react";
import type { JsonLdSchema } from "@/lib/seo";

interface StructuredDataProps {
  schemas: JsonLdSchema[];
  className?: string;
}

export function StructuredData({ schemas, className }: StructuredDataProps) {
  useEffect(() => {
    // Optional: Log structured data in development mode
    if (process.env.NODE_ENV === "development") {
      console.log("🔧 Structured Data Loaded:", schemas);
    }
  }, [schemas]);

  if (!schemas || schemas.length === 0) {
    return null;
  }

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          className={className}
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema, null, 2),
          }}
        />
      ))}
    </>
  );
}

/**
 * Single schema structured data component
 */
interface SingleStructuredDataProps {
  schema: JsonLdSchema;
  className?: string;
}

export function SingleStructuredData({
  schema,
  className,
}: SingleStructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      className={className}
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema, null, 2),
      }}
    />
  );
}

/**
 * Raw structured data component for pre-generated JSON-LD strings
 */
interface RawStructuredDataProps {
  jsonLd: string;
  className?: string;
}

export function RawStructuredData({
  jsonLd,
  className,
}: RawStructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      className={className}
      dangerouslySetInnerHTML={{
        __html: jsonLd,
      }}
    />
  );
}
