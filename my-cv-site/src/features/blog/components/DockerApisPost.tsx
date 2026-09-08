import type { Locale } from "@/lib/seo";
import type { BlogPostMeta } from "../types";
import { H2, P, A, Lead, UL, OL, LI, Strong, Quote, Divider } from "./prose";
import { Callout } from "./Callout";
import { CodeBlock } from "./CodeBlock";
import { FileTree, type FileNode } from "./FileTree";
import { FlowDiagram } from "./FlowDiagram";
import { Contents } from "./Contents";
import { flowNode, flowEdge } from "../flow";

export const meta: BlogPostMeta = {
  slug: "dockerising-dotnet-java-kotlin-apis",
  category: "architecture",
  track: "fullstack",
  publishedDate: "2026-09-08",
  readingTimeMin: 25,
  title: {
    en: "Putting a .NET, Java or Kotlin API in a container",
    nl: "Een .NET-, Java- of Kotlin-API in een container",
  },
  description: {
    en: "One multi stage pattern, three Dockerfiles, a Compose file with a database, and a Kubernetes Deployment with startup, readiness and liveness probes.",
    nl: "Eén multi-stage patroon, drie Dockerfiles, een Compose-bestand met database en een Kubernetes Deployment met startup-, readiness- en liveness-probes.",
  },
  excerpt: {
    en: "The three APIs from this series become the same kind of thing once they are images. Here they are built, run side by side against one database, and handed to a cluster that decides for itself when a container may take traffic.",
    nl: "De drie API's uit deze reeks worden hetzelfde soort ding zodra ze images zijn. Hier worden ze gebouwd, naast elkaar tegen één database gedraaid, en overgedragen aan een cluster dat zelf bepaalt wanneer een container verkeer mag krijgen.",
  },
  keywords: [
    "dockerfile multi stage build",
    "dotnet chiseled image",
    "spring boot jarmode tools extract",
    "eclipse temurin jre image",
    "docker compose service healthy",
    "kubernetes startup readiness liveness probes",
    "maxrampercentage container memory",
    "container image pinning and scanning",
  ],
};

function buildStageDiagram(locale: Locale) {
  const copy = COPY;
  const nodes = [
    flowNode("context", copy.nodeContext[locale], { x: 0, y: 120 }, { tone: "slate", subtitle: copy.nodeContextSub[locale], width: 180 }),
    flowNode("build", copy.nodeBuild[locale], { x: 250, y: 120 }, { tone: "blue", subtitle: copy.nodeBuildSub[locale], width: 230 }),
    flowNode("runtime", copy.nodeRuntime[locale], { x: 600, y: 120 }, { tone: "emerald", subtitle: copy.nodeRuntimeSub[locale], width: 230 }),
    flowNode("left", copy.nodeLeft[locale], { x: 300, y: 280 }, { tone: "rose", subtitle: copy.nodeLeftSub[locale], direction: "TB", width: 260 }),
  ];
  const edges = [
    flowEdge("context", "build"),
    flowEdge("build", "runtime", { label: "COPY --from" }),
    flowEdge("build", "left", { dashed: true, label: copy.edgeLeft[locale] }),
  ];
  return { nodes, edges };
}

function buildProbeDiagram(locale: Locale) {
  const copy = COPY;
  const nodes = [
    flowNode("start", copy.nodeStart[locale], { x: 0, y: 120 }, { tone: "slate", subtitle: copy.nodeStartSub[locale], width: 190 }),
    flowNode("startup", copy.nodeStartup[locale], { x: 260, y: 120 }, { tone: "amber", subtitle: copy.nodeStartupSub[locale], width: 200 }),
    flowNode("readiness", copy.nodeReadiness[locale], { x: 540, y: 20 }, { tone: "emerald", subtitle: copy.nodeReadinessSub[locale], width: 230 }),
    flowNode("liveness", copy.nodeLiveness[locale], { x: 540, y: 230 }, { tone: "rose", subtitle: copy.nodeLivenessSub[locale], width: 230 }),
    flowNode("traffic", copy.nodeTraffic[locale], { x: 850, y: 20 }, { tone: "emerald", width: 190 }),
    flowNode("restart", copy.nodeRestart[locale], { x: 850, y: 230 }, { tone: "slate", width: 190 }),
  ];
  const edges = [
    flowEdge("start", "startup"),
    flowEdge("startup", "readiness", { label: copy.edgePassed[locale] }),
    flowEdge("startup", "liveness", { label: copy.edgePassed[locale] }),
    flowEdge("readiness", "traffic"),
    flowEdge("liveness", "restart", { dashed: true, label: copy.edgeFailed[locale] }),
  ];
  return { nodes, edges };
}

function buildProjectTree(locale: Locale): FileNode[] {
  const copy = COPY;
  return [
    {
      name: "apis/",
      children: [
        { name: "compose.yaml", comment: copy.treeCompose[locale] },
        { name: "deployment.yaml", comment: copy.treeDeployment[locale] },
        {
          name: "workshops-dotnet/",
          comment: copy.treeDotnet[locale],
          children: [
            { name: "Workshops.sln" },
            { name: "Workshops.Domain/" },
            { name: "Workshops.Api/" },
            { name: "Workshops.Api.Tests/" },
            { name: ".dockerignore" },
            { name: "Dockerfile" },
          ],
        },
        {
          name: "workshops-java/",
          comment: copy.treeJava[locale],
          children: [
            { name: "pom.xml" },
            { name: "mvnw", comment: copy.treeWrapper[locale] },
            { name: ".mvn/" },
            { name: "workshops-domain/" },
            { name: "workshops-api/" },
            { name: ".dockerignore" },
            { name: "Dockerfile" },
          ],
        },
        {
          name: "workshops-kotlin/",
          comment: copy.treeKotlin[locale],
          children: [
            { name: "settings.gradle.kts" },
            { name: "gradlew", comment: copy.treeWrapper[locale] },
            { name: "gradle/" },
            { name: "workshops-domain/" },
            { name: "workshops-spring/" },
            { name: "workshops-ktor/" },
            { name: ".dockerignore" },
            { name: "Dockerfile" },
          ],
        },
      ],
    },
  ];
}

export function Body({ locale }: { locale: Locale }) {
  const copy = COPY;
  const stageFlow = buildStageDiagram(locale);
  const probeFlow = buildProbeDiagram(locale);
  return (
    <>
      <Lead>{copy.lead[locale]}</Lead>
      <P>{copy.intro1[locale]}</P>
      <P>{copy.intro2[locale]}</P>
      <P>{copy.versions[locale]}</P>
      <P>{copy.example[locale]}</P>
      <Quote>{copy.quote[locale]}</Quote>
      <Contents
        label={copy.contentsLabel[locale]}
        items={[
          copy.goodTitle[locale],
          copy.patternTitle[locale],
          copy.dotnetTitle[locale],
          copy.nonRootTitle[locale],
          copy.globalisationTitle[locale],
          copy.javaTitle[locale],
          copy.layeringTitle[locale],
          copy.kotlinTitle[locale],
          copy.configurationTitle[locale],
          copy.healthTitle[locale],
          copy.composeTitle[locale],
          copy.kubernetesTitle[locale],
          copy.memoryTitle[locale],
          copy.supplyTitle[locale],
          copy.closeTitle[locale],
        ]}
      />

      <H2>{copy.goodTitle[locale]}</H2>
      <P>{copy.good1[locale]}</P>
      <OL>
        <LI><Strong>{copy.goodStartsLabel[locale]}</Strong> {copy.goodStarts[locale]}</LI>
        <LI><Strong>{copy.goodInsideLabel[locale]}</Strong> {copy.goodInside[locale]}</LI>
        <LI><Strong>{copy.goodWhoLabel[locale]}</Strong> {copy.goodWho[locale]}</LI>
        <LI><Strong>{copy.goodOutsideLabel[locale]}</Strong> {copy.goodOutside[locale]}</LI>
        <LI><Strong>{copy.goodAgainLabel[locale]}</Strong> {copy.goodAgain[locale]}</LI>
      </OL>
      <P>{copy.good2[locale]}</P>

      <H2>{copy.patternTitle[locale]}</H2>
      <P>{copy.pattern1[locale]}</P>
      <FlowDiagram
        nodes={stageFlow.nodes}
        edges={stageFlow.edges}
        height={340}
        ariaLabel={copy.stageAria[locale]}
        caption={copy.stageCaption[locale]}
      />
      <P>{copy.pattern2[locale]}</P>
      <P>{copy.pattern3[locale]}</P>
      <FileTree tree={buildProjectTree(locale)} caption={copy.treeCaption[locale]} />
      <P>{copy.pattern4[locale]}</P>
      <CodeBlock lang="text" filename="apis/workshops-dotnet/.dockerignore" code={DOCKERIGNORE_CODE} />
      <P>{copy.pattern5[locale]}</P>
      <P>{copy.pattern6[locale]}</P>

      <H2>{copy.dotnetTitle[locale]}</H2>
      <P>{copy.dotnet1[locale]}</P>
      <CodeBlock lang="dockerfile" filename="apis/workshops-dotnet/Dockerfile" code={DOTNET_DOCKERFILE_CODE} />
      <P>{copy.dotnet2[locale]}</P>
      <P>{copy.dotnet3[locale]}</P>
      <P>{copy.dotnet4[locale]}</P>
      <CodeBlock lang="bash" filename="apis/workshops-dotnet" code={DOTNET_BUILD_CODE} />
      <P>{copy.dotnet5[locale]}</P>

      <H2>{copy.nonRootTitle[locale]}</H2>
      <P>{copy.nonRoot1[locale]}</P>
      <P>{copy.nonRoot2[locale]}</P>
      <P>{copy.nonRoot3[locale]}</P>
      <CodeBlock lang="bash" filename="docker run" code={DOTNET_RUN_CODE} />
      <P>{copy.nonRoot4[locale]}</P>
      <Callout variant="warning" title={copy.nonRootWarningTitle[locale]}>
        {copy.nonRootWarningBody[locale]}
      </Callout>

      <H2>{copy.globalisationTitle[locale]}</H2>
      <P>{copy.globalisation1[locale]}</P>
      <P>{copy.globalisation2[locale]}</P>
      <CodeBlock lang="xml" filename="apis/workshops-dotnet/Workshops.Api/Workshops.Api.csproj" code={INVARIANT_CODE} />
      <P>{copy.globalisation3[locale]}</P>
      <P>{copy.globalisation4[locale]}</P>

      <Divider />

      <H2>{copy.javaTitle[locale]}</H2>
      <P>{copy.java1[locale]}</P>
      <CodeBlock lang="bash" filename="apis/workshops-java" code={MAVEN_WRAPPER_CODE} />
      <P>{copy.java2[locale]}</P>
      <CodeBlock lang="dockerfile" filename="apis/workshops-java/Dockerfile" code={JAVA_DOCKERFILE_CODE} />
      <P>{copy.java3[locale]}</P>
      <P>{copy.java4[locale]}</P>
      <P>{copy.java5[locale]}</P>
      <CodeBlock lang="bash" filename="apis/workshops-java" code={JAVA_BUILD_CODE} />
      <P>{copy.java6[locale]}</P>

      <H2>{copy.layeringTitle[locale]}</H2>
      <P>{copy.layering1[locale]}</P>
      <P>{copy.layering2[locale]}</P>
      <Callout variant="warning" title={copy.layeringWarningTitle[locale]}>
        {copy.layeringWarningBody[locale]}
      </Callout>
      <P>{copy.layering3[locale]}</P>
      <CodeBlock lang="text" filename="java -Djarmode=tools -jar application.jar extract --layers" code={LAYERS_CODE} />
      <P>{copy.layering4[locale]}</P>

      <H2>{copy.kotlinTitle[locale]}</H2>
      <P>{copy.kotlin1[locale]}</P>
      <CodeBlock lang="dockerfile" filename="apis/workshops-kotlin/Dockerfile" code={KOTLIN_DOCKERFILE_CODE} />
      <P>{copy.kotlin2[locale]}</P>
      <P>{copy.kotlin3[locale]}</P>
      <CodeBlock lang="dockerfile" filename="apis/workshops-kotlin/Dockerfile" code={KTOR_DOCKERFILE_CODE} />
      <P>{copy.kotlin4[locale]}</P>

      <Divider />

      <H2>{copy.configurationTitle[locale]}</H2>
      <P>{copy.configuration1[locale]}</P>
      <UL>
        <LI><Strong>{copy.configDotnetLabel[locale]}</Strong> {copy.configDotnet[locale]}</LI>
        <LI><Strong>{copy.configSpringLabel[locale]}</Strong> {copy.configSpring[locale]}</LI>
        <LI><Strong>{copy.configKtorLabel[locale]}</Strong> {copy.configKtor[locale]}</LI>
      </UL>
      <CodeBlock lang="bash" filename="docker run" code={ENVIRONMENT_CODE} />
      <P>{copy.configuration2[locale]}</P>
      <P>{copy.configuration3[locale]}</P>

      <H2>{copy.healthTitle[locale]}</H2>
      <P>{copy.health1[locale]}</P>
      <CodeBlock lang="csharp" filename="apis/workshops-dotnet/Workshops.Api/Program.cs" code={DOTNET_HEALTH_CODE} />
      <P>{copy.health2[locale]}</P>
      <CodeBlock lang="xml" filename="apis/workshops-java/workshops-api/pom.xml" code={ACTUATOR_DEPENDENCY_CODE} />
      <CodeBlock lang="yaml" filename="apis/workshops-java/workshops-api/src/main/resources/application.yaml" code={ACTUATOR_YAML_CODE} />
      <P>{copy.health3[locale]}</P>
      <CodeBlock lang="kotlin" filename="apis/workshops-kotlin/workshops-spring/build.gradle.kts" code={KOTLIN_ACTUATOR_CODE} />
      <P>{copy.health4[locale]}</P>
      <CodeBlock lang="kotlin" filename="apis/workshops-kotlin/workshops-ktor/src/main/kotlin/workshops/ktor/Application.kt" code={KTOR_HEALTH_CODE} />
      <P>{copy.health5[locale]}</P>
      <P>{copy.health6[locale]}</P>
      <P>{copy.health7[locale]}</P>

      <H2>{copy.composeTitle[locale]}</H2>
      <P>{copy.compose1[locale]}</P>
      <CodeBlock lang="yaml" filename="apis/compose.yaml" code={COMPOSE_CODE} />
      <P>{copy.compose2[locale]}</P>
      <P>{copy.compose3[locale]}</P>
      <CodeBlock lang="bash" filename="apis" code={COMPOSE_RUN_CODE} />
      <CodeBlock lang="text" filename="docker compose ps" code={COMPOSE_PS_CODE} />
      <P>{copy.compose4[locale]}</P>
      <CodeBlock lang="bash" filename="curl" code={COMPOSE_CURL_CODE} />
      <P>{copy.compose5[locale]}</P>

      <Divider />

      <H2>{copy.kubernetesTitle[locale]}</H2>
      <P>{copy.kubernetes1[locale]}</P>
      <UL>
        <LI><Strong>{copy.probeHttpLabel[locale]}</Strong> {copy.probeHttp[locale]}</LI>
        <LI><Strong>{copy.probeExecLabel[locale]}</Strong> {copy.probeExec[locale]}</LI>
        <LI><Strong>{copy.probeTcpLabel[locale]}</Strong> {copy.probeTcp[locale]}</LI>
        <LI><Strong>{copy.probeGrpcLabel[locale]}</Strong> {copy.probeGrpc[locale]}</LI>
      </UL>
      <P>
        {copy.kubernetes2[locale]}
        <A href="https://kubernetes.io/docs/concepts/workloads/pods/probes/">
          https://kubernetes.io/docs/concepts/workloads/pods/probes/
        </A>
        {copy.kubernetes2After[locale]}
      </P>
      <FlowDiagram
        nodes={probeFlow.nodes}
        edges={probeFlow.edges}
        height={360}
        ariaLabel={copy.probeAria[locale]}
        caption={copy.probeCaption[locale]}
      />
      <P>{copy.kubernetes3[locale]}</P>
      <CodeBlock lang="yaml" filename="apis/deployment.yaml" code={DEPLOYMENT_CODE} />
      <P>{copy.kubernetes4[locale]}</P>
      <P>{copy.kubernetes5[locale]}</P>
      <P>{copy.kubernetes6[locale]}</P>
      <CodeBlock lang="yaml" filename="apis/deployment.yaml" code={JVM_PROBES_CODE} />
      <P>{copy.kubernetes7[locale]}</P>
      <CodeBlock lang="bash" filename="apis" code={KUBECTL_CODE} />
      <P>{copy.kubernetes8[locale]}</P>
      <CodeBlock lang="text" filename="kubectl describe pod" code={PROBE_FAILURE_CODE} />

      <H2>{copy.memoryTitle[locale]}</H2>
      <P>{copy.memory1[locale]}</P>
      <P>{copy.memory2[locale]}</P>
      <P>{copy.memory3[locale]}</P>
      <CodeBlock lang="yaml" filename="apis/deployment.yaml" code={JVM_MEMORY_CODE} />
      <P>{copy.memory4[locale]}</P>
      <CodeBlock lang="json" filename="apis/workshops-dotnet/Workshops.Api/runtimeconfig.template.json" code={DOTNET_MEMORY_CODE} />
      <P>{copy.memory5[locale]}</P>
      <Callout variant="info" title={copy.memoryNoteTitle[locale]}>
        {copy.memoryNoteBody[locale]}
      </Callout>

      <H2>{copy.supplyTitle[locale]}</H2>
      <P>{copy.supply1[locale]}</P>
      <CodeBlock lang="bash" filename="apis/workshops-dotnet" code={SCAN_CODE} />
      <P>{copy.supply2[locale]}</P>
      <CodeBlock lang="yaml" filename="apis/deployment.yaml" code={DIGEST_CODE} />
      <P>{copy.supply3[locale]}</P>
      <P>{copy.supply4[locale]}</P>
      <P>{copy.supply5[locale]}</P>

      <H2>{copy.closeTitle[locale]}</H2>
      <P>{copy.close1[locale]}</P>
      <UL>
        <LI>{copy.takeaway1[locale]}</LI>
        <LI>{copy.takeaway2[locale]}</LI>
        <LI>{copy.takeaway3[locale]}</LI>
        <LI>{copy.takeaway4[locale]}</LI>
        <LI>{copy.takeaway5[locale]}</LI>
        <LI>{copy.takeaway6[locale]}</LI>
      </UL>
      <P>
        {copy.close2[locale]}
        <A href={`/${locale}/blog/building-an-api-in-csharp`}>{copy.csharpArticleLink[locale]}</A>
        {copy.close2Between[locale]}
        <A href={`/${locale}/blog/building-an-api-in-java`}>{copy.javaArticleLink[locale]}</A>
        {copy.close2And[locale]}
        <A href={`/${locale}/blog/building-an-api-in-kotlin`}>{copy.kotlinArticleLink[locale]}</A>
        {copy.close2After[locale]}
      </P>
    </>
  );
}

const DOCKERIGNORE_CODE = `.git
.gitignore
.dockerignore
Dockerfile
**/bin
**/obj
**/target
**/build
**/.gradle
**/.idea
**/.vs
**/*.user
**/appsettings.Development.json`;

const DOTNET_DOCKERFILE_CODE = `# syntax=docker/dockerfile:1

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /source
COPY . .
RUN --mount=type=cache,target=/root/.nuget/packages \\
    dotnet publish Workshops.Api/Workshops.Api.csproj \\
      --configuration Release \\
      --output /published

FROM mcr.microsoft.com/dotnet/aspnet:10.0-noble-chiseled AS runtime
WORKDIR /app
COPY --from=build /published .
USER $APP_UID
EXPOSE 8080
ENTRYPOINT ["dotnet", "Workshops.Api.dll"]`;

const DOTNET_BUILD_CODE = `docker build --tag workshops-dotnet:1.0.0 .`;

const DOTNET_RUN_CODE = `docker run --rm --publish 8081:8080 workshops-dotnet:1.0.0

info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://[::]:8080
info: Microsoft.Hosting.Lifetime[0]
      Application started. Press Ctrl+C to shut down.
info: Microsoft.Hosting.Lifetime[0]
      Hosting environment: Production
info: Microsoft.Hosting.Lifetime[0]
      Content root path: /app`;

const INVARIANT_CODE = `<PropertyGroup>
  <TargetFramework>net10.0</TargetFramework>
  <Nullable>enable</Nullable>
  <ImplicitUsings>enable</ImplicitUsings>
  <InvariantGlobalization>true</InvariantGlobalization>
</PropertyGroup>`;

const MAVEN_WRAPPER_CODE = `mvn wrapper:wrapper`;

const JAVA_DOCKERFILE_CODE = `# syntax=docker/dockerfile:1

FROM eclipse-temurin:25-jdk AS build
WORKDIR /source
COPY . .
RUN --mount=type=cache,target=/root/.m2 \\
    sh ./mvnw --batch-mode --projects workshops-api --also-make package -DskipTests
RUN cp workshops-api/target/workshops-api-1.0.0.jar application.jar \\
 && java -Djarmode=tools -jar application.jar extract --layers --destination /extracted

FROM eclipse-temurin:25-jre AS runtime
RUN apt-get update \\
 && apt-get install --yes --no-install-recommends curl \\
 && rm -rf /var/lib/apt/lists/* \\
 && useradd --uid 1654 --create-home --shell /usr/sbin/nologin app
WORKDIR /application
COPY --from=build --chown=1654:1654 /extracted/dependencies/ ./
COPY --from=build --chown=1654:1654 /extracted/spring-boot-loader/ ./
COPY --from=build --chown=1654:1654 /extracted/snapshot-dependencies/ ./
COPY --from=build --chown=1654:1654 /extracted/application/ ./
USER 1654
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "application.jar"]`;

const JAVA_BUILD_CODE = `docker build --tag workshops-java:1.0.0 .
docker run --rm --publish 8082:8080 workshops-java:1.0.0

Starting WorkshopsApplication using Java 25 with PID 1 (/application/application.jar started by app in /application)
Tomcat initialized with port 8080 (http)
Tomcat started on port 8080 (http) with context path '/'`;

const LAYERS_CODE = `extracted/dependencies/
extracted/spring-boot-loader/
extracted/snapshot-dependencies/
extracted/application/`;

const KOTLIN_DOCKERFILE_CODE = `# syntax=docker/dockerfile:1

FROM eclipse-temurin:25-jdk AS build
WORKDIR /source
COPY . .
RUN --mount=type=cache,target=/root/.gradle \\
    sh ./gradlew --no-daemon :workshops-spring:bootJar
RUN cp workshops-spring/build/libs/workshops-spring-1.0.0.jar application.jar \\
 && java -Djarmode=tools -jar application.jar extract --layers --destination /extracted

FROM eclipse-temurin:25-jre AS runtime
RUN apt-get update \\
 && apt-get install --yes --no-install-recommends curl \\
 && rm -rf /var/lib/apt/lists/* \\
 && useradd --uid 1654 --create-home --shell /usr/sbin/nologin app
WORKDIR /application
COPY --from=build --chown=1654:1654 /extracted/dependencies/ ./
COPY --from=build --chown=1654:1654 /extracted/spring-boot-loader/ ./
COPY --from=build --chown=1654:1654 /extracted/snapshot-dependencies/ ./
COPY --from=build --chown=1654:1654 /extracted/application/ ./
USER 1654
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "application.jar"]`;

const KTOR_DOCKERFILE_CODE = `RUN --mount=type=cache,target=/root/.gradle \\
    sh ./gradlew --no-daemon :workshops-ktor:installDist

COPY --from=build --chown=1654:1654 /source/workshops-ktor/build/install/workshops-ktor/ ./
ENTRYPOINT ["./bin/workshops-ktor"]`;

const ENVIRONMENT_CODE = `docker run --rm --publish 8081:8080 \\
  --env ASPNETCORE_ENVIRONMENT=Production \\
  --env ConnectionStrings__Workshops="Host=database;Database=workshops" \\
  workshops-dotnet:1.0.0`;

const DOTNET_HEALTH_CODE = `builder.Services.AddHealthChecks();

WebApplication app = builder.Build();

app.MapHealthChecks("/health");`;

const ACTUATOR_DEPENDENCY_CODE = `<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>`;

const ACTUATOR_YAML_CODE = `spring:
  application:
    name: workshops-api
  threads:
    virtual:
      enabled: true

management:
  endpoint:
    health:
      probes:
        enabled: true`;

const KOTLIN_ACTUATOR_CODE = `implementation("org.springframework.boot:spring-boot-starter-actuator")`;

const KTOR_HEALTH_CODE = `routing {
    get("/health") { call.respondText("ok") }

    route("/registrations") {`;

const COMPOSE_CODE = `name: workshops

services:
  database:
    image: postgres
    environment:
      POSTGRES_USER: workshops
      POSTGRES_PASSWORD: workshops
      POSTGRES_DB: workshops
    healthcheck:
      test: ["CMD-SHELL", "pg_isready --username workshops --dbname workshops"]
      interval: 5s
      timeout: 3s
      retries: 10
      start_period: 10s

  dotnet-api:
    build:
      context: ./workshops-dotnet
    environment:
      ASPNETCORE_ENVIRONMENT: Production
    ports:
      - "8081:8080"
    depends_on:
      database:
        condition: service_healthy

  java-api:
    build:
      context: ./workshops-java
    ports:
      - "8082:8080"
    depends_on:
      database:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "--fail", "--silent", "http://localhost:8080/actuator/health"]
      interval: 5s
      timeout: 3s
      retries: 10
      start_period: 20s

  kotlin-api:
    build:
      context: ./workshops-kotlin
    ports:
      - "8083:8080"
    depends_on:
      database:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "--fail", "--silent", "http://localhost:8080/actuator/health"]
      interval: 5s
      timeout: 3s
      retries: 10
      start_period: 20s`;

const COMPOSE_RUN_CODE = `docker compose up --build --detach
docker compose ps`;

const COMPOSE_PS_CODE = `NAME                     IMAGE                  SERVICE      STATUS                   PORTS
workshops-database-1     postgres               database     Up 2 minutes (healthy)   5432/tcp
workshops-dotnet-api-1   workshops-dotnet-api   dotnet-api   Up 2 minutes             0.0.0.0:8081->8080/tcp
workshops-java-api-1     workshops-java-api     java-api     Up 2 minutes (healthy)   0.0.0.0:8082->8080/tcp
workshops-kotlin-api-1   workshops-kotlin-api   kotlin-api   Up 2 minutes (healthy)   0.0.0.0:8083->8080/tcp`;

const COMPOSE_CURL_CODE = `curl -i http://localhost:8081/health

HTTP/1.1 200 OK
Content-Type: text/plain

Healthy

curl -i http://localhost:8082/actuator/health

HTTP/1.1 200
Content-Type: application/vnd.spring-boot.actuator.v3+json

{"status":"UP","groups":["liveness","readiness"]}`;

const DEPLOYMENT_CODE = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: workshops-api
spec:
  replicas: 2
  selector:
    matchLabels:
      app.kubernetes.io/name: workshops-api
  template:
    metadata:
      labels:
        app.kubernetes.io/name: workshops-api
    spec:
      securityContext:
        runAsNonRoot: true
        runAsUser: 1654
        seccompProfile:
          type: RuntimeDefault
      containers:
        - name: api
          image: registry.example/workshops-api:1.0.0
          ports:
            - name: http
              containerPort: 8080
          env:
            - name: ASPNETCORE_ENVIRONMENT
              value: Production
          startupProbe:
            httpGet:
              path: /health
              port: http
            periodSeconds: 2
            failureThreshold: 30
          readinessProbe:
            httpGet:
              path: /health
              port: http
            periodSeconds: 5
            timeoutSeconds: 2
            failureThreshold: 3
          livenessProbe:
            httpGet:
              path: /health
              port: http
            periodSeconds: 10
            timeoutSeconds: 2
            failureThreshold: 3
          resources:
            requests:
              cpu: 100m
              memory: 256Mi
            limits:
              memory: 512Mi
          securityContext:
            allowPrivilegeEscalation: false
            readOnlyRootFilesystem: true
            capabilities:
              drop:
                - ALL
          volumeMounts:
            - name: temporary
              mountPath: /tmp
      volumes:
        - name: temporary
          emptyDir: {}`;

const JVM_PROBES_CODE = `          startupProbe:
            httpGet:
              path: /actuator/health/liveness
              port: http
            periodSeconds: 2
            failureThreshold: 45
          readinessProbe:
            httpGet:
              path: /actuator/health/readiness
              port: http
            periodSeconds: 5
            failureThreshold: 3
          livenessProbe:
            httpGet:
              path: /actuator/health/liveness
              port: http
            periodSeconds: 10
            failureThreshold: 3`;

const KUBECTL_CODE = `kubectl apply -f deployment.yaml
deployment.apps/workshops-api created

kubectl get pods --selector app.kubernetes.io/name=workshops-api
NAME                             READY   STATUS    RESTARTS   AGE
workshops-api-7d9c8f6b45-2fzq8   1/1     Running   0          34s
workshops-api-7d9c8f6b45-hk4vn   1/1     Running   0          34s`;

const PROBE_FAILURE_CODE = `Events:
  Type     Reason     Age   From     Message
  ----     ------     ----  ----     -------
  Warning  Unhealthy  12s   kubelet  Readiness probe failed: HTTP probe failed with statuscode: 503`;

const JVM_MEMORY_CODE = `          env:
            - name: JAVA_TOOL_OPTIONS
              value: -XX:MaxRAMPercentage=75.0`;

const DOTNET_MEMORY_CODE = `{
  "configProperties": {
    "System.GC.HeapHardLimitPercent": 75
  }
}`;

const SCAN_CODE = `docker scout cves workshops-dotnet:1.0.0

docker push registry.example/workshops-api:1.0.0
1.0.0: digest: sha256:2f0c9a4d7e1b8c35f0a6d92b47c1e08a3b5d6f2149ac7b0e3d81f6c2a94e7b03 size: 1789`;

const DIGEST_CODE = `          image: registry.example/workshops-api@sha256:2f0c9a4d7e1b8c35f0a6d92b47c1e08a3b5d6f2149ac7b0e3d81f6c2a94e7b03
          imagePullPolicy: IfNotPresent`;

const COPY = {
  contentsLabel: { en: "In this article", nl: "In dit artikel" },
  lead: {
    en: "An image is a decision about what your application is allowed to be. Everything left inside it is something you ship, something you patch and something an attacker can use.",
    nl: "Een image is een besluit over wat je applicatie mag zijn. Alles wat erin blijft zitten, lever je mee, patch je mee en kan een aanvaller gebruiken.",
  },
  intro1: {
    en: "At bol.com I built the app for software and games from an empty folder to production, which included server rendering, routing, CI/CD, Google Cloud and Kubernetes. What I learned there is that the container is the moment a piece of software stops being yours alone. From then on a platform starts it, watches it, kills it and starts it again, and it does all of that from the outside.",
    nl: "Bij bol.com bouwde ik de app voor software en games van een lege map tot productie, met server rendering, routering, CI/CD, Google Cloud en Kubernetes. Wat ik daar leerde: de container is het moment waarop software niet langer alleen van jou is. Vanaf dat punt start een platform hem, kijkt ernaar, stopt hem en start hem opnieuw, en dat doet het allemaal van buitenaf.",
  },
  intro2: {
    en: "That pattern came back everywhere before it. At Omniplan the services ran on Azure App Services with Docker and Kubernetes. At Ortec deployment ran through Docker to Azure inside a CI/CD pipeline. At Athlon delivery ran on Azure DevOps with Docker and Kubernetes, and at the Belastingdienst and the Nationale Postcode Loterij Docker sat in the pipeline. The tools differ per client. The questions the platform asks the image are the same.",
    nl: "Dat patroon kwam daarvoor overal terug. Bij Omniplan draaiden de services op Azure App Services met Docker en Kubernetes. Bij Ortec liep de deployment via Docker naar Azure in een CI/CD-pijplijn. Bij Athlon liep de oplevering op Azure DevOps met Docker en Kubernetes, en bij de Belastingdienst en de Nationale Postcode Loterij zat Docker in de pijplijn. De gereedschappen verschillen per klant. De vragen die het platform aan het image stelt zijn dezelfde.",
  },
  versions: {
    en: "The samples target Docker Engine 29 with BuildKit and the docker/dockerfile:1 frontend, Compose 5.5, the .NET 10 images, Eclipse Temurin 25 with Spring Boot 4.1, and Kubernetes 1.37, checked on 8 September 2026. Compose reads compose.yaml and the version key at the top of that file has been obsolete for a while, so it is not here.",
    nl: "De voorbeelden zijn geschreven voor Docker Engine 29 met BuildKit en de frontend docker/dockerfile:1, Compose 5.5, de .NET 10-images, Eclipse Temurin 25 met Spring Boot 4.1 en Kubernetes 1.37, gecontroleerd op 8 september 2026. Compose leest compose.yaml, en de version-sleutel bovenin dat bestand is al een tijd overbodig, dus die staat er niet in.",
  },
  example: {
    en: "The example is the workshop registration API the three previous articles in this series build: four routes, a workshop with a number of places, and a registration that is refused when the last place is taken. One of them is written in C#, one in Java and one in Kotlin. By the end of this article all three are images, all three run beside a database, and one of them runs on a cluster.",
    nl: "Het voorbeeld is de inschrijf-API voor workshops die de drie vorige artikelen in deze reeks bouwen: vier routes, een workshop met een aantal plaatsen, en een inschrijving die wordt geweigerd zodra de laatste plaats bezet is. Eén ervan is in C# geschreven, één in Java en één in Kotlin. Aan het eind van dit artikel zijn ze alle drie een image, draaien ze alle drie naast een database, en draait er één op een cluster.",
  },
  quote: {
    en: "A container that cannot say how it is doing leaves the decision to a platform that has to guess.",
    nl: "Een container die niet kan zeggen hoe het met hem gaat, laat de beslissing over aan een platform dat moet gokken.",
  },

  nodeContext: { en: "Build context", nl: "Buildcontext" },
  nodeContextSub: { en: "the folder you point at", nl: "de map die je aanwijst" },
  nodeBuild: { en: "Build stage", nl: "Buildstage" },
  nodeBuildSub: { en: "SDK, Maven or Gradle", nl: "SDK, Maven of Gradle" },
  nodeRuntime: { en: "Runtime stage", nl: "Runtimestage" },
  nodeRuntimeSub: { en: "runtime plus your output", nl: "runtime plus jouw output" },
  nodeLeft: { en: "Left behind", nl: "Blijft achter" },
  nodeLeftSub: { en: "compiler, source, package cache", nl: "compiler, broncode, packagecache" },
  edgeLeft: { en: "never copied", nl: "nooit gekopieerd" },
  stageAria: {
    en: "Two stage build in which the build stage is left behind",
    nl: "Multi-stage build waarin de buildstage achterblijft",
  },
  stageCaption: {
    en: "The compiler, the source and the package cache stay in the first stage and never reach the image you ship.",
    nl: "De compiler, de broncode en de packagecache blijven in de eerste stage en komen nooit in het image dat je uitrolt.",
  },

  nodeStart: { en: "Container starts", nl: "Container start" },
  nodeStartSub: { en: "the process runs, nothing is ready", nl: "het proces draait, niets is klaar" },
  nodeStartup: { en: "Startup probe", nl: "Startup-probe" },
  nodeStartupSub: { en: "runs on its own first", nl: "loopt eerst alleen" },
  nodeReadiness: { en: "Readiness probe", nl: "Readiness-probe" },
  nodeReadinessSub: { en: "asked every few seconds", nl: "wordt elke paar seconden gesteld" },
  nodeLiveness: { en: "Liveness probe", nl: "Liveness-probe" },
  nodeLivenessSub: { en: "asked every few seconds", nl: "wordt elke paar seconden gesteld" },
  nodeTraffic: { en: "Traffic", nl: "Verkeer" },
  nodeRestart: { en: "Restart", nl: "Herstart" },
  edgePassed: { en: "after it passes", nl: "nadat hij slaagt" },
  edgeFailed: { en: "after it fails", nl: "nadat hij faalt" },
  probeAria: {
    en: "Startup, readiness and liveness probes against one container",
    nl: "Startup-, readiness- en liveness-probes tegen één container",
  },
  probeCaption: {
    en: "The startup probe holds the other two back until the application is up, readiness decides who gets traffic, and liveness decides who gets restarted.",
    nl: "De startup-probe houdt de andere twee tegen tot de applicatie draait, readiness bepaalt wie verkeer krijgt en liveness bepaalt wie opnieuw wordt gestart.",
  },

  goodTitle: { en: "What a good image is measured by", nl: "Waar je een goed image aan afmeet" },
  good1: {
    en: "Before any Dockerfile, it helps to know what you are aiming at. Five questions cover it, and every choice in this article answers one of them.",
    nl: "Voor je een Dockerfile schrijft, helpt het om te weten waar je op mikt. Vijf vragen dekken het, en elke keuze in dit artikel beantwoordt er één van.",
  },
  goodStartsLabel: { en: "Does it start and stop cleanly?", nl: "Start en stopt hij netjes?" },
  goodStarts: {
    en: "One process in the foreground, logs to standard output, and a stop signal that the process actually handles. A container that ignores the signal is killed after the grace period, and any request in flight goes with it.",
    nl: "Eén proces op de voorgrond, logs naar standard output, en een stopsignaal dat het proces echt afhandelt. Een container die het signaal negeert, wordt na de respijttijd afgeschoten, en elk lopend request gaat mee.",
  },
  goodInsideLabel: { en: "What is in it?", nl: "Wat zit erin?" },
  goodInside: {
    en: "Every file in the image is a file someone has to keep patched. A compiler, a package manager and a shell all widen what an attacker can reach after a break-in, and none of them is needed to serve a request.",
    nl: "Elk bestand in het image is een bestand dat iemand gepatcht moet houden. Een compiler, een packagemanager en een shell vergroten allemaal wat een aanvaller na een inbraak kan bereiken, en geen ervan is nodig om een request te beantwoorden.",
  },
  goodWhoLabel: { en: "Who runs it?", nl: "Wie draait hem?" },
  goodWho: {
    en: "A named user that is not root, with a filesystem it may not write to. This is one line in the Dockerfile and a handful in the Deployment, and it is the cheapest security you will ever buy.",
    nl: "Een benoemde gebruiker die geen root is, met een bestandssysteem waar hij niet in mag schrijven. Dat is één regel in de Dockerfile en een handvol in de Deployment, en het is de goedkoopste beveiliging die je ooit koopt.",
  },
  goodOutsideLabel: { en: "What does it read from outside?", nl: "Wat leest hij van buiten?" },
  goodOutside: {
    en: "The same image has to run on a laptop, on a test cluster and in production. Everything that differs between those three comes in through the environment, so the artifact that was tested is the artifact that ships.",
    nl: "Hetzelfde image moet draaien op een laptop, op een testcluster en in productie. Alles wat tussen die drie verschilt, komt binnen via de omgeving, zodat het artefact dat getest is ook het artefact is dat live gaat.",
  },
  goodAgainLabel: { en: "Can you build it again?", nl: "Kun je hem opnieuw bouwen?" },
  goodAgain: {
    en: "The same commit gives the same image, the base image is pinned, and a rebuild after a change to one source file does not download the world again. Build caching is not a comfort feature, it is what keeps a pipeline usable.",
    nl: "Dezelfde commit geeft hetzelfde image, het base image ligt vast, en een rebuild na een wijziging in één bronbestand haalt niet opnieuw de halve wereld binnen. Buildcaching is geen comfort, het is wat een pijplijn bruikbaar houdt.",
  },
  good2: {
    en: "Notice what is not on that list. Nothing here is about how small the image is in megabytes. Size follows from the second question, and it is the contents that matter, not the number.",
    nl: "Let op wat er niet in die lijst staat. Niets hier gaat over hoe klein het image in megabytes is. Grootte volgt uit de tweede vraag, en het gaat om de inhoud, niet om het getal.",
  },

  patternTitle: { en: "The multi stage build, in one pattern", nl: "De multi-stage build, in één patroon" },
  pattern1: {
    en: "All three Dockerfiles in this article have the same shape. A first stage carries the toolchain and turns source into an artifact. A second stage carries only the runtime and copies that artifact in. The first stage never becomes part of the image you push.",
    nl: "Alle drie de Dockerfiles in dit artikel hebben dezelfde vorm. Een eerste stage bevat de toolchain en maakt van broncode een artefact. Een tweede stage bevat alleen de runtime en kopieert dat artefact erin. De eerste stage wordt nooit onderdeel van het image dat je pusht.",
  },
  pattern2: {
    en: "The first line of every file is a directive, not a comment. It tells the builder which Dockerfile frontend to use, and docker/dockerfile:1 keeps you on the latest release of version one. That directive is what makes the cache mount below legal.",
    nl: "De eerste regel van elk bestand is een directive, geen commentaar. Hij zegt de builder welke Dockerfile-frontend hij moet gebruiken, en docker/dockerfile:1 houdt je op de nieuwste uitgave van versie één. Die directive maakt de cache mount hieronder mogelijk.",
  },
  pattern3: {
    en: "The package cache gets a mount of its own. A RUN with --mount=type=cache,target=... keeps NuGet, Maven or Gradle packages in a cache that BuildKit owns between builds, and nothing of it lands in a layer. Without it you either download every dependency on every build, or you bake the cache into the image and carry it forever.",
    nl: "De packagecache krijgt een eigen mount. Een RUN met --mount=type=cache,target=... bewaart de packages van NuGet, Maven of Gradle in een cache die BuildKit tussen builds beheert, en daarvan belandt niets in een laag. Zonder die mount haal je elke build alle dependencies opnieuw op, of bak je de cache in het image en sleep je hem eeuwig mee.",
  },
  pattern4: {
    en: "The three projects sit next to each other in one folder, each with its own Dockerfile and its own build context. Compose and the Deployment sit one level up, because they describe how the three run together and not how one is built.",
    nl: "De drie projecten staan naast elkaar in één map, elk met een eigen Dockerfile en een eigen buildcontext. Compose en de Deployment staan een niveau hoger, want die beschrijven hoe de drie samen draaien en niet hoe er één wordt gebouwd.",
  },
  treeCompose: { en: "all three side by side", nl: "alle drie naast elkaar" },
  treeDeployment: { en: "one of them on a cluster", nl: "één ervan op een cluster" },
  treeDotnet: { en: "from the ASP.NET Core article", nl: "uit het ASP.NET Core-artikel" },
  treeJava: { en: "from the Spring Boot article", nl: "uit het Spring Boot-artikel" },
  treeKotlin: { en: "from the Kotlin article", nl: "uit het Kotlin-artikel" },
  treeWrapper: { en: "the build tool the image uses", nl: "de buildtool die het image gebruikt" },
  treeCaption: {
    en: "The two files added per project are the Dockerfile and the .dockerignore. Everything else came from the earlier articles.",
    nl: "De twee bestanden die per project bij komen, zijn de Dockerfile en de .dockerignore. De rest komt uit de eerdere artikelen.",
  },
  pattern5: {
    en: "The .dockerignore is the same in all three projects. It matters more than it looks: everything it does not exclude is uploaded to the builder on every build, and a stale bin, target or build folder from a local run travels along and can confuse the build stage, which then works around output that was produced somewhere else.",
    nl: "De .dockerignore is in alle drie de projecten hetzelfde. Hij doet meer dan hij lijkt te doen: alles wat hij niet uitsluit, gaat bij elke build naar de builder, en een oude bin-, target- of build-map van een lokale run reist mee en kan de buildstage in de war brengen, die dan verder werkt rond output die ergens anders is gemaakt.",
  },
  pattern6: {
    en: "Two entries deserve a look. The build tool wrapper is not excluded, because the build stage calls it. And appsettings.Development.json stays out, so a local connection string never travels to a registry.",
    nl: "Twee regels verdienen aandacht. De wrapper van de buildtool wordt niet uitgesloten, want de buildstage roept hem aan. En appsettings.Development.json blijft eruit, zodat een lokale connectionstring nooit naar een registry reist.",
  },

  dotnetTitle: { en: "A .NET image: SDK stage, publish, chiseled runtime", nl: "Een .NET-image: SDK-stage, publish, chiseled runtime" },
  dotnet1: {
    en: "The .NET file is the shortest of the three, because dotnet publish already does the work that other toolchains split over several commands.",
    nl: "Het .NET-bestand is het kortste van de drie, omdat dotnet publish het werk al doet dat andere toolchains over meerdere commando's verdelen.",
  },
  dotnet2: {
    en: "Publish, not build. A build leaves the output spread over obj and bin folders and expects the SDK to be around. A publish writes a self-contained folder with the application, its dependencies and the runtime configuration, which is exactly the set of files the runtime image needs.",
    nl: "Publish, geen build. Een build laat de output verspreid achter over obj- en bin-mappen en verwacht dat de SDK in de buurt is. Een publish schrijft één map met de applicatie, haar dependencies en de runtimeconfiguratie, en dat is precies de verzameling bestanden die het runtime image nodig heeft.",
  },
  dotnet3: {
    en: "The runtime image is the chiseled variant. Chiseled means the base has been cut down to what the .NET runtime needs: no shell, no package manager, no apt, no busybox. You cannot open a terminal in it, which is uncomfortable the first time you want to debug something and correct every other day of the year.",
    nl: "Het runtime image is de chiseled variant. Chiseled betekent dat de basis is teruggebracht tot wat de .NET-runtime nodig heeft: geen shell, geen packagemanager, geen apt, geen busybox. Je kunt er geen terminal in openen, wat de eerste keer dat je iets wilt debuggen ongemakkelijk is en alle andere dagen van het jaar precies goed.",
  },
  dotnet4: {
    en: "Building it takes one command from inside the project folder.",
    nl: "Bouwen doe je met één commando vanuit de projectmap.",
  },
  dotnet5: {
    en: "The tag carries the version of the application, not the word latest. A tag that moves means you can never say which build is running, and a rollback becomes a guess.",
    nl: "De tag draagt de versie van de applicatie, niet het woord latest. Een tag die meebeweegt betekent dat je nooit kunt zeggen welke build draait, en dan wordt een rollback gokwerk.",
  },

  nonRootTitle: { en: "Non root, the app user and port 8080", nl: "Niet als root, de gebruiker app en poort 8080" },
  nonRoot1: {
    en: "The .NET images ship a non-root user called app, and its numeric id is available in the image as APP_UID, which is 1654. Writing USER $APP_UID picks it up without repeating the number. The chiseled and distroless variants already set that user themselves, and the line is still worth having, because it survives a move to the plain Ubuntu variant, which does not.",
    nl: "De .NET-images bevatten een niet-root gebruiker die app heet, en zijn numerieke id staat in het image als APP_UID, namelijk 1654. Met USER $APP_UID pak je die op zonder het nummer te herhalen. De chiseled en distroless varianten zetten die gebruiker zelf al, en de regel is toch de moeite waard, want hij overleeft een overstap naar de gewone Ubuntu-variant, die dat niet doet.",
  },
  nonRoot2: {
    en: "The port follows from the same choice. A process that is not root may not bind to a port below 1024 without an extra capability, so the .NET images listen on 8080 and nothing in the chain needs privileges. The published port on your machine can be anything, and the port inside the container stays 8080 for all three services.",
    nl: "De poort volgt uit dezelfde keuze. Een proces dat geen root is, mag zonder extra capability niet binden aan een poort onder 1024, dus luisteren de .NET-images op 8080 en heeft niets in de keten rechten nodig. De gepubliceerde poort op je eigen machine mag alles zijn, en de poort binnen de container blijft voor alle drie de services 8080.",
  },
  nonRoot3: {
    en: "Run it and the application says where it listens.",
    nl: "Draai hem, en de applicatie vertelt waar hij luistert.",
  },
  nonRoot4: {
    en: "Two details in that output are worth reading. The address is the container's own, not localhost on your machine, which is why the published port is what you call. And the hosting environment is Production, because that is the default in the image and not something the Dockerfile had to set.",
    nl: "Twee details in die uitvoer zijn het lezen waard. Het adres is dat van de container zelf, niet localhost op je eigen machine, en daarom bel je de gepubliceerde poort. En de hosting environment is Production, want dat is de standaard in het image en niet iets wat de Dockerfile hoefde te zetten.",
  },
  nonRootWarningTitle: { en: "A writable folder is a decision", nl: "Een schrijfbare map is een besluit" },
  nonRootWarningBody: {
    en: "A non-root user cannot write to /app. If your application writes files, mount a volume for that path and keep the rest read only. An application that needs to write next to its own binaries is telling you something about its design.",
    nl: "Een niet-root gebruiker kan niet schrijven in /app. Schrijft je applicatie bestanden, mount dan een volume voor dat pad en houd de rest alleen-lezen. Een applicatie die naast haar eigen binaries moet schrijven, vertelt iets over haar ontwerp.",
  },

  globalisationTitle: { en: "Globalisation, ICU and the -extra variant", nl: "Globalisatie, ICU en de -extra variant" },
  globalisation1: {
    en: "The chiseled image is small because things were removed, and one of them is ICU, the library .NET uses for culture-aware behaviour. Without it a default .NET application stops during startup with a message about a missing valid ICU package, which is a confusing first encounter with a container that ran fine on your machine.",
    nl: "Het chiseled image is klein doordat er dingen uit zijn gehaald, en één daarvan is ICU, de bibliotheek die .NET gebruikt voor cultuurafhankelijk gedrag. Zonder ICU stopt een standaard .NET-applicatie tijdens het opstarten met een melding over een ontbrekend geldig ICU-pakket, en dat is een verwarrende eerste kennismaking met een container die op je eigen machine prima liep.",
  },
  globalisation2: {
    en: "There are two answers, and which one is right depends on the application. This API compares nothing by culture and formats its timestamps in the one format its clients parse, so it opts out of culture-aware behaviour in the project file and keeps the smaller image.",
    nl: "Er zijn twee antwoorden, en welk antwoord klopt hangt van de applicatie af. Deze API vergelijkt niets cultuurafhankelijk en schrijft haar tijdstempels in het ene formaat dat haar clients lezen, dus zet hij cultuurafhankelijk gedrag uit in het projectbestand en houdt hij het kleinere image.",
  },
  globalisation3: {
    en: "The other answer is the -extra variant of the same tag, which adds ICU and tzdata back. You need it as soon as the application sorts or compares strings the way a language expects, formats a number or a date for a person to read, or converts between time zones by name. Guessing wrong in that direction is expensive, because the failure is silent: a sort order that is subtly wrong in one language does not throw an exception.",
    nl: "Het andere antwoord is de -extra variant van dezelfde tag, die ICU en tzdata terugzet. Je hebt hem nodig zodra de applicatie tekst sorteert of vergelijkt zoals een taal dat verwacht, een getal of een datum voor een mens opmaakt, of tussen tijdzones met een naam omrekent. Daar verkeerd gokken is duur, want de fout is stil: een sorteervolgorde die in één taal net verkeerd is, gooit geen exception.",
  },
  globalisation4: {
    en: "The JVM images in the next two sections carry a full base and this question does not come up there. That is part of what you buy with the larger Java runtime image.",
    nl: "De JVM-images in de volgende twee secties hebben een volledige basis en daar speelt deze vraag niet. Dat is een deel van wat je koopt met het grotere Java-runtime-image.",
  },

  javaTitle: { en: "A Java image: build stage, layered extraction, JRE runtime", nl: "Een Java-image: buildstage, lagen uitpakken, JRE-runtime" },
  java1: {
    en: "The Java project is a Maven aggregator with a domain module and an API module. The image builds it with the Maven Wrapper, so the version of Maven is a property of the repository and not of whatever happens to be installed on the machine that builds. If the project does not have the wrapper yet, one command adds it.",
    nl: "Het Javaproject is een Maven-aggregator met een domeinmodule en een API-module. Het image bouwt het met de Maven Wrapper, zodat de Maven-versie een eigenschap van de repository is en niet van wat er toevallig staat op de machine die bouwt. Heeft het project de wrapper nog niet, dan voegt één commando hem toe.",
  },
  java2: {
    en: "That writes mvnw, mvnw.cmd and a .mvn folder, all of which belong in version control. With those in place the Dockerfile is the same shape as the .NET one, with one stage more work in the middle.",
    nl: "Dat schrijft mvnw, mvnw.cmd en een map .mvn, en die horen alle drie in versiebeheer. Daarmee heeft de Dockerfile dezelfde vorm als die van .NET, met één stap extra werk in het midden.",
  },
  java3: {
    en: "The wrapper is called through sh, so the file does not need an executable bit from your checkout. That is a real problem on Windows, where the bit is often missing and the build fails with a permission error that says nothing about the cause. The --projects and --also-make pair builds the API module and the domain module it depends on, and leaves the rest of the aggregator alone.",
    nl: "De wrapper wordt via sh aangeroepen, zodat het bestand geen uitvoerbit uit je checkout nodig heeft. Dat is een echt probleem op Windows, waar dat bit vaak ontbreekt en de build strandt op een rechtenfout die niets over de oorzaak zegt. Het paar --projects en --also-make bouwt de API-module en de domeinmodule waarvan hij afhangt, en laat de rest van de aggregator met rust.",
  },
  java4: {
    en: "The runtime image is the JRE variant, not the JDK. A JDK carries a compiler and the development tools, and an application that is already compiled has no use for either. The one thing installed on top is curl, and it is there for a single reason that the section on health endpoints explains.",
    nl: "Het runtime image is de JRE-variant, niet de JDK. Een JDK bevat een compiler en de ontwikkeltools, en een applicatie die al gecompileerd is heeft aan geen van beide iets. Het enige wat er wordt bijgezet is curl, en dat staat er om één reden die de sectie over health-endpoints uitlegt.",
  },
  java5: {
    en: "The user is created by hand here, with the same numeric id the .NET images use, so all three containers in this article run as 1654 and one Deployment can name that id for every one of them.",
    nl: "De gebruiker wordt hier met de hand aangemaakt, met hetzelfde numerieke id dat de .NET-images gebruiken, zodat alle drie de containers in dit artikel als 1654 draaien en één Deployment dat id voor elk van hen kan noemen.",
  },
  java6: {
    en: "The jar is copied to application.jar before it is extracted, and that rename is what keeps the entry point identical for the Java and the Kotlin image. The application layer that comes out of the extraction is named after the jar that went in.",
    nl: "De jar wordt naar application.jar gekopieerd voordat hij wordt uitgepakt, en die hernoeming houdt het entrypoint voor het Java-image en het Kotlin-image gelijk. De applicatielaag die uit het uitpakken komt, is genoemd naar de jar die erin ging.",
  },

  layeringTitle: { en: "The Spring Boot layering change, and the flag that broke", nl: "De laagwijziging in Spring Boot, en de vlag die brak" },
  layering1: {
    en: "A Spring Boot jar is one file with everything in it, and copying it into an image as one file makes every layer above it useless. Change a single line of your own code and the whole jar changes, so the whole layer is pushed and pulled again, dependencies and all. Layered extraction splits that jar into parts that change at different speeds.",
    nl: "Een Spring Boot-jar is één bestand met alles erin, en dat als één bestand in een image kopiëren maakt elke laag erboven waardeloos. Verander één regel eigen code en de hele jar verandert, dus wordt de hele laag opnieuw gepusht en gepulld, dependencies en al. Lagen uitpakken splitst die jar in delen die met verschillende snelheid veranderen.",
  },
  layering2: {
    en: "The command that does it changed. For years the answer was -Djarmode=layertools, and that mode is gone in Spring Boot 4.1. The replacement is -Djarmode=tools with the extract command, and it covers more than layering on its own. A pipeline that still passes the old flag does not warn, it stops on an unsupported jar mode and extracts nothing.",
    nl: "Het commando dat dat doet, is veranderd. Jarenlang was het antwoord -Djarmode=layertools, en die modus is verdwenen in Spring Boot 4.1. De vervanger is -Djarmode=tools met het commando extract, en die doet meer dan alleen lagen maken. Een pijplijn die nog de oude vlag meegeeft, waarschuwt niet, maar stopt op een niet-ondersteunde jarmode en pakt niets uit.",
  },
  layeringWarningTitle: { en: "The flag that broke", nl: "De vlag die brak" },
  layeringWarningBody: {
    en: "Every Dockerfile, every pipeline template and every internal example that still carries -Djarmode=layertools has to change at the same time as the upgrade to Spring Boot 4.1. The flag is usually in more places than the one you edited, and each of them fails at the point where an image would have been produced.",
    nl: "Elke Dockerfile, elk pijplijnsjabloon en elk intern voorbeeld met -Djarmode=layertools erin moet tegelijk met de upgrade naar Spring Boot 4.1 mee. De vlag staat meestal op meer plekken dan die ene die je aanpaste, en elk daarvan valt om op het punt waar een image had moeten ontstaan.",
  },
  layering3: {
    en: "The extraction writes four directories, and the order in which they are copied is the point of the whole exercise.",
    nl: "Het uitpakken schrijft vier mappen, en de volgorde waarin ze worden gekopieerd is waar het hele plan om draait.",
  },
  layering4: {
    en: "Dependencies first, because they change when you change a version in the build file. The loader after that, because it changes when Spring Boot changes. Snapshot dependencies next, because they move faster than releases. Your own application last, because it changes every commit. Each COPY becomes its own layer, so a normal working day only replaces the last one.",
    nl: "Eerst de dependencies, want die veranderen als je een versie in het buildbestand wijzigt. Daarna de loader, want die verandert als Spring Boot verandert. Dan de snapshot-dependencies, want die bewegen sneller dan releases. Je eigen applicatie als laatste, want die verandert elke commit. Elke COPY wordt een eigen laag, dus een gewone werkdag vervangt alleen de laatste.",
  },

  kotlinTitle: { en: "A Kotlin image, and why it is the Java one", nl: "Een Kotlin-image, en waarom het het Java-image is" },
  kotlin1: {
    en: "Kotlin compiles to bytecode that the same runtime executes, so the runtime stage does not know which language it is serving. Three lines differ from the Java file, and all three of them are Gradle where the Java file is Maven.",
    nl: "Kotlin compileert naar bytecode die dezelfde runtime uitvoert, dus de runtimestage weet niet welke taal hij bedient. Drie regels wijken af van het Javabestand, en die drie zijn Gradle waar het Javabestand Maven gebruikt.",
  },
  kotlin2: {
    en: "The cache mount points at the Gradle home, the build task is bootJar on the Spring module, and the jar comes out of build/libs. Everything below the extraction is character for character the same file.",
    nl: "De cache mount wijst naar de Gradle-home, de buildtaak is bootJar op de Spring-module, en de jar komt uit build/libs. Alles onder het uitpakken is teken voor teken hetzelfde bestand.",
  },
  kotlin3: {
    en: "The Kotlin project also has a Ktor module, and that one is not a Spring Boot application, so there is no layered jar to extract. The application plugin that Ktor brings along produces a start script and a lib folder instead, and two lines swap in for the extraction.",
    nl: "Het Kotlinproject heeft ook een Ktor-module, en die is geen Spring Boot-applicatie, dus valt er geen gelaagde jar uit te pakken. De application-plugin die Ktor meebrengt maakt in plaats daarvan een startscript en een lib-map, en twee regels vervangen het uitpakken.",
  },
  kotlin4: {
    en: "That is the whole difference between the two Kotlin applications at the image level. Layering is a Spring Boot feature, not a JVM feature, and an application that does not use it copies its libraries as one directory and lives with a coarser cache.",
    nl: "Dat is op imageniveau het hele verschil tussen de twee Kotlin-applicaties. Lagen zijn een functie van Spring Boot, niet van de JVM, en een applicatie die ze niet gebruikt kopieert haar bibliotheken als één map en leeft met een grovere cache.",
  },

  configurationTitle: { en: "Configuration through the environment, not the image", nl: "Configuratie via de omgeving, niet via het image" },
  configuration1: {
    en: "One image runs in every environment, and the difference comes in from outside. All three frameworks read environment variables without a line of code from you, and each has its own convention for nesting.",
    nl: "Eén image draait in elke omgeving, en het verschil komt van buiten binnen. Alle drie de frameworks lezen omgevingsvariabelen zonder één regel code van jou, en elk heeft een eigen afspraak voor nesting.",
  },
  configDotnetLabel: { en: "ASP.NET Core.", nl: "ASP.NET Core." },
  configDotnet: {
    en: "Every configuration key is available as a variable, with two underscores where the key has a colon. ConnectionStrings__Workshops sets the connection string named Workshops. ASPNETCORE_ENVIRONMENT picks the environment name and ASPNETCORE_HTTP_PORTS moves the port.",
    nl: "Elke configuratiesleutel is beschikbaar als variabele, met twee underscores waar de sleutel een dubbele punt heeft. ConnectionStrings__Workshops zet de connectionstring die Workshops heet. ASPNETCORE_ENVIRONMENT kiest de naam van de omgeving en ASPNETCORE_HTTP_PORTS verzet de poort.",
  },
  configSpringLabel: { en: "Spring Boot.", nl: "Spring Boot." },
  configSpring: {
    en: "Relaxed binding maps a variable in capitals with underscores onto a property with dots. SPRING_PROFILES_ACTIVE sets the active profile and SERVER_PORT moves the port, and any property in your own application.yaml can be overridden the same way.",
    nl: "Relaxed binding legt een variabele in hoofdletters met underscores op een property met punten. SPRING_PROFILES_ACTIVE zet het actieve profiel en SERVER_PORT verzet de poort, en elke property in je eigen application.yaml is op dezelfde manier te overschrijven.",
  },
  configKtorLabel: { en: "Ktor.", nl: "Ktor." },
  configKtor: {
    en: "There is no convention to learn, because the module reads what it needs itself. A value from System.getenv with a default beside it is the whole mechanism, and it is worth writing that default down where the reader of the code can see it.",
    nl: "Er valt geen afspraak te leren, want de module leest zelf wat hij nodig heeft. Een waarde uit System.getenv met een standaardwaarde ernaast is het hele mechanisme, en die standaardwaarde is het waard om op te schrijven waar de lezer van de code hem ziet.",
  },
  configuration2: {
    en: "What does not belong in the environment at build time is a secret. A build argument ends up in the image history and anyone who can pull the image can read it back, and an ENV line is worse, because the value is still there at runtime for every process in the container. Secrets arrive when the container starts, from the orchestrator.",
    nl: "Wat tijdens het bouwen niet in de omgeving thuishoort, is een geheim. Een buildargument komt in de historie van het image terecht en iedereen die het image kan pullen leest het terug, en een ENV-regel is erger, want die waarde staat er ook tijdens het draaien nog, voor elk proces in de container. Geheimen komen binnen als de container start, vanuit de orchestrator.",
  },
  configuration3: {
    en: "If a secret really has to be available during the build, BuildKit has a mount for it. A RUN with --mount=type=secret exposes the value as a file for the length of that one command and keeps it out of every layer.",
    nl: "Moet een geheim echt beschikbaar zijn tijdens de build, dan heeft BuildKit daar een mount voor. Een RUN met --mount=type=secret zet de waarde als bestand klaar voor de duur van dat ene commando en houdt hem uit elke laag.",
  },

  healthTitle: { en: "Health endpoints, and HEALTHCHECK in Compose", nl: "Health-endpoints, en HEALTHCHECK in Compose" },
  health1: {
    en: "None of the three APIs had a health endpoint yet, because nothing was asking. A platform asks, so each of them gets the smallest one that gives a real answer. In ASP.NET Core that is two lines in Program.cs.",
    nl: "Geen van de drie API's had al een health-endpoint, want niemand vroeg erom. Een platform vraagt er wel om, dus krijgt elk van hen de kleinste die een echt antwoord geeft. In ASP.NET Core zijn dat twee regels in Program.cs.",
  },
  health2: {
    en: "The health check registry is part of the framework, so no package is needed, and the response is the plain word Healthy with a 200. In Spring Boot the same job goes to the actuator, which is one dependency and one setting.",
    nl: "Het register van health checks hoort bij het framework, dus is er geen package nodig, en het antwoord is het kale woord Healthy met een 200. In Spring Boot doet de actuator dat werk, en dat is één dependency en één instelling.",
  },
  health3: {
    en: "That setting is what makes the difference between one endpoint and three. With probes enabled the actuator serves /actuator/health, /actuator/health/liveness and /actuator/health/readiness, and the last two are the ones a cluster wants, because they answer different questions. The Kotlin Spring module gets the same dependency, in Gradle notation.",
    nl: "Die instelling is het verschil tussen één endpoint en drie. Met probes aan serveert de actuator /actuator/health, /actuator/health/liveness en /actuator/health/readiness, en die laatste twee wil een cluster hebben, want ze beantwoorden verschillende vragen. De Kotlin Spring-module krijgt dezelfde dependency, in Gradle-notatie.",
  },
  health4: {
    en: "It also gets an application.yaml of its own with the same management block, in workshops-spring/src/main/resources. The Ktor module has no actuator and does not need one, because a route is a route.",
    nl: "Hij krijgt ook een eigen application.yaml met hetzelfde management-blok, in workshops-spring/src/main/resources. De Ktor-module heeft geen actuator en heeft er ook geen nodig, want een route is een route.",
  },
  health5: {
    en: "That route needs the import io.ktor.server.response.respondText and nothing else. Which brings up the question of who calls these endpoints, and there the container itself is the weakest of the options.",
    nl: "Die route heeft de import io.ktor.server.response.respondText nodig en verder niets. Daarmee komt de vraag op wie deze endpoints aanroept, en daar is de container zelf de zwakste van de mogelijkheden.",
  },
  health6: {
    en: "A HEALTHCHECK line in a Dockerfile is run inside the container, so the image has to contain a program that can make an HTTP request. The chiseled .NET image contains no shell and no client, so there is nothing to write that line with, and adding one back would undo the reason for choosing that base. Kubernetes settles the argument on its own: it ignores a Dockerfile HEALTHCHECK completely and uses its own probes.",
    nl: "Een HEALTHCHECK-regel in een Dockerfile draait binnen de container, dus moet het image een programma bevatten dat een HTTP-request kan doen. Het chiseled .NET-image heeft geen shell en geen client, dus valt die regel niet te schrijven, en er een terugzetten zou de reden om die basis te kiezen tenietdoen. Kubernetes beslecht die discussie zelf: het negeert een HEALTHCHECK in een Dockerfile volledig en gebruikt zijn eigen probes.",
  },
  health7: {
    en: "What is left is Compose, which does read a health check and can make one service wait for another. So the check lives in compose.yaml next to the service, where the environment that uses it can see it, and the curl in the two JVM runtime stages exists for exactly that. If those images only ever run on a cluster, that line can go.",
    nl: "Wat overblijft is Compose, dat een health check wél leest en de ene service op de andere kan laten wachten. De check staat daarom in compose.yaml naast de service, waar de omgeving die hem gebruikt hem kan zien, en de curl in de twee JVM-runtimestages staat er precies daarvoor. Draaien die images alleen ooit op een cluster, dan kan die regel eruit.",
  },

  composeTitle: { en: "Compose with a database, and waiting for it properly", nl: "Compose met een database, en goed op hem wachten" },
  compose1: {
    en: "One file starts the three APIs and a database, builds what needs building, and puts them on a network where they can find each other by service name.",
    nl: "Eén bestand start de drie API's en een database, bouwt wat gebouwd moet worden, en zet ze op een netwerk waar ze elkaar op servicenaam vinden.",
  },
  compose2: {
    en: "None of the three services reads from that database yet. It is in the file because a database is the first dependency an API of this kind gains, and because depends_on on its own does not do what most people believe it does. Without a condition it waits for the container to have been started, which for a database means a process exists and nothing more, so the first connection attempt lands before the server accepts connections.",
    nl: "Geen van de drie services leest nog uit die database. Hij staat in het bestand omdat een database de eerste afhankelijkheid is die zo'n API krijgt, en omdat depends_on op zichzelf niet doet wat de meeste mensen denken. Zonder condition wacht hij tot de container is gestart, en dat betekent voor een database dat er een proces bestaat en niets meer, dus komt de eerste verbindingspoging binnen voordat de server verbindingen aanneemt.",
  },
  compose3: {
    en: "The condition service_healthy waits for the health check, and the start_period decides when the retries begin to count. During the start period a failing check does not count against them, so a database that needs a moment to initialise does not spend its first attempts on a failure budget it will need later.",
    nl: "De conditie service_healthy wacht op de health check, en de start_period bepaalt wanneer de retries beginnen te tellen. Tijdens die startperiode telt een mislukte check niet mee, dus een database die even nodig heeft om te initialiseren verbruikt zijn eerste pogingen niet uit een foutbudget dat hij later nodig heeft.",
  },
  compose4: {
    en: "The database and the two JVM services report healthy, and the .NET service reports as up without a health state, because it carries no check. That column is the whole trade written out: the two images that can check themselves paid for a client to do it with, and the one that cannot is the smallest of the three.",
    nl: "De database en de twee JVM-services melden healthy, en de .NET-service meldt alleen dat hij draait, zonder gezondheidstoestand, want hij heeft geen check. Die kolom is de hele afweging, uitgeschreven: de twee images die zichzelf kunnen controleren hebben een client betaald om dat mee te doen, en het image dat het niet kan is het kleinste van de drie.",
  },
  compose5: {
    en: "Calling the endpoints from outside proves the same thing without the trade. From your own machine every service can be reached on its published port, whatever is inside the image.",
    nl: "De endpoints van buitenaf aanroepen bewijst hetzelfde zonder die afweging. Vanaf je eigen machine is elke service bereikbaar op zijn gepubliceerde poort, wat er ook in het image zit.",
  },

  kubernetesTitle: { en: "What changes in Kubernetes: probes, requests and limits", nl: "Wat verandert in Kubernetes: probes, requests en limits" },
  kubernetes1: {
    en: "On a cluster the questions come from the kubelet, the agent that runs on the node, and it has four ways to ask.",
    nl: "Op een cluster komen de vragen van de kubelet, de agent die op de node draait, en die heeft vier manieren om ze te stellen.",
  },
  probeHttpLabel: { en: "httpGet.", nl: "httpGet." },
  probeHttp: {
    en: "The kubelet makes the request itself, from outside the container. Any status from 200 to 399 counts as a pass. This is the one that makes a shell-less image a non-issue, because nothing inside the container has to be able to speak HTTP.",
    nl: "De kubelet doet het request zelf, van buiten de container. Elke status van 200 tot en met 399 telt als geslaagd. Dit is de manier die een image zonder shell tot een non-probleem maakt, want binnen de container hoeft niets HTTP te kunnen spreken.",
  },
  probeExecLabel: { en: "exec.", nl: "exec." },
  probeExec: {
    en: "A command is run inside the container and the exit code decides. It needs a binary in the image, and it is the most expensive of the four, because every check starts a process.",
    nl: "Er wordt een commando in de container uitgevoerd en de exitcode beslist. Dat vraagt een binary in het image, en het is de duurste van de vier, want elke check start een proces.",
  },
  probeTcpLabel: { en: "tcpSocket.", nl: "tcpSocket." },
  probeTcp: {
    en: "A connection is opened to a port. It proves that something is listening and nothing about whether the application behind it works, so it is a last resort for protocols that are not HTTP.",
    nl: "Er wordt een verbinding met een poort geopend. Dat bewijst dat er iets luistert en niets over de vraag of de applicatie erachter werkt, dus het is een laatste redmiddel voor protocollen die geen HTTP zijn.",
  },
  probeGrpcLabel: { en: "grpc.", nl: "grpc." },
  probeGrpc: {
    en: "The kubelet speaks the gRPC health checking protocol to your service, stable since Kubernetes 1.27. It is the right answer for a service that has no HTTP surface at all.",
    nl: "De kubelet spreekt het gRPC health checking protocol met je service, stabiel sinds Kubernetes 1.27. Dat is het juiste antwoord voor een service die helemaal geen HTTP-kant heeft.",
  },
  kubernetes2: {
    en: "The reference for all four, with the defaults and the exact fields, is the Kubernetes documentation on probes at ",
    nl: "De referentie voor alle vier, met de standaardwaarden en de exacte velden, is de Kubernetes-documentatie over probes op ",
  },
  kubernetes2After: {
    en: ". The three kinds of probe answer three different questions, and using one where another belongs is the most common way to build a restart loop by hand.",
    nl: ". De drie soorten probes beantwoorden drie verschillende vragen, en er één gebruiken waar een andere hoort is de meest voorkomende manier om met de hand een herstartlus te bouwen.",
  },
  kubernetes3: {
    en: "The Deployment below runs the .NET image. It names the probes, the resources and the security settings, and everything else it leaves to the defaults.",
    nl: "De Deployment hieronder draait het .NET-image. Hij benoemt de probes, de resources en de beveiligingsinstellingen, en laat de rest aan de standaardwaarden over.",
  },
  kubernetes4: {
    en: "The startup probe buys time without buying patience. While it runs, the other two are held back, and the budget it has is failureThreshold multiplied by periodSeconds. Set that budget to the worst start you are willing to wait for, then let readiness and liveness run on short intervals, which is what you want once the application is up.",
    nl: "De startup-probe koopt tijd zonder geduld te kopen. Zolang hij loopt, worden de andere twee tegengehouden, en zijn budget is failureThreshold maal periodSeconds. Zet dat budget op de traagste start waarop je wilt wachten, en laat readiness en liveness daarna op korte intervallen lopen, want dat is wat je wilt zodra de applicatie draait.",
  },
  kubernetes5: {
    en: "Readiness decides who gets traffic. A pod that fails it is taken out of the service endpoints and put back the moment it passes again, without a restart, which is exactly right for a service that is briefly busy or waiting on a dependency. Liveness decides who gets restarted, and it should only fail for something a restart actually repairs. Pointing liveness at a check that includes a database is how a database hiccup turns into every pod restarting at once.",
    nl: "Readiness bepaalt wie verkeer krijgt. Een pod die zakt, wordt uit de service endpoints gehaald en teruggezet zodra hij weer slaagt, zonder herstart, en dat is precies goed voor een service die het even druk heeft of op een afhankelijkheid wacht. Liveness bepaalt wie opnieuw wordt gestart, en die hoort alleen te zakken voor iets dat een herstart echt repareert. Liveness op een check richten die een database meeneemt, is hoe een hik van de database uitloopt op alle pods die tegelijk herstarten.",
  },
  kubernetes6: {
    en: "The resources say two different things. A request is what the scheduler reserves, so it decides which node the pod lands on and what happens under pressure. A limit is what the kernel enforces. Memory has a limit here because it cannot be compressed: over the line the process is killed. CPU has a request and no limit, because a CPU limit throttles a process that has work to do, and a service that is briefly slow is easier to live with than a service that is deliberately held back. The numbers in that file are a starting point for this small API and not a recommendation for yours. The JVM version of the same Deployment changes the probe paths.",
    nl: "De resources zeggen twee verschillende dingen. Een request is wat de scheduler reserveert, dus bepaalt hij op welke node de pod terechtkomt en wat er onder druk gebeurt. Een limit is wat de kernel afdwingt. Geheugen heeft hier een limit omdat het niet samendrukbaar is: over de grens wordt het proces afgeschoten. CPU heeft een request en geen limit, want een CPU-limit remt een proces dat werk te doen heeft, en een service die even traag is, is makkelijker te verdragen dan een service die met opzet wordt tegengehouden. De getallen in dat bestand zijn een startpunt voor deze kleine API en geen aanbeveling voor die van jou. De JVM-versie van dezelfde Deployment verandert de paden van de probes.",
  },
  kubernetes7: {
    en: "Apply it and the pods report ready as soon as the startup probe has passed and readiness agrees.",
    nl: "Rol hem uit, en de pods melden zich klaar zodra de startup-probe is geslaagd en readiness het ermee eens is.",
  },
  kubernetes8: {
    en: "A passing probe is quiet, and READY 1/1 is the whole report. A failing one is loud, and kubectl describe pod prints it as an event with the status code the kubelet received, which is usually enough to know whether the application refused or never answered.",
    nl: "Een geslaagde probe is stil, en READY 1/1 is het hele verslag. Een gezakte probe is luid, en kubectl describe pod drukt hem af als een event met de statuscode die de kubelet kreeg, en dat is meestal genoeg om te weten of de applicatie weigerde of nooit antwoordde.",
  },

  memoryTitle: { en: "Memory: the JVM at 25 percent, .NET at 75", nl: "Geheugen: de JVM op 25 procent, .NET op 75" },
  memory1: {
    en: "Both runtimes read the container memory limit on their own. Neither of them uses all of it, and they disagree about how much to leave alone, which is why the same limit produces very different behaviour under Java and under .NET.",
    nl: "Beide runtimes lezen zelf de geheugenlimiet van de container. Geen van beide gebruikt hem helemaal, en ze zijn het oneens over hoeveel ze laten liggen, en daarom levert dezelfde limiet onder Java heel ander gedrag op dan onder .NET.",
  },
  memory2: {
    en: "The JVM has container support switched on by default and sets the maximum heap at a quarter of the limit. That default is conservative for a reason. The heap is not the only memory a JVM uses: metaspace, thread stacks, the code cache and direct buffers all sit outside it, and they are all charged to the same container limit. Raising the heap without knowing what the rest costs is how a pod ends up killed by the kernel.",
    nl: "De JVM heeft containerondersteuning standaard aan en zet de maximale heap op een kwart van de limiet. Die standaard is niet voor niets voorzichtig. De heap is niet het enige geheugen dat een JVM gebruikt: metaspace, threadstacks, de code cache en direct buffers zitten er allemaal buiten, en ze worden allemaal aan dezelfde containerlimiet toegerekend. De heap verhogen zonder te weten wat de rest kost, is hoe een pod door de kernel wordt afgeschoten.",
  },
  memory3: {
    en: "For a service like this one, with few threads and no large buffers, a quarter is too careful and the setting is worth raising. It goes in the environment, so the same image keeps working with a different limit.",
    nl: "Voor een service als deze, met weinig threads en zonder grote buffers, is een kwart te voorzichtig en is die instelling het verhogen waard. Hij gaat in de omgeving, zodat hetzelfde image blijft werken bij een andere limiet.",
  },
  memory4: {
    en: ".NET starts from the other side. It reads the limit as well and keeps its heap under three quarters of it by default, which leaves room for the runtime, the stacks and everything that is not managed memory. The knob is the heap hard limit percentage, and it carries one trap: in the runtime configuration its value is a decimal number, and as an environment variable the garbage collector settings are read as hexadecimal.",
    nl: ".NET begint aan de andere kant. Het leest de limiet ook en houdt zijn heap standaard onder driekwart daarvan, wat ruimte laat voor de runtime, de stacks en alles wat geen beheerd geheugen is. De knop is het percentage van de harde heaplimiet, en die kent één valkuil: in de runtimeconfiguratie is de waarde een decimaal getal, en als omgevingsvariabele worden de instellingen van de garbage collector hexadecimaal gelezen.",
  },
  memory5: {
    en: "Whichever number you land on, the way to find it is the same: give the container a limit, watch the process under a realistic load, and move the setting. A limit that is raised until the killing stops hides the reason the process was killed.",
    nl: "Welk getal het ook wordt, de weg ernaartoe is dezelfde: geef de container een limiet, kijk naar het proces onder een realistische belasting, en verzet de instelling. Een limiet die je ophoogt tot het afschieten stopt, verbergt de reden waarom er werd afgeschoten.",
  },
  memoryNoteTitle: { en: "A restart with no probe involved", nl: "Een herstart waar geen probe aan te pas komt" },
  memoryNoteBody: {
    en: "When a container passes its memory limit, the kernel kills the process and the pod status reads OOMKilled. No probe failed and none could have, because the process was gone before anything could ask it a question. A restart loop with that reason is a memory setting to change, not a probe to loosen.",
    nl: "Gaat een container over zijn geheugenlimiet, dan schiet de kernel het proces af en meldt de pod OOMKilled. Er zakte geen enkele probe en dat kon ook niet, want het proces was weg voordat iets hem iets kon vragen. Een herstartlus met die reden is een geheugeninstelling om te veranderen, geen probe om te versoepelen.",
  },

  supplyTitle: { en: "Scanning, signing and pinning", nl: "Scannen, ondertekenen en vastzetten" },
  supply1: {
    en: "An image is a dependency like any other, and it ages while it sits still. The base image gets patched, your tag does not move, and a build that was clean in September is not clean in November. So scan on every build and rebuild on a schedule even when nothing in your own code changed.",
    nl: "Een image is een dependency als elke andere, en het veroudert terwijl het stilstaat. Het base image wordt gepatcht, jouw tag beweegt niet mee, en een build die in september schoon was, is dat in november niet meer. Scan dus bij elke build en bouw ook op een vaste rusttijd opnieuw als er in je eigen code niets veranderde.",
  },
  supply2: {
    en: "The push prints the digest, and the digest is what a cluster should be given. A tag is a name that someone can move, and a digest is the content itself, so a Deployment that names a digest runs the image you tested and nothing that arrived at that name later.",
    nl: "De push drukt de digest af, en die digest is wat een cluster moet krijgen. Een tag is een naam die iemand kan verzetten, en een digest is de inhoud zelf, dus een Deployment die een digest noemt draait het image dat je hebt getest en niet wat later op die naam terechtkwam.",
  },
  supply3: {
    en: "The same reasoning runs the other way, at the top of the Dockerfile. The base images in this article are named by tag, which is readable and good enough while you are learning the pattern. A pipeline that has to answer for what it shipped names them by digest as well, and updates those digests in a visible commit that someone reviews.",
    nl: "Dezelfde redenering geldt de andere kant op, boven in de Dockerfile. De base images in dit artikel worden op tag genoemd, wat leesbaar is en goed genoeg zolang je het patroon leert. Een pijplijn die verantwoording moet afleggen over wat hij uitrolde, noemt ze ook op digest, en werkt die digests bij in een zichtbare commit die iemand nakijkt.",
  },
  supply4: {
    en: "The database line in the Compose file carries no tag, so it resolves to whatever the registry calls latest today. Give it the version your team runs and pin its digest before that file goes anywhere but a laptop.",
    nl: "De databaseregel in het Compose-bestand draagt geen tag, dus komt hij uit op wat de registry vandaag latest noemt. Geef het de versie die jouw team draait en zet de digest vast voordat dat bestand ergens anders komt dan op een laptop.",
  },
  supply5: {
    en: "Signing is the step after that. A signature ties an image to the pipeline that produced it, and it only means something when the cluster refuses to run what is not signed. That refusal is an admission policy on the cluster, so build the signature into the pipeline first and switch the enforcement on later, because the enforcement is what breaks deployments and it should break them for a reason everyone already understands.",
    nl: "Ondertekenen is de stap daarna. Een handtekening verbindt een image aan de pijplijn die het maakte, en betekent pas iets als het cluster weigert te draaien wat niet ondertekend is. Die weigering is een toelatingsbeleid op het cluster, dus bouw eerst de handtekening in de pijplijn en zet het afdwingen daarna aan, want het afdwingen is wat deployments breekt en dat hoort te gebeuren om een reden die iedereen al kent.",
  },

  closeTitle: { en: "What to take away", nl: "Wat je meeneemt" },
  close1: {
    en: "Three languages, three build tools, one pattern. What is left when you put the Dockerfiles side by side is a short list.",
    nl: "Drie talen, drie buildtools, één patroon. Wat overblijft als je de Dockerfiles naast elkaar legt, is een korte lijst.",
  },
  takeaway1: {
    en: "A build stage holds the toolchain and a runtime stage holds the runtime, and the package cache belongs in a cache mount, where no layer carries it.",
    nl: "Een buildstage bevat de toolchain en een runtimestage de runtime, en de packagecache hoort in een cache mount, waar geen laag hem meedraagt.",
  },
  takeaway2: {
    en: "Run as a named non-root user on a port above 1024, and let the image decide as little as possible about which environment it is in.",
    nl: "Draai als een benoemde niet-root gebruiker op een poort boven 1024, en laat het image zo min mogelijk bepalen over de omgeving waarin het staat.",
  },
  takeaway3: {
    en: "The smaller the base, the less there is inside it to check itself with. That is a trade to make on purpose, not a surprise to discover in Compose.",
    nl: "Hoe kleiner de basis, hoe minder erin zit om zichzelf mee te controleren. Dat is een afweging die je bewust maakt, geen verrassing die je in Compose ontdekt.",
  },
  takeaway4: {
    en: "Kubernetes ignores a Dockerfile HEALTHCHECK and runs its own probes, and an httpGet probe is made by the kubelet from outside the container.",
    nl: "Kubernetes negeert een HEALTHCHECK in een Dockerfile en draait zijn eigen probes, en een httpGet-probe wordt door de kubelet van buiten de container gedaan.",
  },
  takeaway5: {
    en: "Readiness moves traffic, liveness restarts a container, and a startup probe is what keeps a slow start from being read as a broken one.",
    nl: "Readiness verplaatst verkeer, liveness herstart een container, en een startup-probe is wat voorkomt dat een trage start wordt gelezen als een kapotte.",
  },
  takeaway6: {
    en: "Give the container a memory limit and set the runtime against it, because a JVM heap at a quarter and a .NET heap at three quarters are defaults, not decisions.",
    nl: "Geef de container een geheugenlimiet en stel de runtime daarop in, want een JVM-heap op een kwart en een .NET-heap op driekwart zijn standaardwaarden, geen besluiten.",
  },
  close2: {
    en: "The three applications inside these images are built from an empty folder in the other articles of this series: ",
    nl: "De drie applicaties in deze images worden in de andere artikelen van deze reeks vanaf een lege map gebouwd: ",
  },
  csharpArticleLink: { en: "the ASP.NET Core article", nl: "het ASP.NET Core-artikel" },
  close2Between: { en: ", ", nl: ", " },
  javaArticleLink: { en: "the Spring Boot article", nl: "het Spring Boot-artikel" },
  close2And: { en: " and ", nl: " en " },
  kotlinArticleLink: { en: "the Kotlin article", nl: "het Kotlin-artikel" },
  close2After: {
    en: ". Read one of them first if you want the code that these Dockerfiles compile.",
    nl: ". Lees er eerst een als je de code wilt zien die deze Dockerfiles compileren.",
  },
};
