/**
 * Enterprise Google Analytics 4 Manager
 * Implements comprehensive GA4 tracking with enhanced ecommerce and conversion events
 * Follows Google 2024 best practices for professional service businesses
 */

import type {
  GA4Configuration
} from '../types/seo-types';

import {
  GA4_EVENTS,
  TRACKING_PARAMETERS,
  BUSINESS_PROFILE,
  PRIVACY_COMPLIANCE
} from '../constants/meta-constants';

// Global gtag function declaration

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

export class AnalyticsManager {
  private readonly measurementId: string;
  private readonly gtmId?: string;
  private readonly isDebugMode: boolean;
  private initialized: boolean = false;

  constructor(config: GA4Configuration) {
    this.measurementId = config.measurementId;
    this.gtmId = config.gtmId;
    this.isDebugMode = process.env.NODE_ENV === 'development';
    
    this.initializeGA4();
  }

  /**
   * Initialize Google Analytics 4 with enhanced configuration
   */
  private initializeGA4(): void {
    if (typeof window === 'undefined' || this.initialized) return;

    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(...args: unknown[]) {  
      window.dataLayer.push(args);  
    };

    // Configure GA4 with privacy compliance
    window.gtag('js', new Date());
    window.gtag('config', this.measurementId, {
      // Privacy settings
      anonymize_ip: PRIVACY_COMPLIANCE.ANONYMIZE_IP,
      cookie_expires: this.getCookieExpiration(),
      cookie_flags: 'SameSite=Strict;Secure',
      
      // Enhanced measurement settings
      enhanced_measurement: {
        scrolls: true,
        outbound_clicks: true,
        site_search: true,
        video_engagement: true,
        file_downloads: true,
        page_changes: true
      },
      
      // Custom parameters
      page_title: document.title,
      page_location: window.location.href,
      content_group1: this.getContentGroup(),
      content_group2: BUSINESS_PROFILE.LOCATION.CITY,
      content_group3: BUSINESS_PROFILE.TITLE,
      
      // Conversion tracking
      send_page_view: true,
      
      // Debug mode for development
      debug_mode: this.isDebugMode,
      
      // Custom dimensions
      custom_map: this.getCustomDimensionsMap()
    });

    // Initialize GTM if provided
    if (this.gtmId) {
      this.initializeGTM();
    }

    // Setup automatic event tracking
    this.setupAutomaticTracking();
    
    this.initialized = true;
    
    // Log initialization in debug mode
    if (this.isDebugMode) {
      console.log('🔧 GA4 Analytics Manager initialized', {
        measurementId: this.measurementId,
        gtmId: this.gtmId,
        privacyCompliance: PRIVACY_COMPLIANCE
      });
    }
  }

  /**
   * Initialize Google Tag Manager
   */
  private initializeGTM(): void {
    if (!this.gtmId) return;

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${this.gtmId}`;
    document.head.appendChild(script);

    window.gtag('config', this.gtmId);
  }

  /**
   * Track page view with enhanced metadata
   */
  public trackPageView(config: {
    pageTitle: string;
    pagePath: string;
    pageType: string;
    locale: string;
    contentGroup?: string;
  }): void {
    if (!this.initialized) return;

    const eventData = {
      page_title: config.pageTitle,
      page_location: `${window.location.origin}${config.pagePath}`,
      page_path: config.pagePath,
      content_group1: config.pageType,
      content_group2: config.locale,
      content_group3: config.contentGroup || BUSINESS_PROFILE.TITLE,
      language: config.locale,
      country: BUSINESS_PROFILE.LOCATION.COUNTRY_CODE,
      [TRACKING_PARAMETERS.PAGE_SECTION]: config.pageType
    };

    window.gtag('event', GA4_EVENTS.CORE.PAGE_VIEW, eventData);
    
    this.logEvent('Page View', eventData);
  }

  /**
   * Track business conversion events
   */
  public trackConversion(eventName: string, config: {
    value?: number;
    currency?: string;
    transactionId?: string;
    items?: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
    customParameters?: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  } = {}): void {
    if (!this.initialized) return;

    const conversionData = {
      value: config.value || 0,
      currency: config.currency || 'EUR',
      transaction_id: config.transactionId || this.generateTransactionId(),
      ...config.customParameters
    };

    // Send conversion event
    window.gtag('event', eventName, conversionData);
    
    // Send to conversion linker if configured
    window.gtag('event', 'conversion', {
      send_to: this.measurementId,
      ...conversionData
    });

    this.logEvent('Conversion', { eventName, ...conversionData });
  }

  /**
   * Track contact form submissions
   */
  public trackContactFormSubmission(formData: {
    formName: string;
    contactMethod: string;
    serviceType?: string;
    formSection?: string;
  }): void {
    this.trackConversion(GA4_EVENTS.BUSINESS.CONTACT_FORM_SUBMIT, {
      customParameters: {
        [TRACKING_PARAMETERS.FORM_NAME]: formData.formName,
        [TRACKING_PARAMETERS.CONTACT_METHOD]: formData.contactMethod,
        [TRACKING_PARAMETERS.SERVICE_TYPE]: formData.serviceType || 'general',
        [TRACKING_PARAMETERS.PAGE_SECTION]: formData.formSection || 'contact-form',
        form_submit_text: 'Contact Form Submission'
      },
      value: 95
    });
  }

  /**
   * Track service inquiries
   */
  public trackServiceInquiry(serviceData: {
    serviceType: string;
    inquiryMethod: string;
    pageSection?: string;
  }): void {
    this.trackConversion(GA4_EVENTS.BUSINESS.SERVICE_INQUIRY, {
      customParameters: {
        [TRACKING_PARAMETERS.SERVICE_TYPE]: serviceData.serviceType,
        [TRACKING_PARAMETERS.CONTACT_METHOD]: serviceData.inquiryMethod,
        [TRACKING_PARAMETERS.PAGE_SECTION]: serviceData.pageSection || 'services',
        inquiry_type: serviceData.serviceType
      },
      value: 95 // Base hourly rate
    });
  }

  /**
   * Track portfolio/project views
   */
  public trackPortfolioView(projectData: {
    projectName: string;
    projectType: string;
    viewDuration?: number;
  }): void {
    window.gtag('event', GA4_EVENTS.BUSINESS.PORTFOLIO_VIEW, {
      [TRACKING_PARAMETERS.PAGE_SECTION]: 'portfolio',
      project_name: projectData.projectName,
      project_type: projectData.projectType,
      engagement_time: projectData.viewDuration || 0,
      content_group1: 'portfolio'
    });

    this.logEvent('Portfolio View', projectData);
  }

  /**
   * Track CV/resume downloads
   */
  public trackCVDownload(downloadData: {
    fileFormat: string;
    downloadSource: string;
  }): void {
    this.trackConversion(GA4_EVENTS.BUSINESS.CV_DOWNLOAD, {
      customParameters: {
        [TRACKING_PARAMETERS.FILE_NAME]: `hilmar-cv.${downloadData.fileFormat}`,
        file_extension: downloadData.fileFormat,
        download_source: downloadData.downloadSource,
        [TRACKING_PARAMETERS.PAGE_SECTION]: 'cv-download'
      },
      value: 25 // Potential lead value
    });
  }

  /**
   * Track button clicks with enhanced data
   */
  public trackButtonClick(buttonData: {
    buttonId: string;
    buttonText: string;
    pageSection: string;
    buttonType?: string;
    destinationUrl?: string;
  }): void {
    window.gtag('event', GA4_EVENTS.ENGAGEMENT.CTA_CLICK, {
      [TRACKING_PARAMETERS.BUTTON_ID]: buttonData.buttonId,
      [TRACKING_PARAMETERS.BUTTON_TEXT]: buttonData.buttonText,
      [TRACKING_PARAMETERS.PAGE_SECTION]: buttonData.pageSection,
      button_type: buttonData.buttonType || 'cta',
      link_url: buttonData.destinationUrl || '',
      click_element: 'button'
    });

    this.logEvent('Button Click', buttonData);
  }

  /**
   * Track external link clicks
   */
  public trackExternalLinkClick(linkData: {
    linkUrl: string;
    linkText: string;
    linkType: string;
    pageSection: string;
  }): void {
    window.gtag('event', GA4_EVENTS.ENGAGEMENT.EXTERNAL_LINK_CLICK, {
      [TRACKING_PARAMETERS.LINK_URL]: linkData.linkUrl,
      [TRACKING_PARAMETERS.LINK_TEXT]: linkData.linkText,
      link_domain: new URL(linkData.linkUrl).hostname,
      link_type: linkData.linkType,
      [TRACKING_PARAMETERS.PAGE_SECTION]: linkData.pageSection,
      outbound: true
    });

    this.logEvent('External Link Click', linkData);
  }

  /**
   * Track social media clicks
   */
  public trackSocialClick(socialData: {
    platform: string;
    action: string;
    profileUrl: string;
    pageSection: string;
  }): void {
    window.gtag('event', GA4_EVENTS.ENGAGEMENT.SOCIAL_CLICK, {
      social_network: socialData.platform,
      social_action: socialData.action,
      social_target: socialData.profileUrl,
      [TRACKING_PARAMETERS.PAGE_SECTION]: socialData.pageSection
    });

    this.logEvent('Social Click', socialData);
  }

  /**
   * Track consultation booking attempts
   */
  public trackConsultationRequest(bookingData: {
    serviceType: string;
    preferredDate?: string;
    contactMethod: string;
    formStep?: string;
  }): void {
    this.trackConversion(GA4_EVENTS.BUSINESS.CONSULTATION_REQUEST, {
      customParameters: {
        [TRACKING_PARAMETERS.SERVICE_TYPE]: bookingData.serviceType,
        [TRACKING_PARAMETERS.CONTACT_METHOD]: bookingData.contactMethod,
        preferred_date: bookingData.preferredDate || '',
        form_step: bookingData.formStep || 'initial',
        [TRACKING_PARAMETERS.PAGE_SECTION]: 'booking'
      },
      value: 85 // Consultation rate
    });
  }

  /**
   * Track user engagement with scroll depth
   */
  public trackScrollEngagement(scrollData: {
    scrollDepth: number;
    pageSection: string;
    timeOnPage: number;
  }): void {
    // Only track significant scroll milestones
    if (scrollData.scrollDepth % 25 !== 0) return;

    window.gtag('event', GA4_EVENTS.CORE.SCROLL, {
      scroll_depth: scrollData.scrollDepth,
      [TRACKING_PARAMETERS.PAGE_SECTION]: scrollData.pageSection,
      engagement_time_msec: scrollData.timeOnPage,
      scroll_milestone: `${scrollData.scrollDepth}%`
    });

    if (scrollData.scrollDepth >= 75) {
      this.logEvent('Deep Engagement', scrollData);
    }
  }

  /**
   * Setup automatic event tracking
   */
  private setupAutomaticTracking(): void {
    // Track clicks on email links
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const link = target.closest('a');
      
      if (link?.href.startsWith('mailto:')) {
        this.trackExternalLinkClick({
          linkUrl: link.href,
          linkText: link.textContent || 'Email Link',
          linkType: 'email',
          pageSection: this.getCurrentPageSection()
        });
      }
      
      if (link?.href.startsWith('tel:')) {
        window.gtag('event', GA4_EVENTS.ENGAGEMENT.PHONE_CLICK, {
          phone_number: link.href.replace('tel:', ''),
          [TRACKING_PARAMETERS.PAGE_SECTION]: this.getCurrentPageSection(),
          contact_method: 'phone'
        });
      }
    });

    // Track form interactions
    document.addEventListener('focus', (event) => {
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        const form = target.closest('form');
        if (form) {
          window.gtag('event', GA4_EVENTS.CORE.FORM_START, {
            [TRACKING_PARAMETERS.FORM_NAME]: form.id || 'unnamed-form',
            [TRACKING_PARAMETERS.PAGE_SECTION]: this.getCurrentPageSection()
          });
        }
      }
    }, { once: true });
  }

  /**
   * Get current page section for context
   */
  private getCurrentPageSection(): string {
    const path = window.location.pathname;
    if (path.includes('/about')) return 'about';
    if (path.includes('/services')) return 'services';
    if (path.includes('/projects')) return 'projects';
    if (path.includes('/contact')) return 'contact';
    if (path.includes('/book')) return 'booking';
    if (path.includes('/faq')) return 'faq';
    return 'homepage';
  }

  /**
   * Get content group for categorization
   */
  private getContentGroup(): string {
    const path = window.location.pathname;
    if (path.includes('/en/')) return 'english';
    if (path.includes('/nl/')) return 'dutch';
    return 'default';
  }

  /**
   * Get custom dimensions mapping
   */
  private getCustomDimensionsMap(): Record<string, string> {
    return {
      page_type: 'custom_dimension_1',
      user_language: 'custom_dimension_2',
      service_interest: 'custom_dimension_3',
      engagement_level: 'custom_dimension_4',
      conversion_source: 'custom_dimension_5'
    };
  }

  /**
   * Get cookie expiration based on GDPR compliance
   */
  private getCookieExpiration(): number {
    // Convert months to seconds
    const months = parseInt(PRIVACY_COMPLIANCE.DATA_RETENTION.replace(' months', ''));
    return months * 30 * 24 * 60 * 60; // months to seconds
  }

  /**
   * Generate unique transaction ID
   */
  private generateTransactionId(): string {
    return `hvd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Log events in debug mode
   */
  private logEvent(eventType: string, data: any): void { // eslint-disable-line @typescript-eslint/no-explicit-any
    if (this.isDebugMode) {
      console.log(`📊 GA4 Event: ${eventType}`, data);
    }
  }

  /**
   * Get analytics configuration for debugging
   */
  public getConfig(): GA4Configuration {
    return {
      measurementId: this.measurementId,
      gtmId: this.gtmId,
      enableEcommerce: true,
      enableEnhancedMeasurement: true,
      customDimensions: [
        { name: 'Page Type', parameterName: 'page_type', scope: 'EVENT' },
        { name: 'User Language', parameterName: 'user_language', scope: 'USER' },
        { name: 'Service Interest', parameterName: 'service_interest', scope: 'EVENT' },
        { name: 'Engagement Level', parameterName: 'engagement_level', scope: 'USER' },
        { name: 'Conversion Source', parameterName: 'conversion_source', scope: 'EVENT' }
      ],
      conversionEvents: [
        GA4_EVENTS.BUSINESS.CONTACT_FORM_SUBMIT,
        GA4_EVENTS.BUSINESS.SERVICE_INQUIRY,
        GA4_EVENTS.BUSINESS.CONSULTATION_REQUEST,
        GA4_EVENTS.BUSINESS.CV_DOWNLOAD
      ]
    };
  }
} 