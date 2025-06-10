/**
 * Enterprise SEO System - Main Export Barrel
 * Comprehensive SEO solution for professional services
 * Implements Google 2024 best practices with E-E-A-T focus
 */

// Core engines and managers
export { SEOEngine } from './core/seo-engine';
export { MetadataGenerator } from './core/metadata-generator';
export { SchemaGenerator } from './core/schema-generator';
export { AnalyticsManager } from './core/analytics-manager';

// Factory and utilities
export { SEOFactory } from './factory';
export { SEOUtils } from './utils';

// React hooks
export { useSEO } from './hooks/useSeo';

// Constants and configuration
export * from './constants/meta-constants';

// Type definitions
export type * from './types/seo-types';

// Default export - SEO Engine
export { default as defaultSEOEngine } from './factory'; 