export enum WorkMode {
  Remote = "workMode.remote",
  OnSite = "workMode.onSite",
  Hybrid = "workMode.hybrid",
}

export enum Language {
  Dutch = "language.dutch",
  English = "language.english",
}

export enum Tech {
  HTML5 = "tech.html5",
  CSS3 = "tech.css3",
  JavaScript = "tech.javascript",
  TypeScript = "tech.typescript",
  Angular = "tech.angular",
  React = "tech.react",
  Vue = "tech.vue",
  WebComponents = "tech.webComponents",
  Stencil = "tech.stencil",
  WCAG = "tech.wcag",
  Playwright = "tech.playwright",
  Cypress = "tech.cypress",
  REST = "tech.rest",
  OpenAPI = "tech.openapi",
  JWT = "tech.jwt",
  Java8 = "tech.java8",
  Maven = "tech.maven",
  Gitlabs = "tech.gitlabs",
  Git = "tech.git",
  NPM = "tech.npm",
  Jenkins = "tech.jenkins",
  Tekton = "tech.tekton",
  ArgoCD = "tech.argocd",
  SPLUNK = "tech.splunk",
  Docker = "tech.docker",
  SonarQube = "tech.sonarqube",
  ESLint = "tech.eslint",
  Storybook = "tech.storybook",
  Confluence = "tech.confluence",
  Jira = "tech.jira",
  MySQL = "tech.mysql",
  CSharp = "tech.csharp",
  Neo4J = "tech.Neo4J",
  Redux = "tech.Redux",
  WPF = "tech.WPF",
  MVVM = "tech.MVVM",
  WebForms = "tech.WebForms",
  API = "tech.API",
  Azure = "tech.Azure",
  MSSQL = "tech.MSSQL",
  TailwindCSS = "tech.TailwindCSS",
  NextJS = "tech.NextJS",
  RxJS = "tech.RxJS",
  BEM = "tech.BEM",
  SCSS = "tech.SCSS",
  SVG = "tech.SVG",
  AWSLambda = "tech.AWSLambda",
  GitLabCI = "tech.GitLabCI",
  Prettier = "tech.Prettier",
  HeadlessCMS = "tech.HeadlessCMS",
  ReactQuery = "tech.ReactQuery",
  Zustand = "tech.Zustand",
  Jest = "tech.Jest",
  GitHub = "tech.GitHub",
  ComponentDesign = "tech.ComponentDesign",
  Gitlab = "tech.Gitlab",
  Bitbucket = "tech.Bitbucket",
  DotNetCore = "tech.DotNetCore",
  AzureAppServices = "tech.AzureAppServices",
  AzureCloud = "tech.AzureCloud",
  EntityFramework = "tech.EntityFramework",
  Microservices = "tech.Microservices",
  RestAPI = "tech.RestAPI",
  ConfigurationDrivenUI = "tech.ConfigurationDrivenUI",
  DataDrivenUI = "tech.DataDrivenUI",
  Kubernetes = "tech.Kubernetes",
  xUnit = "tech.xUnit",
  AzureDevOps = "tech.AzureDevOps",
  AngularMaterial = "tech.AngularMaterial",
  AzureCosmosDB = "tech.AzureCosmosDB",
  SQLServer = "tech.SQLServer",
  ReactRouter = "tech.ReactRouter",
  Scrum = "tech.Scrum",
  SourceTree = "tech.SourceTree",
  NHibernate="tech.NHibernate",
  MediatR = "tech.MediatR",
  AspNetMVC = "AspNetMVC",
  CQRS = "tech.CQRS",
  MediatorPattern = "tech.MediatorPattern",
  TSLint = "tech.TSLint",
  OctopusDeploy = "tech.OctopusDeploy",
  UIKit = "tech.UIKit",
  IceLib = "tech.IceLib",
  IntegrationTesting = "tech.IntegrationTesting"
}

export interface WorkEntry {
  company: string;
  logo: string;
  from: string;
  to: string;
  location: string;
  mode: WorkMode;
  language: Language;
  role: string;
  tech: Tech[];
  description: {
    heading?: string;
    body: { title: string; paragraph: string }[];
  };
}

export const workHistory: WorkEntry[] = [
  {
    company: "Belastingdienst",
    logo: "belastingdienst.svg",
    from: "2023-01",
    to: "2024-12",
    location: "Apeldoorn",
    mode: WorkMode.Hybrid,
    language: Language.Dutch,
    role: "Senior Frontend Developer / Technisch Lead",
    tech: [
      Tech.HTML5,
      Tech.CSS3,
      Tech.JavaScript,
      Tech.TypeScript,
      Tech.Angular,
      Tech.React,
      Tech.Vue,
      Tech.WebComponents,
      Tech.Stencil,
      Tech.WCAG,
      Tech.Playwright,
      Tech.Cypress,
      Tech.REST,
      Tech.OpenAPI,
      Tech.JWT,
      Tech.Java8,
      Tech.Maven,
      Tech.Gitlabs,
      Tech.Git,
      Tech.NPM,
      Tech.Jenkins,
      Tech.Tekton,
      Tech.ArgoCD,
      Tech.SPLUNK,
      Tech.Docker,
      Tech.SonarQube,
      Tech.ESLint,
      Tech.Storybook,
      Tech.Confluence,
      Tech.Jira,
      Tech.MySQL,
    ],
    description: {
      heading:
        "Binnen de Belastingdienst werkte ik aan drie complexe projecten:",
      body: [
        {
          title:
            "Project 1: BOLD Web Components – Design System Governance & Frameworkintegratie",
          paragraph: `Binnen de Belastingdienst ondersteunde ik teams bij het gebruik van het centrale BOLD design system, opgebouwd uit Stencil
                    Web Components. Omdat ontwikkelaars werkten met Angular, React of Vue en de documentatie vaak onvolledig of
                    verouderd was, ontstonden er integratieproblemen en inconsistent gedrag tussen projecten.
                    Ik analyseerde alle componenten en herschreef de technische documentatie in Confluence, inclusief framework-specifieke
                    voorbeelden, edge cases en beperkingen. Daarnaast ontwikkelde ik wrappers en polyfills om compatibiliteit met Angular,
                    React en Vue te waarborgen. Voor ontbrekende functionaliteit leverde ik tijdelijke bridge-components, gekoppeld aan tickets
                    voor gecontroleerde uitfasering zodra het officiële component beschikbaar was.
                    Ik fungeerde als technisch aanspreekpunt tussen UX-designers, frontendteams en het centrale BOLD-team. Mijn inzet
                    verbeterde de integratie, versnelde de implementatie en zorgde ervoor dat componenten herbruikbaar, consistent en WCAGconform
                    konden worden toegepast — ongeacht het framework.`,
        },
        {
          title:
            "Project 2: CANVAS – Visuele Formuliereneditor (Greenfield Low-code Project)",
          paragraph: `Binnen het CANVAS-project ontwikkelde ik een visuele low-code editor waarmee redacteuren zonder programmeerkennis
                    complexe formulierflows konden samenstellen. De frontend werd opgebouwd rond een componentgebaseerde,
                    datagedreven architectuur met een centrale canvas, een linkerpaneel voor navigatie en bouwblokken, en een rechterpaneel
                    voor componentconfiguratie.
                    In het linkerpaneel werd bovenin het geselecteerde dossier getoond, met daaronder twee tabbladen: één voor het beheren
                    van formulieren en één voor het toevoegen van bouwblokken uit het BOLD design system. Gebruikers konden componenten
                    slepen naar het canvas en die daar inline bewerken. In het rechterpaneel verschenen, zodra een component geselecteerd
                    werd, tabs voor het aanpassen van eigenschappen (zoals labels, validaties, condities en dependencies), voor commentaar per
                    component en voor versiebeheer.
                    Naast de frontendontwikkelingen werkte ik ook aan de backend: ik breidde API-endpoints uit zodat bewerkingen correct
                    werden opgeslagen in configuratiebestanden en ontwikkelde handlers die de relevante properties persistenteerden naar de
                    MySQL-database. Hierdoor werd de state van elk formulier volledig beheerd en reproduceerbaar vanuit backendconfiguraties.
                    Ik implementeerde tevens een tryout-weergave waarin gebruikers hun formulier in een gesimuleerde frontend konden
                    testen. De editor ondersteunde conditionele logica, meertalige content, semantische HTML-bewerking en validaties, allemaal
                    configureerbaar via de UI.
                    CANVAS groeide uit tot een volwaardig low-code platform waarin redacteuren zelfstandig toegankelijke, dynamische
                    formulieren konden bouwen en beheren, volledig los van de traditionele ontwikkelketen.`,
        },
        {
          title:
            "Project 3: Ondernemersportaal – Data-driven Frontend Architectuur",
          paragraph: `Voor het Ondernemersportaal ontwierp ik een datagedreven frontendarchitectuur die het mogelijk maakte om pagina’s
                    sneller, consistenter en zonder code duplicatie op te bouwen. De wens was om meerdere aangiftepagina’s, zoals btw,
                    loonheffing, dividendbelasting en vliegbelasting, modulair te genereren op basis van backendconfiguratie, met herbruikbare
                    componenten en flexibele gedragsaanpassing.
                    Ik ontwikkelde een set generieke Angular-componenten waarvan de logica en weergave werden aangestuurd via injectable
                    services en configuratiebestanden. Invoervelden, infoblokken, validaties en hulpteksten pasten hun gedrag dynamisch aan op
                    basis van waarden uit andere componenten of data uit de backend. De architectuur maakte gebruik van conditionele
                    zichtbaarheid, meertalige labels en validatieregels die via JSON-schema’s werden ingeladen.
                    Daarnaast implementeerde ik frontendfilters die bestonden uit dropdowns, zoekvelden en chips, inclusief verwijderbare chips
                    voor actieve filters. Voor tabellen met beperkte datasets schreef ik een wrappercomponent die client-side sortering mogelijk
                    maakte, zonder dat de backend opnieuw aangesproken hoefde te worden. Deze wrapper hield rekening met kolomtypes,
                    toegankelijkheidseisen en sorteerlogica volgens de specificaties van het BOLD design system.
                    Door deze aanpak konden nieuwe pagina’s met minimale effort worden uitgerold, terwijl toegankelijkheid (WCAG),
                    herbruikbaarheid en consistentie geborgd bleven. De architectuur bleek schaalbaar, onderhoudsvriendelijk en zeer geschikt
                    voor hergebruik in soortgelijke portalen binnen de organisatie.`,
        },
      ],
    },
  },
  {
    company: "Postcode Loterij",
    logo: "nationale-postcode-loterij.png",
    from: "2022-07",
    to: "2023-01",
    location: "Amsterdam",
    mode: WorkMode.Hybrid,
    language: Language.English,
    role: "Frontend Developer / Design System Specialist",
    tech: [
      Tech.HTML5,
      Tech.SCSS,
      Tech.TailwindCSS,
      Tech.JavaScript,
      Tech.TypeScript,
      Tech.React,
      Tech.NextJS,
      Tech.WCAG,
      Tech.SVG,
      Tech.Cypress,
      Tech.Playwright,
      Tech.OpenAPI,
      Tech.AWSLambda,
      Tech.Git,
      Tech.GitLabCI,
      Tech.Docker,
      Tech.SonarQube,
      Tech.ESLint,
      Tech.Prettier,
      Tech.Jira,
      Tech.Confluence,
      Tech.HeadlessCMS,
      Tech.ReactQuery,
      Tech.Zustand,
    ],
    description: {
      heading: "Internationaal design system voor marketingcampagnes",
      body: [
        {
          title: "Doel",
          paragraph:
            "Opzetten van een schaalbaar, toegankelijk en wereldwijd herbruikbaar design system voor marketingcampagnes van de Nationale Postcode Loterij.",
        },
        {
          title: "Aanpak",
          paragraph:
            "Gebouwd met React, TypeScript en Next.js in een greenfield-omgeving, met gebruik van Tailwind CSS en SCSS voor styling. SVG-animaties en headless CMS-integratie zorgden voor visuele flexibiliteit en contentbeheer zonder directe ontwikkelinterventie.",
        },
        {
          title: "Performance & toegankelijkheid",
          paragraph:
            "Geoptimaliseerd voor laadtijd en SEO met server-side rendering (SSR) via Next.js. Alle componenten voldeden aan WCAG 2.0, en zijn configureerbaar qua kleur, gedrag, typografie en lay-out.",
        },
        {
          title: "CI/CD en tooling",
          paragraph:
            "Opgezet met GitLab CI, Docker, Cypress en Playwright voor geautomatiseerd testen en deployments. Monitoring met Splunk en codekwaliteit geborgd met ESLint, SonarQube en Prettier.",
        },
      ],
    },
  },
  {
    company: "Athlon",
    logo: "athlon.svg",
    from: "2020-10",
    to: "2022-07",
    location: "Almere",
    mode: WorkMode.Remote,
    language: Language.English,
    role: "Lead Frontend Developer",
    tech: [
      Tech.HTML5,
      Tech.SCSS,
      Tech.Angular,
      Tech.RxJS,
      Tech.TypeScript,
      Tech.JavaScript,
      Tech.WCAG,
      Tech.Jest,
      Tech.Cypress,
      Tech.OpenAPI,
      Tech.REST,
      Tech.Azure,
      Tech.GitHub,
      Tech.Docker,
      Tech.Maven,
      Tech.SonarQube,
      Tech.ESLint,
      Tech.Prettier,
      Tech.Jira,
      Tech.Confluence,
      Tech.HeadlessCMS,
      Tech.TailwindCSS,
    ],
    description: {
      heading: "Migratie en herbouw van legacy-applicatie",
      body: [
        {
          title: "Doel",
          paragraph:
            "Vernieuwen van de bestaande Angular 1.6-applicatie naar een moderne, toegankelijke en schaalbare frontendarchitectuur.",
        },
        {
          title: "Aanpak",
          paragraph:
            "Leidde de migratie naar Angular 12 en herstructureerde de UI op basis van WCAG-eisen, performanceverbeteringen en herbruikbare componenten. Introduceerde een RxJS-gebaseerde reactive architecture voor efficiënte state handling.",
        },
        {
          title: "Configuratiegestuurde formulieren",
          paragraph:
            "Ontwikkelde dynamische selfserviceformulieren met conditionele logica, validaties en configuratie op basis van low-code principes. Hierdoor konden gebruikers zelfstandig processen doorlopen zonder ontwikkelwerk.",
        },
        {
          title: "Dashboards en UX",
          paragraph:
            "Bouwde interactieve dashboards met datavisualisatie op basis van backenddata. Werkte nauw samen met UX-designers en product owners om wireframes te vertalen naar toegankelijke, consistente interfaces.",
        },
        {
          title: "Kwaliteit & DevOps",
          paragraph:
            "Implementeerde CI/CD met Jenkins en GitHub, voerde testautomatisering door met Jest en Cypress, en borgde codekwaliteit met SonarQube, ESLint en Prettier.",
        },
      ],
    },
  },
  {
    company: "Randstad",
    logo: "randstad.svg",
    from: "2020-08",
    to: "2020-10",
    location: "Amsterdam",
    mode: WorkMode.OnSite,
    language: Language.English,
    role: "Frontend Developer / UI Coach",
    tech: [
      Tech.HTML5,
      Tech.SCSS,
      Tech.JavaScript,
      Tech.Angular,
      Tech.React,
      Tech.BEM,
      Tech.WCAG,
      Tech.ComponentDesign,
      Tech.HeadlessCMS,
      Tech.Maven,
      Tech.Jenkins,
      Tech.Gitlab,
      Tech.Git,
      Tech.GitHub,
      Tech.Bitbucket,
      Tech.SonarQube,
      Tech.Prettier,
      Tech.ESLint,
      Tech.Confluence,
      Tech.Jira
    ],
    description: {
      heading: "Toegankelijke componentontwikkeling voor Randstad & Yacht",
      body: [
        {
          title: "Doel",
          paragraph:
            "Randstad en Yacht wilden hun websites herpositioneren met een vernieuwde visuele identiteit en consistente UI-componenten. Mijn opdracht was om toegankelijke, herbruikbare frontendcomponenten te ontwikkelen en het team hierin te coachen.",
        },
        {
          title: "Aanpak",
          paragraph:
            "Ontwikkelde componenten in Angular, React en vanilla JavaScript volgens de BEM-methodiek. Focus lag op WCAG-compliance, visuele consistentie en integratie met het Hippo Bloomreach headless CMS.",
        },
        {
          title: "Coaching & samenwerking",
          paragraph:
            "Begeleidde teamleden in het toepassen van Angular best practices, met nadruk op componentstructuur, toegankelijkheid en integratie. Werkte nauw samen met designers en testte componenten in stagingomgevingen vóór productie.",
        },
        {
          title: "Impact",
          paragraph:
            "De nieuwe componenten sloten naadloos aan op de rebranding van beide merken en verhoogden de toegankelijkheid, performance en onderhoudbaarheid van de platformen. Mijn coaching droeg bij aan kennisdeling en structurele kwaliteitsverbetering.",
        }
      ],
    },
  }
  ,
  {
    company: "Opinity",
    logo: "opinity.png",
    from: "2020-03",
    to: "2020-07",
    location: "Rotterdam",
    mode: WorkMode.OnSite,
    language: Language.English,
    role: "Frontend Developer",
    tech: [
      Tech.React,
      Tech.TypeScript,
      Tech.JavaScript,
      Tech.HTML5,
      Tech.CSS3,
      Tech.ESLint,
      Tech.Prettier,
      Tech.Jira,
      Tech.Git,
    ],
    description: {
      heading: "MVP-ontwikkeling voor klantdata en profilering",
      body: [
        {
          title: "Doel",
          paragraph:
            "Ondersteunen bij de ontwikkeling van een MVP voor een platform in de financiële sector dat klantdata verzamelt, visualiseert en gebruikt voor profilering.",
        },
        {
          title: "Aanpak",
          paragraph:
            "Werkte in een klein cross-functional team aan de frontend in React en TypeScript. Richtte me op component-based development, validatie van gebruikersinvoer en responsive weergave van klantprofielen.",
        },
        {
          title: "Tooling & codekwaliteit",
          paragraph:
            "Borgde codekwaliteit met ESLint en Prettier, werkte via Git en Jira aan user stories en leverde iteratief op binnen korte sprints.",
        },
        {
          title: "Impact",
          paragraph:
            "Het MVP werd succesvol opgeleverd als basis voor doorontwikkeling richting een datagedreven klantplatform met focus op privacy en gebruiksgemak.",
        }
      ],
    },
  },
  {
    company: "Omniplan",
    logo: "omniplan.svg",
    from: "2019-08",
    to: "2020-03",
    location: "Amsterdam",
    mode: WorkMode.OnSite,
    language: Language.Dutch,
    role: "Fullstack Developer / Frontend Lead",
    tech: [
      Tech.Angular,
      Tech.TypeScript,
      Tech.RxJS,
      Tech.CSharp,
      Tech.DotNetCore,
      Tech.JWT,
      Tech.AzureAppServices,
      Tech.AzureCloud,
      Tech.MSSQL,
      Tech.EntityFramework,
      Tech.Microservices,
      Tech.RestAPI,
      Tech.ConfigurationDrivenUI,
      Tech.DataDrivenUI,
      Tech.Docker,
      Tech.Kubernetes,
      Tech.xUnit,
      Tech.Git,
      Tech.AzureDevOps,
      Tech.Confluence,
    ],
    description: {
      heading: "Modulaire authenticatie en low-code UI",
      body: [
        {
          title: "Doel",
          paragraph:
            "Volledige herbouw van de frontend en backend van het platform van Omniplan om schaalbaarheid, veiligheid en integratie met externe partijen te verbeteren.",
        },
        {
          title: "Authenticatiearchitectuur",
          paragraph:
            "Ontwikkelde een flexibel authenticatie- en autorisatiemodel met C# en ASP.NET Core, gebaseerd op Microsoft Identity en JWT. Implementeerde veilige toegang via REST API's voor externe organisaties.",
        },
        {
          title: "Frontend & configuratie",
          paragraph:
            "Leidde de ontwikkeling van een modulaire Angular-frontend met configuratiegestuurde logica en UI. Componentgedrag, permissies en validaties werden centraal aangestuurd — geïnspireerd op low-code principes.",
        },
        {
          title: "DevOps & schaalbaarheid",
          paragraph:
            "Implementeerde een microservicesarchitectuur met Azure App Services, Docker en Kubernetes. Realiseerde een schaalbare backend in .NET Core met Entity Framework en MSSQL.",
        },
        {
          title: "Impact",
          paragraph:
            "Het platform werd toekomstbestendig, veilig en onderhoudbaar. De low-code frontend vergemakkelijkte aanpassing en beheer met minimale ontwikkelinspanning.",
        }
      ],
    },
  }
  ,
  {
    company: "Ortec",
    logo: "ortec.png",
    from: "2019-04",
    to: "2019-07",
    location: "Zoetermeer",
    mode: WorkMode.OnSite,
    language: Language.English,
    role: "Fullstack Developer",
    tech: [
      Tech.Angular,
      Tech.AngularMaterial,
      Tech.TypeScript,
      Tech.HTML5,
      Tech.CSS3,
      Tech.RxJS,
      Tech.CSharp,
      Tech.DotNetCore,
      Tech.AzureCloud,
      Tech.AzureCosmosDB,
      Tech.OpenAPI,
      Tech.RestAPI,
      Tech.DataDrivenUI,
      Tech.ConfigurationDrivenUI,
      Tech.Docker,
      Tech.SonarQube,
      Tech.Prettier,
      Tech.ESLint,
      Tech.Confluence,
      Tech.Jira,
      Tech.Gitlab
    ],
    description: {
      heading: "Logistiek portaal voor FedEx met configuratiegestuurde UI",
      body: [
        {
          title: "Doel",
          paragraph:
            "Ontwikkelen van een schaalbaar en gebruiksvriendelijk portaal voor logistieke gebruikers van FedEx om routes, ladingen en bezorglocaties real-time te beheren.",
        },
        {
          title: "Frontend met Angular Material",
          paragraph:
            "Bouwde interactieve UI-componenten met Angular en Angular Material, waaronder datatabellen, modals en validatieflows. Richtte het systeem in op foutreductie en optimalisatie van invoerprocessen.",
        },
        {
          title: "Configuratiegestuurde interface",
          paragraph:
            "Implementeerde een componentarchitectuur waarbij gedrag en layout dynamisch gestuurd werden via configuratiebestanden — vergelijkbaar met low-code principes.",
        },
        {
          title: "Backend & integratie",
          paragraph:
            "Integreerde de frontend met REST API’s op basis van OpenAPI en .NET Core-microservices. Werkte met Cosmos DB en voerde foutafhandeling en logging uit binnen een schaalbare Azure-cloudomgeving.",
        },
        {
          title: "Impact",
          paragraph:
            "Het portaal bood real-time inzicht en controle over routes, reduceerde invoerfouten en verbeterde operationele efficiëntie voor planners en chauffeurs.",
        }
      ],
    },
  },
  {
    company: "Bluefield",
    logo: "bluefield.png",
    from: "2018-03",
    to: "2019-04",
    location: "Utrecht",
    mode: WorkMode.OnSite,
    language: Language.Dutch,
    role: "Fullstack Developer / Frontend Specialist",
    tech: [
      Tech.React,
      Tech.TypeScript,
      Tech.JavaScript,
      Tech.HTML5,
      Tech.CSS3,
      Tech.Redux,
      Tech.CSharp,
      Tech.DotNetCore,
      Tech.Neo4J,
      Tech.RestAPI,
      Tech.SQLServer,
      Tech.ReactRouter,
      Tech.MVVM,
      Tech.SonarQube,
      Tech.Prettier,
      Tech.ESLint,
      Tech.Confluence,
      Tech.Git,
    ],
    description: {
      heading: "Datavisualisatie en toegangsbeheer voor zakelijke toepassingen",
      body: [
        {
          title: "Cyclusvisualisatie met graph database",
          paragraph:
            "Ontwikkelde een React-frontend die complexe cycli visualiseerde op basis van data uit een Neo4J graph-database. Elke cyclus kreeg een kleurgecodeerde status, en gebruikers konden via een interactieve UI doorklikken naar detailinformatie of herstelacties uitvoeren.",
        },
        {
          title: "Beheertool voor Tommy Hilfiger",
          paragraph:
            "Bouwde een intuïtieve webapplicatie waarmee medewerkers parkeerplaatsen konden reserveren en toegangstickets konden printen. Realiseerde een interactieve kalenderinterface in React, met nadruk op eenvoud en visuele consistentie.",
        },
        {
          title: "Architectuur & state management",
          paragraph:
            "Gebruikte een schaalbare architectuur op basis van Redux en Redux-Thunk voor state management, met herbruikbare componenten en gescheiden concerns. Backend communicatie verliep via een .NET Web API.",
        },
        {
          title: "Impact",
          paragraph:
            "De applicaties verbeterden controle, efficiëntie en gebruikerservaring binnen zakelijke processen. Door visualisatie en selfservice werd de werkdruk op support verlaagd en werden fouten sneller herkend en opgelost.",
        }
      ],
    },
  },
  {
    company: "Niped",
    logo: "niped.svg",
    from: "2017-12",
    to: "2018-03",
    location: "Hoorn",
    mode: WorkMode.OnSite,
    language: Language.English,
    role: "Frontend Developer",
    tech: [
      Tech.React,
      Tech.Redux,
      Tech.ReactRouter,
      Tech.JavaScript,
      Tech.HTML5,
      Tech.CSS3,
      Tech.CSharp,
      Tech.WPF,
      Tech.MVVM,
      Tech.RestAPI,
      Tech.SonarQube,
      Tech.Prettier,
      Tech.ESLint,
      Tech.Scrum,
      Tech.SourceTree,
      Tech.Confluence,
      Tech.Bitbucket,
      Tech.Jira,
    ],
    description: {
      heading: "Gezondheidsplatform en WPF-beheerapplicatie",
      body: [
        {
          title: "Doel",
          paragraph:
            "Uitbreiden en optimaliseren van het online gezondheidsplatform ‘De Persoonlijke Gezondheidscheck’, inclusief beheerinterface voor interne medewerkers.",
        },
        {
          title: "Frontend webapplicatie",
          paragraph:
            "Bouwde nieuwe ReactJS-componenten, verbeterde foutafhandeling en performance, en bracht meer visuele consistentie aan. Richtte me op toegankelijke HTML/CSS en herbruikbare frontend-logica in ES6+.",
        },
        {
          title: "Desktopbeheerinterface",
          paragraph:
            "Ontwierp en ontwikkelde een WPF-desktopapplicatie in C# voor contentbeheer door interne medewerkers. Gebruikte het MVVM-patroon en REST API-integratie voor communicatie met de backend.",
        },
        {
          title: "Scrum & samenwerking",
          paragraph:
            "Werkte actief mee binnen een multidisciplinair Scrumteam. Draagde bij aan refinements, sprintplanning en reviews, en bewaakte codekwaliteit met behulp van SonarQube, Prettier en ESLint.",
        }
      ],
    },
  },
  {
    company: "Conclusion",
    logo: "conclusion.svg",
    from: "2017-08",
    to: "2017-12",
    location: "Amsterdam",
    mode: WorkMode.OnSite,
    language: Language.Dutch,
    role: "Fullstack Developer / Migratie Specialist",
    tech: [
      Tech.Vue,
      Tech.JavaScript,
      Tech.HTML5,
      Tech.CSS3,
      Tech.CSharp,
      Tech.WebForms,
      Tech.RestAPI,
      Tech.CQRS,
      Tech.NHibernate,
      Tech.MSSQL,
      Tech.AspNetMVC,
      Tech.SonarQube,
      Tech.xUnit,
      Tech.MediatorPattern,
      Tech.TSLint,
      Tech.Prettier,
      Tech.Confluence,
      Tech.Bitbucket,
      Tech.Jira,
      Tech.Jenkins,
      Tech.OctopusDeploy,
      Tech.UIKit,
    ],
    description: {
      heading: "Modernisering CLASS leeromgeving",
      body: [
        {
          title: "Doel",
          paragraph:
            "Migreren van de bestaande digitale leeromgeving (CLASS) van een verouderde Web Forms-applicatie naar een moderne VueJS-frontend, met behoud van stabiliteit voor SLA-klanten.",
        },
        {
          title: "Frontend migratie",
          paragraph:
            "Bouwde een componentgebaseerde interface in VueJS met HTML, CSS en JavaScript (ECMA 5/6). Richtte me op toegankelijkheid, herbruikbaarheid en UX-verbeteringen.",
        },
        {
          title: "Legacy onderhoud",
          paragraph:
            "Onderhield en stabiliseerde de ASP.NET Web Forms-backend. Draaide bugfixes en verbeteringen door zonder downtime, in lijn met SLA-verplichtingen.",
        },
        {
          title: "Architectuur & backend",
          paragraph:
            "Werkte met een .NET-architectuur op basis van CQRS, NHibernate en het Mediator pattern. Backendcommunicatie via RESTful APIs met testcoverage in xUnit.",
        },
        {
          title: "Impact",
          paragraph:
            "De migratie leidde tot een toegankelijkere en gebruiksvriendelijkere leeromgeving, terwijl legacyklanten ongestoord konden blijven werken. Dit verbeterde klanttevredenheid én de technische basis.",
        }
      ],
    },
  }
  ,
  {
    company: "Transdev",
    logo: "transdev.webp",
    from: "2016-08",
    to:  "2017-08",
    location: "Hilversum",
    mode: WorkMode.OnSite,
    language: Language.English,
    role: "Fullstack Developer",
    tech: [
      Tech.Angular,
      Tech.TypeScript,
      Tech.RxJS,
      Tech.HTML5,
      Tech.CSS3,
      Tech.JavaScript,
      Tech.CSharp,
      Tech.DotNetCore,
      Tech.AspNetMVC,
      Tech.SQLServer,
      Tech.RestAPI,
      Tech.API,
      Tech.JWT,
      Tech.SonarQube,
      Tech.Prettier,
      Tech.TSLint,
      Tech.Jenkins,
      Tech.Confluence,
      Tech.Git,
      Tech.IceLib,
      Tech.IntegrationTesting,
    ],
    description: {
      heading: "Generieke API-laag, telefonie-integratie en reizigersportaal",
      body: [
        {
          title: "Project 1: API Garden – koppellaag voor legacy-systemen",
          paragraph:
            "Ontwikkelde een generieke RESTful Web API in .NET Core om functionaliteit uit een monolithische Delphi-backend beschikbaar te maken voor moderne toepassingen. Implementeerde authenticatie en autorisatie volgens .NET securityprincipes.",
        },
        {
          title: "Project 2: Telefonie-integratie met wachtrijstatus",
          paragraph:
            "Realiseerde een telefonie-integratiemodule met ICE-lib voor het tonen van real-time wachttijdinformatie aan reizigers. Gebruikers kregen inzicht in hun positie in de wachtrij, wat de beleving van klantcontact aanzienlijk verbeterde.",
        },
        {
          title: "Project 3: Reizigersportaal met Angular",
          paragraph:
            "Bouwde een Angular 2-webapplicatie die real-time ritinformatie toont op basis van gegevens uit de API-laag. Frontend bevatte toegankelijke UI-componenten met RxJS, HTML, CSS en TypeScript.",
        },
        {
          title: "Impact",
          paragraph:
            "Dankzij de generieke API-laag en moderne Angular-app kregen reizigers snel en overzichtelijk toegang tot actuele reisinformatie. Telefonie-integratie verhoogde transparantie, terwijl de modulaire architectuur toekomstbestendig bleek.",
        }
      ],
    },
  }
  ,
];
