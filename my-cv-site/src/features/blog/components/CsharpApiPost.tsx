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
  slug: "building-an-api-in-csharp",
  category: "api",
  track: "backend",
  publishedDate: "2026-09-06",
  readingTimeMin: 22,
  title: {
    en: "An API in ASP.NET Core: minimal endpoints or controllers",
    nl: "Een API in ASP.NET Core: minimal endpoints of controllers",
  },
  description: {
    en: "Minimal endpoints and controllers on .NET 10 and C# 14: binding, built-in validation, typed results, problem details, OpenAPI and endpoint tests.",
    nl: "Minimal endpoints en controllers op .NET 10 en C# 14: binding, ingebouwde validatie, typed results, problem details, OpenAPI en endpointtests.",
  },
  excerpt: {
    en: "Both styles run on the same routing, the same container and the same OpenAPI document. This article builds one workshop registration API twice on .NET 10 and C# 14, and names the three cases that actually decide the choice.",
    nl: "Beide stijlen draaien op dezelfde routering, dezelfde container en hetzelfde OpenAPI-document. Dit artikel bouwt één inschrijf-API voor workshops twee keer op .NET 10 en C# 14, en noemt de drie gevallen die de keuze werkelijk bepalen.",
  },
  keywords: [
    "asp.net core minimal api",
    "minimal api or controllers",
    "typedresults results union",
    "asp.net core validation",
    "problem details rfc 9457",
    "openapi asp.net core",
    "webapplicationfactory integration test",
  ],
};

function buildRequestDiagram(locale: Locale) {
  const copy = COPY;
  const nodes = [
    flowNode("request", copy.nodeRequest[locale], { x: 0, y: 110 }, { tone: "slate", subtitle: "POST /registrations", width: 150 }),
    flowNode("binding", copy.nodeBinding[locale], { x: 180, y: 110 }, { tone: "blue", subtitle: copy.nodeBindingSub[locale], width: 150 }),
    flowNode("validation", copy.nodeValidation[locale], { x: 360, y: 110 }, { tone: "violet", subtitle: "data annotations", width: 150 }),
    flowNode("handler", copy.nodeHandler[locale], { x: 540, y: 110 }, { tone: "emerald", subtitle: "RegistrationService", width: 160 }),
    flowNode("result", copy.nodeResult[locale], { x: 730, y: 110 }, { tone: "emerald", subtitle: copy.nodeResultSub[locale], width: 160 }),
    flowNode("problems", copy.nodeProblems[locale], { x: 560, y: 260 }, { tone: "rose", subtitle: "400 · 404 · 409", direction: "TB", width: 220 }),
  ];
  const edges = [
    flowEdge("request", "binding"),
    flowEdge("binding", "validation"),
    flowEdge("validation", "handler"),
    flowEdge("handler", "result"),
    flowEdge("binding", "problems", { dashed: true, label: copy.edgeMalformed[locale] }),
    flowEdge("validation", "problems", { dashed: true, label: copy.edgeInvalidField[locale] }),
    flowEdge("handler", "problems", { dashed: true, label: copy.edgeUnknownOrFull[locale] }),
  ];
  return { nodes, edges };
}

function buildProjectDiagram(locale: Locale) {
  const copy = COPY;
  const nodes = [
    flowNode("packages", copy.nodePackages[locale], { x: 0, y: 20 }, { tone: "amber", subtitle: copy.nodePackagesSub[locale], width: 210 }),
    flowNode("apiProject", "Workshops.Api", { x: 300, y: 20 }, { tone: "blue", subtitle: copy.nodeApiSub[locale], width: 230 }),
    flowNode("domainProject", "Workshops.Domain", { x: 620, y: 20 }, { tone: "emerald", subtitle: copy.nodeDomainSub[locale], width: 250 }),
  ];
  const edges = [
    flowEdge("packages", "apiProject", { label: "PackageReference" }),
    flowEdge("apiProject", "domainProject", { label: "ProjectReference" }),
  ];
  return { nodes, edges };
}

function buildSolutionTree(locale: Locale): FileNode[] {
  const copy = COPY;
  return [
    {
      name: "workshops",
      children: [
        { name: "Workshops.sln" },
        {
          name: "Workshops.Domain",
          comment: copy.treeDomain[locale],
          children: [
            { name: "Workshops.Domain.csproj" },
            { name: "Workshop.cs", comment: copy.treeWorkshop[locale] },
            { name: "RegistrationService.cs", comment: copy.treeService[locale] },
          ],
        },
        {
          name: "Workshops.Api",
          comment: copy.treeApi[locale],
          children: [
            { name: "Workshops.Api.csproj" },
            { name: "Program.cs", comment: copy.treeProgram[locale] },
            { name: "RegisterRequest.cs" },
            { name: "RegistrationResponse.cs" },
            { name: "RegistrationEndpoints.cs", comment: copy.treeEndpoints[locale] },
            { name: "RegistrationEndpoints.Register.cs", comment: copy.treePartial[locale] },
          ],
        },
        {
          name: "Workshops.Api.Tests",
          comment: copy.treeTests[locale],
          children: [
            { name: "Workshops.Api.Tests.csproj" },
            { name: "RegistrationEndpointTests.cs" },
          ],
        },
      ],
    },
  ];
}

export function Body({ locale }: { locale: Locale }) {
  const copy = COPY;
  const requestFlow = buildRequestDiagram(locale);
  const projectFlow = buildProjectDiagram(locale);
  return (
    <>
      <Lead>{copy.lead[locale]}</Lead>
      <P>{copy.intro1[locale]}</P>
      <P>{copy.versions[locale]}</P>
      <P>{copy.intro2[locale]}</P>
      <Quote>{copy.quote[locale]}</Quote>
      <Contents
        label={copy.contentsLabel[locale]}
        items={[
          copy.choiceTitle[locale],
          copy.setupTitle[locale],
          copy.minimalTitle[locale],
          copy.controllerTitle[locale],
          copy.pickTitle[locale],
          copy.bindingTitle[locale],
          copy.validationTitle[locale],
          copy.typedTitle[locale],
          copy.problemTitle[locale],
          copy.openApiTitle[locale],
          copy.programTitle[locale],
          copy.runTitle[locale],
          copy.testingTitle[locale],
          copy.boundaryTitle[locale],
          copy.closeTitle[locale],
        ]}
      />

      <H2>{copy.choiceTitle[locale]}</H2>
      <P>{copy.choice1[locale]}</P>
      <P>{copy.choice2[locale]}</P>
      <P>{copy.choice3[locale]}</P>

      <H2>{copy.setupTitle[locale]}</H2>
      <P>{copy.setup1[locale]}</P>
      <CodeBlock lang="bash" filename="workshops" code={CREATE_PROJECTS_CODE} />
      <P>{copy.setup2[locale]}</P>
      <P>{copy.setup3[locale]}</P>
      <FileTree tree={buildSolutionTree(locale)} caption={copy.treeCaption[locale]} />

      <H2>{copy.minimalTitle[locale]}</H2>
      <P>{copy.minimal1[locale]}</P>
      <CodeBlock lang="csharp" filename="Workshops.Domain/Workshop.cs" code={DOMAIN_TYPES_CODE} />
      <P>{copy.minimal2[locale]}</P>
      <P>{copy.minimal3[locale]}</P>
      <CodeBlock lang="csharp" filename="Workshops.Api/Program.cs" code={MINIMAL_ENDPOINT_CODE} />
      <P>{copy.minimal4[locale]}</P>

      <H2>{copy.controllerTitle[locale]}</H2>
      <P>{copy.controller1[locale]}</P>
      <CodeBlock lang="csharp" filename="Workshops.Api/Controllers/RegistrationsController.cs" code={CONTROLLER_CODE} />
      <P>{copy.controller2[locale]}</P>
      <P>{copy.controller3[locale]}</P>

      <H2>{copy.pickTitle[locale]}</H2>
      <P>{copy.pick1[locale]}</P>
      <OL>
        <LI><Strong>{copy.pickCase1Label[locale]}</Strong> {copy.pickCase1[locale]}</LI>
        <LI><Strong>{copy.pickCase2Label[locale]}</Strong> {copy.pickCase2[locale]}</LI>
        <LI><Strong>{copy.pickCase3Label[locale]}</Strong> {copy.pickCase3[locale]}</LI>
      </OL>
      <P>{copy.pick2[locale]}</P>

      <Divider />

      <H2>{copy.bindingTitle[locale]}</H2>
      <P>{copy.binding1[locale]}</P>
      <CodeBlock lang="csharp" filename="Workshops.Api/RegistrationEndpoints.cs" code={ENDPOINT_GROUP_CODE} />
      <P>{copy.binding2[locale]}</P>
      <UL>
        <LI><Strong>{copy.bindRouteLabel[locale]}</Strong> {copy.bindRoute[locale]}</LI>
        <LI><Strong>{copy.bindQueryLabel[locale]}</Strong> {copy.bindQuery[locale]}</LI>
        <LI><Strong>{copy.bindBodyLabel[locale]}</Strong> {copy.bindBody[locale]}</LI>
        <LI><Strong>{copy.bindServicesLabel[locale]}</Strong> {copy.bindServices[locale]}</LI>
      </UL>
      <P>{copy.binding3[locale]}</P>
      <FlowDiagram
        nodes={requestFlow.nodes}
        edges={requestFlow.edges}
        height={380}
        ariaLabel={copy.requestAria[locale]}
        caption={copy.requestCaption[locale]}
      />
      <P>{copy.binding4[locale]}</P>

      <H2>{copy.validationTitle[locale]}</H2>
      <P>{copy.validation1[locale]}</P>
      <P>{copy.validation2[locale]}</P>
      <CodeBlock lang="csharp" filename="Workshops.Api/Program.cs" code={ADD_VALIDATION_CODE} />
      <P>{copy.validation3[locale]}</P>
      <CodeBlock lang="csharp" filename="Workshops.Api/RegisterRequest.cs" code={REQUEST_RECORD_CODE} />
      <P>{copy.validation4[locale]}</P>
      <Callout variant="warning" title={copy.validationWarningTitle[locale]}>
        {copy.validationWarningBody[locale]}
      </Callout>

      <H2>{copy.typedTitle[locale]}</H2>
      <P>{copy.typed1[locale]}</P>
      <P>{copy.typed2[locale]}</P>
      <CodeBlock lang="csharp" filename="Workshops.Api/RegistrationEndpoints.Register.cs" code={TYPED_RESULTS_CODE} />
      <P>{copy.typed3[locale]}</P>
      <P>{copy.typed4[locale]}</P>

      <H2>{copy.problemTitle[locale]}</H2>
      <P>{copy.problem1[locale]}</P>
      <P>{copy.problem2[locale]}</P>
      <CodeBlock lang="csharp" filename="Workshops.Api/Program.cs" code={PROBLEM_DETAILS_CODE} />
      <P>{copy.problem3[locale]}</P>
      <P>{copy.problem4[locale]}</P>

      <H2>{copy.openApiTitle[locale]}</H2>
      <P>{copy.openApi1[locale]}</P>
      <P>{copy.openApi2[locale]}</P>
      <CodeBlock lang="csharp" filename="Workshops.Api/Program.cs" code={OPEN_API_CODE} />
      <P>{copy.openApiPackage[locale]}</P>
      <P>{copy.openApi3[locale]}</P>
      <P>{copy.openApi4[locale]}</P>

      <H2>{copy.programTitle[locale]}</H2>
      <P>{copy.program1[locale]}</P>
      <CodeBlock lang="csharp" filename="Workshops.Api/Program.cs" code={FULL_PROGRAM_CODE} />
      <P>{copy.program2[locale]}</P>
      <CodeBlock lang="csharp" filename="Workshops.Api/RegistrationResponse.cs" code={RESPONSE_RECORD_CODE} />
      <P>{copy.program3[locale]}</P>

      <H2>{copy.runTitle[locale]}</H2>
      <P>{copy.run1[locale]}</P>
      <CodeBlock lang="bash" filename="workshops" code={RUN_CODE} />
      <CodeBlock lang="text" filename="dotnet run" code={RUN_OUTPUT_CODE} />
      <P>{copy.run2[locale]}</P>
      <P>{copy.run3[locale]}</P>
      <CodeBlock lang="bash" filename="POST /registrations" code={CALL_CREATE_CODE} />
      <P>{copy.run4[locale]}</P>
      <CodeBlock lang="bash" filename="GET /registrations/{registrationId}" code={CALL_READ_CODE} />
      <P>{copy.run5[locale]}</P>
      <CodeBlock lang="bash" filename="GET /registrations?workshopId={workshopId}" code={CALL_LIST_CODE} />
      <P>{copy.run6[locale]}</P>
      <CodeBlock lang="bash" filename="DELETE /registrations/{registrationId}" code={CALL_DELETE_CODE} />
      <P>{copy.run7[locale]}</P>
      <CodeBlock lang="bash" filename="POST /registrations" code={CALL_INVALID_CODE} />
      <P>{copy.run8[locale]}</P>
      <CodeBlock lang="bash" filename="POST /registrations" code={CALL_FULL_CODE} />

      <H2>{copy.testingTitle[locale]}</H2>
      <P>{copy.testing1[locale]}</P>
      <P>{copy.testing2[locale]}</P>
      <P>{copy.testing3[locale]}</P>
      <CodeBlock lang="csharp" filename="Workshops.Api.Tests/RegistrationEndpointTests.cs" code={INTEGRATION_TEST_CODE} />
      <P>{copy.testing4[locale]}</P>
      <P>{copy.testing5[locale]}</P>
      <CodeBlock lang="bash" filename="workshops" code={TEST_RUN_CODE} />
      <CodeBlock lang="text" filename="dotnet test" code={TEST_OUTPUT_CODE} />
      <P>{copy.testing6[locale]}</P>

      <H2>{copy.boundaryTitle[locale]}</H2>
      <P>{copy.boundary1[locale]}</P>
      <CodeBlock lang="csharp" filename="Workshops.Domain/RegistrationService.cs" code={REGISTRATION_SERVICE_CODE} />
      <P>{copy.boundary2[locale]}</P>
      <FlowDiagram
        nodes={projectFlow.nodes}
        edges={projectFlow.edges}
        height={200}
        ariaLabel={copy.projectAria[locale]}
        caption={copy.projectCaption[locale]}
      />
      <P>{copy.boundary3[locale]}</P>
      <CodeBlock lang="xml" filename="Workshops.Domain/Workshops.Domain.csproj" code={DOMAIN_PROJECT_CODE} />
      <CodeBlock lang="xml" filename="Workshops.Api/Workshops.Api.csproj" code={API_PROJECT_CODE} />
      <P>{copy.boundary4[locale]}</P>
      <P>{copy.boundary5[locale]}</P>

      <H2>{copy.closeTitle[locale]}</H2>
      <P>{copy.close1[locale]}</P>
      <P>{copy.close2[locale]}</P>
      <P>
        {copy.close3[locale]}
        <A href={`/${locale}/blog/building-an-api-in-java`}>{copy.javaArticleLink[locale]}</A>
        {copy.close3Between[locale]}
        <A href={`/${locale}/blog/building-an-api-in-kotlin`}>{copy.kotlinArticleLink[locale]}</A>
        {copy.close3After[locale]}
      </P>
    </>
  );
}

const CREATE_PROJECTS_CODE = `mkdir workshops
cd workshops

dotnet new sln --name Workshops
dotnet new classlib --output Workshops.Domain
dotnet new web --output Workshops.Api
dotnet new xunit --output Workshops.Api.Tests

dotnet sln add Workshops.Domain/Workshops.Domain.csproj
dotnet sln add Workshops.Api/Workshops.Api.csproj
dotnet sln add Workshops.Api.Tests/Workshops.Api.Tests.csproj

dotnet add Workshops.Api/Workshops.Api.csproj reference Workshops.Domain/Workshops.Domain.csproj
dotnet add Workshops.Api.Tests/Workshops.Api.Tests.csproj reference Workshops.Api/Workshops.Api.csproj

dotnet add Workshops.Api/Workshops.Api.csproj package Microsoft.AspNetCore.OpenApi
dotnet add Workshops.Api.Tests/Workshops.Api.Tests.csproj package Microsoft.AspNetCore.Mvc.Testing`;

const DOMAIN_TYPES_CODE = `namespace Workshops.Domain;

public sealed record Workshop(Guid Id, string Title, int Capacity);

public sealed record Registration(
    Guid Id,
    Guid WorkshopId,
    string AttendeeName,
    string AttendeeEmail,
    DateTimeOffset RegisteredAt);

public abstract record RegisterOutcome
{
    private RegisterOutcome()
    {
    }

    public sealed record Accepted(Registration Registration) : RegisterOutcome;

    public sealed record WorkshopNotFound(Guid WorkshopId) : RegisterOutcome;

    public sealed record WorkshopFull(Guid WorkshopId, int Capacity) : RegisterOutcome;
}

public static class WorkshopCatalogue
{
    public static IReadOnlyList<Workshop> All { get; } =
    [
        new(Guid.Parse("11111111-1111-1111-1111-111111111111"), "Reading legacy code", 12),
        new(Guid.Parse("22222222-2222-2222-2222-222222222222"), "Accessible components", 2),
    ];
}`;

const MINIMAL_ENDPOINT_CODE = `using System.Diagnostics;
using Workshops.Domain;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton(new RegistrationService(WorkshopCatalogue.All, TimeProvider.System));

WebApplication app = builder.Build();

app.MapPost("/registrations", (RegisterRequest request, RegistrationService registrations) =>
{
    RegisterOutcome outcome = registrations.Register(
        request.WorkshopId,
        request.AttendeeName,
        request.AttendeeEmail);

    return outcome switch
    {
        RegisterOutcome.Accepted accepted => Results.Created(
            $"/registrations/{accepted.Registration.Id}",
            RegistrationResponse.From(accepted.Registration)),
        RegisterOutcome.WorkshopNotFound => Results.NotFound(),
        RegisterOutcome.WorkshopFull => Results.Conflict(),
        _ => throw new UnreachableException(),
    };
});

app.Run();

public sealed record RegisterRequest(Guid WorkshopId, string AttendeeName, string AttendeeEmail);

public sealed record RegistrationResponse(
    Guid Id,
    Guid WorkshopId,
    string AttendeeName,
    string AttendeeEmail,
    DateTimeOffset RegisteredAt)
{
    public static RegistrationResponse From(Registration registration) =>
        new(registration.Id,
            registration.WorkshopId,
            registration.AttendeeName,
            registration.AttendeeEmail,
            registration.RegisteredAt);
}`;

const CONTROLLER_CODE = `using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Workshops.Domain;

namespace Workshops.Api.Controllers;

[ApiController]
[Route("registrations")]
public sealed class RegistrationsController(RegistrationService registrations) : ControllerBase
{
    [HttpPost]
    public ActionResult<RegistrationResponse> Register(RegisterRequest request)
    {
        RegisterOutcome outcome = registrations.Register(
            request.WorkshopId,
            request.AttendeeName,
            request.AttendeeEmail);

        return outcome switch
        {
            RegisterOutcome.Accepted accepted => CreatedAtAction(
                nameof(Find),
                new { registrationId = accepted.Registration.Id },
                RegistrationResponse.From(accepted.Registration)),
            RegisterOutcome.WorkshopNotFound => NotFound(),
            RegisterOutcome.WorkshopFull => Conflict(),
            _ => throw new UnreachableException(),
        };
    }

    [HttpGet("{registrationId:guid}")]
    public ActionResult<RegistrationResponse> Find(Guid registrationId) =>
        registrations.Find(registrationId) is { } registration
            ? RegistrationResponse.From(registration)
            : NotFound();
}`;

const ENDPOINT_GROUP_CODE = `using Workshops.Domain;

namespace Workshops.Api;

public static partial class RegistrationEndpoints
{
    public static RouteGroupBuilder MapRegistrations(this IEndpointRouteBuilder routes)
    {
        RouteGroupBuilder group = routes.MapGroup("/registrations").WithTags("Registrations");

        group.MapPost("/", Register);
        group.MapGet("/{registrationId:guid}", Find);
        group.MapGet("/", ListForWorkshop);
        group.MapDelete("/{registrationId:guid}", Cancel);

        return group;
    }

    private static IResult Find(Guid registrationId, RegistrationService registrations) =>
        registrations.Find(registrationId) is { } registration
            ? Results.Ok(RegistrationResponse.From(registration))
            : Results.NotFound();

    private static IResult ListForWorkshop(Guid workshopId, RegistrationService registrations) =>
        Results.Ok(registrations.ListForWorkshop(workshopId).Select(RegistrationResponse.From));

    private static IResult Cancel(Guid registrationId, RegistrationService registrations) =>
        registrations.Cancel(registrationId) ? Results.NoContent() : Results.NotFound();
}`;

const ADD_VALIDATION_CODE = `builder.Services.AddValidation();`;

const REQUEST_RECORD_CODE = `using System.ComponentModel.DataAnnotations;

namespace Workshops.Api;

public sealed record RegisterRequest
{
    public Guid WorkshopId { get; init; }

    [Required]
    [StringLength(80, MinimumLength = 2)]
    public string AttendeeName { get; init; } = string.Empty;

    [Required]
    [EmailAddress]
    public string AttendeeEmail { get; init; } = string.Empty;
}`;

const TYPED_RESULTS_CODE = `using System.Diagnostics;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Workshops.Domain;

namespace Workshops.Api;

public static partial class RegistrationEndpoints
{
    private static Results<Created<RegistrationResponse>, NotFound, Conflict<ProblemDetails>> Register(
        RegisterRequest request,
        RegistrationService registrations)
    {
        RegisterOutcome outcome = registrations.Register(
            request.WorkshopId,
            request.AttendeeName,
            request.AttendeeEmail);

        return outcome switch
        {
            RegisterOutcome.Accepted accepted => TypedResults.Created(
                $"/registrations/{accepted.Registration.Id}",
                RegistrationResponse.From(accepted.Registration)),
            RegisterOutcome.WorkshopNotFound => TypedResults.NotFound(),
            RegisterOutcome.WorkshopFull full => TypedResults.Conflict(WorkshopIsFull(full)),
            _ => throw new UnreachableException(),
        };
    }

    private static ProblemDetails WorkshopIsFull(RegisterOutcome.WorkshopFull outcome) =>
        new()
        {
            Type = "https://workshops.example/problems/workshop-full",
            Title = "The workshop is full.",
            Status = StatusCodes.Status409Conflict,
            Detail = "Every place in this workshop is taken.",
            Extensions = { ["workshopId"] = outcome.WorkshopId },
        };
}`;

const PROBLEM_DETAILS_CODE = `builder.Services.AddProblemDetails(options =>
    options.CustomizeProblemDetails = context =>
    {
        context.ProblemDetails.Instance = context.HttpContext.Request.Path;
        context.ProblemDetails.Extensions["traceIdentifier"] = context.HttpContext.TraceIdentifier;
    });

WebApplication app = builder.Build();

app.UseExceptionHandler();
app.UseStatusCodePages();
app.MapRegistrations();

app.Run();

public partial class Program;`;

const OPEN_API_CODE = `builder.Services.AddOpenApi();

WebApplication app = builder.Build();

app.MapOpenApi();

if (app.Environment.IsDevelopment())
{
    app.MapScalarApiReference();
}`;

const FULL_PROGRAM_CODE = `using Workshops.Api;
using Workshops.Domain;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton(new RegistrationService(WorkshopCatalogue.All, TimeProvider.System));
builder.Services.AddValidation();
builder.Services.AddOpenApi();
builder.Services.AddProblemDetails(options =>
    options.CustomizeProblemDetails = context =>
    {
        context.ProblemDetails.Instance = context.HttpContext.Request.Path;
        context.ProblemDetails.Extensions["traceIdentifier"] = context.HttpContext.TraceIdentifier;
    });

WebApplication app = builder.Build();

app.UseExceptionHandler();
app.UseStatusCodePages();

app.MapOpenApi();
app.MapRegistrations();

app.Run();

public partial class Program;`;

const RESPONSE_RECORD_CODE = `using Workshops.Domain;

namespace Workshops.Api;

public sealed record RegistrationResponse(
    Guid Id,
    Guid WorkshopId,
    string AttendeeName,
    string AttendeeEmail,
    DateTimeOffset RegisteredAt)
{
    public static RegistrationResponse From(Registration registration) =>
        new(registration.Id,
            registration.WorkshopId,
            registration.AttendeeName,
            registration.AttendeeEmail,
            registration.RegisteredAt);
}`;

const RUN_CODE = `dotnet run --project Workshops.Api`;

const RUN_OUTPUT_CODE = `Building...
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://localhost:5185
info: Microsoft.Hosting.Lifetime[0]
      Application started. Press Ctrl+C to shut down.
info: Microsoft.Hosting.Lifetime[0]
      Hosting environment: Development`;

const CALL_CREATE_CODE = `curl -i -X POST http://localhost:5185/registrations \\
  -H "content-type: application/json" \\
  -d '{"workshopId":"11111111-1111-1111-1111-111111111111","attendeeName":"Sanne de Wit","attendeeEmail":"sanne@example.com"}'

HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8
Location: /registrations/0199c1e2-64b7-7e3d-9f10-2c8a4d6b91f5

{
  "id": "0199c1e2-64b7-7e3d-9f10-2c8a4d6b91f5",
  "workshopId": "11111111-1111-1111-1111-111111111111",
  "attendeeName": "Sanne de Wit",
  "attendeeEmail": "sanne@example.com",
  "registeredAt": "2026-09-06T09:12:04.7351290+00:00"
}`;

const CALL_READ_CODE = `curl -i http://localhost:5185/registrations/0199c1e2-64b7-7e3d-9f10-2c8a4d6b91f5

HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "id": "0199c1e2-64b7-7e3d-9f10-2c8a4d6b91f5",
  "workshopId": "11111111-1111-1111-1111-111111111111",
  "attendeeName": "Sanne de Wit",
  "attendeeEmail": "sanne@example.com",
  "registeredAt": "2026-09-06T09:12:04.7351290+00:00"
}`;

const CALL_LIST_CODE = `curl -i "http://localhost:5185/registrations?workshopId=11111111-1111-1111-1111-111111111111"

HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

[
  {
    "id": "0199c1e2-64b7-7e3d-9f10-2c8a4d6b91f5",
    "workshopId": "11111111-1111-1111-1111-111111111111",
    "attendeeName": "Sanne de Wit",
    "attendeeEmail": "sanne@example.com",
    "registeredAt": "2026-09-06T09:12:04.7351290+00:00"
  },
  {
    "id": "0199c1e2-91c4-7a52-b6d8-3f7e5a1c04b2",
    "workshopId": "11111111-1111-1111-1111-111111111111",
    "attendeeName": "Tarik Yildiz",
    "attendeeEmail": "tarik@example.com",
    "registeredAt": "2026-09-06T09:14:38.2046180+00:00"
  }
]`;

const CALL_DELETE_CODE = `curl -i -X DELETE http://localhost:5185/registrations/0199c1e2-64b7-7e3d-9f10-2c8a4d6b91f5

HTTP/1.1 204 No Content`;

const CALL_INVALID_CODE = `curl -i -X POST http://localhost:5185/registrations \\
  -H "content-type: application/json" \\
  -d '{"workshopId":"11111111-1111-1111-1111-111111111111","attendeeName":"","attendeeEmail":"sanne"}'

HTTP/1.1 400 Bad Request
Content-Type: application/problem+json

{
  "type": "https://tools.ietf.org/html/rfc9110#section-15.5.1",
  "title": "One or more validation errors occurred.",
  "status": 400,
  "errors": {
    "AttendeeName": [
      "The AttendeeName field is required."
    ],
    "AttendeeEmail": [
      "The AttendeeEmail field is not a valid e-mail address."
    ]
  }
}`;

const CALL_FULL_CODE = `curl -i -X POST http://localhost:5185/registrations \\
  -H "content-type: application/json" \\
  -d '{"workshopId":"22222222-2222-2222-2222-222222222222","attendeeName":"Noor Bakker","attendeeEmail":"noor@example.com"}'

HTTP/1.1 409 Conflict
Content-Type: application/problem+json

{
  "type": "https://workshops.example/problems/workshop-full",
  "title": "The workshop is full.",
  "status": 409,
  "detail": "Every place in this workshop is taken.",
  "workshopId": "22222222-2222-2222-2222-222222222222"
}`;

const INTEGRATION_TEST_CODE = `using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace Workshops.Api.Tests;

public sealed class RegistrationEndpointTests : IDisposable
{
    private static readonly Guid SmallWorkshopId = Guid.Parse("22222222-2222-2222-2222-222222222222");

    private readonly WebApplicationFactory<Program> factory = new();

    public void Dispose() => factory.Dispose();

    [Fact]
    public async Task Creates_a_registration_and_answers_with_its_address()
    {
        HttpClient client = factory.CreateClient();

        HttpResponseMessage response =
            await client.PostAsJsonAsync("/registrations", RegistrationFor("Sanne de Wit"));

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        Assert.NotNull(response.Headers.Location);

        HttpResponseMessage followUp = await client.GetAsync(response.Headers.Location);

        Assert.Equal(HttpStatusCode.OK, followUp.StatusCode);
    }

    [Fact]
    public async Task Answers_a_missing_name_and_a_broken_address_with_one_validation_problem()
    {
        HttpClient client = factory.CreateClient();

        HttpResponseMessage response = await client.PostAsJsonAsync(
            "/registrations",
            new { workshopId = SmallWorkshopId, attendeeName = "", attendeeEmail = "sanne" });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);

        ValidationProblemDetails? problem =
            await response.Content.ReadFromJsonAsync<ValidationProblemDetails>();

        Assert.NotNull(problem);
        Assert.Contains("AttendeeName", problem.Errors.Keys);
        Assert.Contains("AttendeeEmail", problem.Errors.Keys);
    }

    [Fact]
    public async Task Answers_a_full_workshop_with_a_conflict_that_names_the_workshop()
    {
        HttpClient client = factory.CreateClient();

        await client.PostAsJsonAsync("/registrations", RegistrationFor("Sanne de Wit"));
        await client.PostAsJsonAsync("/registrations", RegistrationFor("Tarik Yildiz"));

        HttpResponseMessage response =
            await client.PostAsJsonAsync("/registrations", RegistrationFor("Noor Bakker"));

        Assert.Equal(HttpStatusCode.Conflict, response.StatusCode);

        ProblemDetails? problem = await response.Content.ReadFromJsonAsync<ProblemDetails>();

        Assert.NotNull(problem);
        Assert.Equal(
            SmallWorkshopId.ToString(),
            ((JsonElement)problem.Extensions["workshopId"]!).GetString());
    }

    private static object RegistrationFor(string attendeeName) => new
    {
        workshopId = SmallWorkshopId,
        attendeeName,
        attendeeEmail = "attendee@example.com",
    };
}`;

const TEST_RUN_CODE = `dotnet test`;

const TEST_OUTPUT_CODE = `Passed!  - Failed:     0, Passed:     3, Skipped:     0, Total:     3 - Workshops.Api.Tests.dll (net10.0)`;

const REGISTRATION_SERVICE_CODE = `namespace Workshops.Domain;

public sealed class RegistrationService(IEnumerable<Workshop> workshops, TimeProvider timeProvider)
{
    private readonly Dictionary<Guid, Workshop> workshopsById =
        workshops.ToDictionary(workshop => workshop.Id);

    private readonly Dictionary<Guid, Registration> registrationsById = [];

    private readonly Lock gate = new();

    public RegisterOutcome Register(Guid workshopId, string attendeeName, string attendeeEmail)
    {
        lock (gate)
        {
            if (!workshopsById.TryGetValue(workshopId, out Workshop? workshop))
            {
                return new RegisterOutcome.WorkshopNotFound(workshopId);
            }

            int taken = registrationsById.Values.Count(
                registration => registration.WorkshopId == workshopId);

            if (taken >= workshop.Capacity)
            {
                return new RegisterOutcome.WorkshopFull(workshopId, workshop.Capacity);
            }

            Registration registration = new(
                Guid.CreateVersion7(),
                workshopId,
                attendeeName,
                attendeeEmail,
                timeProvider.GetUtcNow());

            registrationsById[registration.Id] = registration;

            return new RegisterOutcome.Accepted(registration);
        }
    }

    public Registration? Find(Guid registrationId)
    {
        lock (gate)
        {
            return registrationsById.GetValueOrDefault(registrationId);
        }
    }

    public IReadOnlyList<Registration> ListForWorkshop(Guid workshopId)
    {
        lock (gate)
        {
            return
            [
                .. registrationsById.Values
                    .Where(registration => registration.WorkshopId == workshopId)
                    .OrderBy(registration => registration.RegisteredAt)
            ];
        }
    }

    public bool Cancel(Guid registrationId)
    {
        lock (gate)
        {
            return registrationsById.Remove(registrationId);
        }
    }
}`;

const DOMAIN_PROJECT_CODE = `<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <TargetFramework>net10.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
  </PropertyGroup>

</Project>`;

const API_PROJECT_CODE = `<Project Sdk="Microsoft.NET.Sdk.Web">

  <PropertyGroup>
    <TargetFramework>net10.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Microsoft.AspNetCore.OpenApi" Version="10.0.11" />
  </ItemGroup>

  <ItemGroup>
    <ProjectReference Include="..\\Workshops.Domain\\Workshops.Domain.csproj" />
  </ItemGroup>

</Project>`;

const COPY = {
  contentsLabel: { en: "In this article", nl: "In dit artikel" },
  lead: {
    en: "There are two ways to write the same endpoint in ASP.NET Core, and a lot of opinion about which one is correct. The parts that decide whether an API is pleasant to call are the same in both.",
    nl: "Er zijn twee manieren om hetzelfde endpoint te schrijven in ASP.NET Core, en veel meningen over welke de juiste is. De onderdelen die bepalen of een API prettig aanroepbaar is, zijn in allebei dezelfde.",
  },
  intro1: {
    en: "I am a frontend engineer who writes the backend when the build needs it. At the Belastingdienst I built a visual forms editor and extended the Java backend endpoints it called, because the platform had to ship. In .NET the same situation came up at Opinity, Omniplan, Transdev and Ortec, where the interface I was building needed an API that did not exist yet.",
    nl: "Ik ben een frontend engineer die de backend schrijft als de bouw daarom vraagt. Bij de Belastingdienst bouwde ik een visuele formulierenbouwer en breidde ik de endpoints van de Java-backend uit die hij aanriep, want het platform moest live. In .NET kwam dezelfde situatie langs bij Opinity, Omniplan, Transdev en Ortec, waar de interface die ik bouwde een API nodig had die er nog niet was.",
  },
  versions: {
    en: "The samples in this article target .NET 10 and C# 14, checked on 6 September 2026. That release carries long-term support until 14 November 2028, so an API you start on it today has a long runway. .NET 8 and .NET 9 leave support on 10 November 2026.",
    nl: "De voorbeelden in dit artikel zijn geschreven voor .NET 10 en C# 14, gecontroleerd op 6 september 2026. Die release heeft langetermijnondersteuning tot 14 november 2028, dus een API die je er vandaag op begint, gaat lang mee. .NET 8 en .NET 9 vallen op 10 november 2026 uit de ondersteuning.",
  },
  intro2: {
    en: "The example is one small API for workshop registrations. A workshop has a title and a number of places. A registration puts one attendee in one workshop. A workshop with no places left refuses a new registration. That is the whole domain, and it returns unchanged in the two articles after this one, once in Java and once in Kotlin.",
    nl: "Het voorbeeld is één kleine API voor workshopinschrijvingen. Een workshop heeft een titel en een aantal plaatsen. Een inschrijving zet één deelnemer in één workshop. Een workshop zonder vrije plaatsen weigert een nieuwe inschrijving. Dat is het hele domein, en het komt ongewijzigd terug in de twee artikelen hierna, één keer in Java en één keer in Kotlin.",
  },
  quote: {
    en: "An endpoint has one job. It turns a request into a call the domain understands, and turns the answer back into a status code.",
    nl: "Een endpoint heeft één taak. Het maakt van een request een aanroep die het domein begrijpt, en van het antwoord weer een statuscode.",
  },
  choiceTitle: {
    en: "The choice, stated plainly",
    nl: "De keuze, eenvoudig gesteld",
  },
  choice1: {
    en: "A minimal endpoint is a method mapped onto a route. A controller is a class of action methods that the framework finds by convention and reads through attributes. Both sit in the same routing table, take their dependencies from the same container, produce the same OpenAPI document and return the same status codes.",
    nl: "Een minimal endpoint is een methode die op een route staat. Een controller is een klasse met actiemethodes die het framework via conventies vindt en via attributen leest. Allebei staan ze in dezelfde routeringstabel, halen ze hun afhankelijkheden uit dezelfde container, leveren ze hetzelfde OpenAPI-document op en geven ze dezelfde statuscodes terug.",
  },
  choice2: {
    en: "So this is not a fork in the road. It is a question about where the wiring is visible. In a minimal endpoint the route, the parameters and the possible results sit in one signature you read from top to bottom. In a controller that same information is spread across attributes, helper methods on the base class and conventions the framework applies for you.",
    nl: "Dit is dus geen tweesprong. Het is een vraag over waar de bedrading zichtbaar is. In een minimal endpoint staan de route, de parameters en de mogelijke resultaten in één signatuur die je van boven naar beneden leest. In een controller ligt diezelfde informatie verspreid over attributen, hulpmethodes op de basisklasse en conventies die het framework voor je toepast.",
  },
  choice3: {
    en: "They also mix. One project can serve controllers for the part that leans on model binding and filters, and map a group of minimal endpoints beside it. The router treats both the same way, because since ASP.NET Core moved to endpoint routing they are both endpoints.",
    nl: "Ze gaan ook samen. Eén project kan controllers bedienen voor het deel dat op model binding en filters leunt, en er een groep minimal endpoints naast zetten. De router behandelt allebei hetzelfde, want sinds ASP.NET Core op endpoint routing werkt, zijn het allebei endpoints.",
  },
  setupTitle: {
    en: "The project, from an empty folder",
    nl: "Het project, vanuit een lege map",
  },
  setup1: {
    en: "The .NET 10 SDK is the only thing to install, and dotnet --version answers with a 10.0 number once it is there. The commands below make three projects, hold them in one solution, point two references in one direction and add the two packages that are not in the shared framework.",
    nl: "De .NET 10-SDK is het enige dat je installeert, en dotnet --version antwoordt met een 10.0-nummer zodra die er staat. De commando's hieronder maken drie projecten, zetten ze in één solution, laten twee verwijzingen dezelfde kant op wijzen en voegen de twee pakketten toe die niet in het gedeelde framework zitten.",
  },
  setup2: {
    en: "The class library template writes a Class1.cs that can go, and the web template writes a Program.cs that the next section replaces. Each dotnet add package writes the version your SDK resolves into the project file, so a patch release can make that number higher than the one printed at the end of this article.",
    nl: "Het classlib-sjabloon schrijft een Class1.cs die weg mag, en het web-sjabloon schrijft een Program.cs die de volgende paragraaf vervangt. Elke dotnet add package zet de versie die jouw SDK oplevert in het projectbestand, dus een patchrelease kan dat nummer hoger maken dan het nummer dat aan het eind van dit artikel staat.",
  },
  setup3: {
    en: "Nothing in there runs yet, and the shape is already set. Every code block below names its file at the top, and those paths match this tree.",
    nl: "Er draait nog niets, en de vorm ligt er al. Elk codeblok hieronder noemt bovenaan zijn bestand, en die paden passen op deze boom.",
  },
  treeCaption: {
    en: "Three projects. The domain carries the rule, the API maps it onto HTTP, and the test project calls that API over HTTP.",
    nl: "Drie projecten. Het domein draagt de regel, de API zet die op HTTP, en het testproject roept die API over HTTP aan.",
  },
  treeDomain: { en: "references nothing", nl: "verwijst nergens naar" },
  treeWorkshop: { en: "the four domain types", nl: "de vier domeintypes" },
  treeService: { en: "the rule and the store", nl: "de regel en de opslag" },
  treeApi: { en: "the only project that knows HTTP", nl: "het enige project dat HTTP kent" },
  treeProgram: { en: "services and the pipeline", nl: "services en de pijplijn" },
  treeEndpoints: { en: "the four routes", nl: "de vier routes" },
  treePartial: { en: "the same partial class", nl: "dezelfde partial class" },
  treeTests: { en: "runs the API in memory", nl: "draait de API in het geheugen" },
  minimalTitle: {
    en: "A minimal API that does one thing",
    nl: "Een minimal API die één ding doet",
  },
  minimal1: {
    en: "Start with the domain, because both endpoint styles call exactly the same thing. Four types carry the whole example. A workshop, a registration, the outcome of an attempt to register, and a catalogue of workshops the sample can serve.",
    nl: "Begin bij het domein, want beide endpointstijlen roepen precies hetzelfde aan. Vier types dragen het hele voorbeeld. Een workshop, een inschrijving, de uitkomst van een poging tot inschrijven, en een catalogus met workshops die het voorbeeld kan bedienen.",
  },
  minimal2: {
    en: "The outcome type is a closed set. A private constructor on the base record keeps the three cases together, because only a nested type can reach it. That shape comes back in the Java and Kotlin articles as a sealed interface, where the compiler also proves that a switch covers every case. C# does not prove it here, so every switch below keeps a final arm that throws.",
    nl: "Het uitkomsttype is een gesloten verzameling. Een private constructor op het basisrecord houdt de drie gevallen bij elkaar, want alleen een genest type komt erbij. Die vorm komt terug in de Java- en Kotlin-artikelen als een sealed interface, waar de compiler ook bewijst dat een switch elk geval afdekt. C# bewijst dat hier niet, dus elke switch hieronder houdt een laatste tak die gooit.",
  },
  minimal3: {
    en: "Now the endpoint. One route, one request record, one call into the domain and one mapping from the outcome onto a status code. This file runs as it stands.",
    nl: "Dan het endpoint. Eén route, één requestrecord, één aanroep in het domein en één vertaling van de uitkomst naar een statuscode. Dit bestand draait zoals het er staat.",
  },
  minimal4: {
    en: "Results.Created writes the address of the new registration into the Location header, which is the part of a 201 that clients actually use. The store behind RegistrationService is a dictionary in memory, so the sample stays about the API. Its code comes at the end, with the two project files.",
    nl: "Results.Created schrijft het adres van de nieuwe inschrijving in de Location-header, en dat is het deel van een 201 waar clients werkelijk iets mee doen. De opslag achter RegistrationService is een dictionary in het geheugen, zodat het voorbeeld over de API blijft gaan. Die code komt aan het eind, met de twee projectbestanden.",
  },
  controllerTitle: {
    en: "The same endpoint as a controller",
    nl: "Hetzelfde endpoint als controller",
  },
  controller1: {
    en: "Two lines switch controllers on, AddControllers at the service registration and MapControllers on the application. Here is the same register endpoint, with a second action that reads one registration back.",
    nl: "Twee regels zetten controllers aan, AddControllers bij de serviceregistratie en MapControllers op de applicatie. Hier is hetzelfde inschrijfendpoint, met een tweede actie die één inschrijving terugleest.",
  },
  controller2: {
    en: "ApiController does more than it looks. It infers that a complex parameter comes from the body, and it turns a failed model binding into a 400 with a validation problem details body without a line of code from you. CreatedAtAction is the piece worth stealing. It builds the Location header from the route table, so the address is generated and never a string that goes stale when a route moves. Minimal endpoints reach the same thing through a named route and LinkGenerator.",
    nl: "ApiController doet meer dan het lijkt. Het leidt af dat een complexe parameter uit de body komt, en het maakt van een mislukte model binding een 400 met een validation problem details-body zonder een regel code van jou. CreatedAtAction is het stuk dat je wilt overnemen. Het bouwt de Location-header op uit de routeringstabel, dus het adres wordt gegenereerd en is nooit een string die verjaart zodra een route verschuift. Minimal endpoints bereiken hetzelfde met een benoemde route en LinkGenerator.",
  },
  controller3: {
    en: "What the action returns says almost nothing. ActionResult of RegistrationResponse covers a 201, a 404 and a 409 without naming one of them. A minimal endpoint can name all three in its signature, and the section on typed results does exactly that.",
    nl: "Wat de actie teruggeeft, zegt bijna niets. ActionResult van RegistrationResponse dekt een 201, een 404 en een 409 zonder er één te noemen. Een minimal endpoint kan alle drie in zijn signatuur benoemen, en de paragraaf over typed results doet precies dat.",
  },
  pickTitle: {
    en: "Which one to pick, and the three cases that decide it",
    nl: "Welke je kiest, en de drie gevallen die het bepalen",
  },
  pick1: {
    en: "Three cases settle this in practice, and the first one settles most of them.",
    nl: "Drie gevallen beslissen dit in de praktijk, en het eerste beslist de meeste.",
  },
  pickCase1Label: {
    en: "The codebase already has an answer.",
    nl: "De codebase heeft al een antwoord.",
  },
  pickCase1: {
    en: "A project full of controllers, filters and conventions gains a second set of habits the day a minimal endpoint appears beside them. One style throughout is worth more than the style you would pick on a blank page.",
    nl: "Een project vol controllers, filters en conventies krijgt er een tweede set gewoontes bij zodra er een minimal endpoint naast komt te staan. Eén stijl door het hele project is meer waard dan de stijl die je op een leeg blad zou kiezen.",
  },
  pickCase2Label: {
    en: "The API is a set of small routes with their own dependencies.",
    nl: "De API is een verzameling kleine routes met eigen afhankelijkheden.",
  },
  pickCase2: {
    en: "Four routes over one service is the example in this article, and a minimal group carries that with less ceremony. Each handler declares what it needs and what it can answer, and between the route and the method there is nothing at all.",
    nl: "Vier routes over één service is het voorbeeld in dit artikel, en een minimal group draagt dat met minder omhaal. Elke handler zegt wat hij nodig heeft en wat hij kan antwoorden, en tussen de route en de methode zit helemaal niets.",
  },
  pickCase3Label: {
    en: "You need what MVC hands you as convention.",
    nl: "Je hebt nodig wat MVC je als conventie geeft.",
  },
  pickCase3: {
    en: "Content negotiation through output formatters, a model binder for a wire format that is not JSON, action filters that already run across dozens of actions. Endpoint filters cover a good part of that ground, and a formatter is real work to rebuild.",
    nl: "Contentonderhandeling via output formatters, een model binder voor een formaat dat geen JSON is, actiefilters die al over tientallen acties lopen. Endpoint filters dekken een flink deel daarvan, en een formatter opnieuw bouwen is echt werk.",
  },
  pick2: {
    en: "At Omniplan I moved a legacy AngularJS and .NET application to Angular 9 on a .NET Core backend with REST and gRPC services, including a modular authorisation and membership service on Microsoft Identity and JWT. Two protocols, one set of rules. Which of the two was written as a controller was the least interesting decision in that project. Where the rules lived was the interesting one.",
    nl: "Bij Omniplan bracht ik een verouderde AngularJS- en .NET-applicatie naar Angular 9 op een .NET Core-backend met REST- en gRPC-services, inclusief een modulaire autorisatie- en membershipservice op Microsoft Identity en JWT. Twee protocollen, één set regels. Welke van de twee als controller was geschreven, was de minst interessante beslissing in dat project. Waar de regels woonden, was de interessante.",
  },
  bindingTitle: {
    en: "Binding and the shape of a request",
    nl: "Binding en de vorm van een request",
  },
  binding1: {
    en: "Move the four routes into a file of their own and the shape of the API becomes readable in one place. The register handler gets its own file two sections down.",
    nl: "Zet de vier routes in een eigen bestand en de vorm van de API wordt op één plek leesbaar. De inschrijfhandler krijgt twee paragrafen verderop een eigen bestand.",
  },
  binding2: {
    en: "Every parameter in those handlers binds from somewhere, and the four rules are worth knowing by heart.",
    nl: "Elke parameter in die handlers bindt ergens vandaan, en de vier regels zijn het waard om uit je hoofd te kennen.",
  },
  bindRouteLabel: { en: "From the route.", nl: "Uit de route." },
  bindRoute: {
    en: "A parameter whose name matches a route parameter binds from the path. That is registrationId, which appears in the pattern.",
    nl: "Een parameter waarvan de naam overeenkomt met een routeparameter, bindt uit het pad. Dat is registrationId, die in het patroon staat.",
  },
  bindQueryLabel: { en: "From the query string.", nl: "Uit de querystring." },
  bindQuery: {
    en: "A simple type with no matching route parameter binds from the query. That is workshopId, which arrives as a query value and needs no attribute.",
    nl: "Een eenvoudig type zonder bijpassende routeparameter bindt uit de query. Dat is workshopId, die als querywaarde binnenkomt en geen attribuut nodig heeft.",
  },
  bindBodyLabel: { en: "From the body.", nl: "Uit de body." },
  bindBody: {
    en: "A complex type with no other source binds from the JSON body, and there is at most one of those per request. That is RegisterRequest.",
    nl: "Een complex type zonder andere bron bindt uit de JSON-body, en daar is er hoogstens één van per request. Dat is RegisterRequest.",
  },
  bindServicesLabel: { en: "From the container.", nl: "Uit de container." },
  bindServices: {
    en: "A type registered in dependency injection binds from services. That is RegistrationService, which is why it needs no attribute either.",
    nl: "Een type dat in dependency injection is geregistreerd, bindt uit de services. Dat is RegistrationService, en daarom heeft ook die geen attribuut nodig.",
  },
  binding3: {
    en: "When the guess is wrong, say so with FromRoute, FromQuery, FromHeader, FromBody, FromServices or FromForm. AsParameters gathers a set of values into one record, which keeps a handler with six query values readable. The guid constraint in the pattern earns its place too. A request with something else in that position matches no route at all and gets a 404 from routing.",
    nl: "Klopt de gok niet, zeg het dan met FromRoute, FromQuery, FromHeader, FromBody, FromServices of FromForm. AsParameters bundelt een set waarden in één record, waardoor een handler met zes querywaarden leesbaar blijft. De guid-beperking in het patroon verdient ook haar plek. Een request met iets anders op die positie past op geen enkele route en krijgt een 404 uit de routering.",
  },
  requestAria: {
    en: "Diagram: an HTTP request passes through binding, validation and the handler to a result, and binding, validation and the handler can each end the request at the problem details writer",
    nl: "Diagram: een HTTP-request gaat via binding, validatie en de handler naar een resultaat, en binding, validatie en de handler kunnen het request elk beëindigen bij de problem details-schrijver",
  },
  requestCaption: {
    en: "Each stage can end the request, and the one that ends it decides the status code.",
    nl: "Elke fase kan het request beëindigen, en de fase die dat doet, bepaalt de statuscode.",
  },
  binding4: {
    en: "A body that is not valid JSON never reaches the handler either. That failure comes back as a 400 from the framework, in the same shape as every other failure.",
    nl: "Een body die geen geldige JSON is, bereikt de handler ook nooit. Die fout komt terug als een 400 uit het framework, in dezelfde vorm als elke andere fout.",
  },
  validationTitle: {
    en: "Validation, now built in",
    nl: "Validatie, nu ingebouwd",
  },
  validation1: {
    en: "Until .NET 10 a minimal endpoint had no validation of its own, so teams reached for FluentValidation or wrote an endpoint filter by hand. .NET 10 ships validation in the box through Microsoft.Extensions.Validation. A source generator reads the endpoint signatures at build time, so nothing is discovered by reflection while your application starts.",
    nl: "Tot .NET 10 had een minimal endpoint geen eigen validatie, dus grepen teams naar FluentValidation of schreven ze zelf een endpoint filter. .NET 10 levert validatie standaard mee via Microsoft.Extensions.Validation. Een source generator leest bij het bouwen de endpointsignaturen, dus er wordt niets via reflectie ontdekt terwijl je applicatie opstart.",
  },
  validation2: {
    en: "Switching it on is one line. Each of the Program.cs fragments in this article adds its lines to that same file.",
    nl: "Aanzetten is één regel. Elk Program.cs-fragment in dit artikel voegt zijn regels toe aan datzelfde bestand.",
  },
  validation3: {
    en: "The input is data annotations, so the rules sit on the type they belong to. The request record now moves out of Program.cs into a file of its own and gains them.",
    nl: "De invoer bestaat uit data annotations, dus de regels staan op het type waar ze bij horen. Het requestrecord verhuist nu uit Program.cs naar een eigen bestand en krijgt ze.",
  },
  validation4: {
    en: "A request with no name and an address that has no at sign now comes back as a 400 with a validation problem details body, keyed by property name, and the handler never runs. Both properties carry a default value so the deserializer fills them and the validator reports them. Marking them required moves the same failure into the JSON reader, which answers with a message about JSON and not about a field.",
    nl: "Een request zonder naam en met een adres zonder apenstaartje komt nu terug als een 400 met een validation problem details-body, gesleuteld op propertynaam, en de handler draait nooit. Beide properties hebben een standaardwaarde, zodat de deserializer ze vult en de validator ze meldt. Ze required maken verplaatst dezelfde fout naar de JSON-lezer, en die antwoordt met een melding over JSON en niet over een veld.",
  },
  validationWarningTitle: {
    en: "Two places where validation quietly does nothing",
    nl: "Twee plekken waar validatie stilletjes niets doet",
  },
  validationWarningBody: {
    en: "Required on a non-nullable value type always passes, because such a property always holds a value and an empty Guid is a valid Guid. A value like that belongs in the domain, where an unknown workshop is already a 404. A type you reach only through another type sits in no endpoint signature, so mark it with ValidatableType to get it into the generated code.",
    nl: "Required op een non-nullable value type slaagt altijd, want zo'n property heeft altijd een waarde en een lege Guid is een geldige Guid. Zo'n waarde hoort in het domein, waar een onbekende workshop al een 404 is. Een type dat je alleen via een ander type bereikt, staat in geen enkele endpointsignatuur, dus markeer het met ValidatableType om het in de gegenereerde code te krijgen.",
  },
  typedTitle: {
    en: "TypedResults and Results unions",
    nl: "TypedResults en Results-unions",
  },
  typed1: {
    en: "Results.Ok and TypedResults.Ok do the same thing at runtime. The difference is the type that comes back. Results.Ok returns IResult and tells a reader nothing. TypedResults.Ok returns a typed result, and once a handler declares a union of those, the signature lists every answer the endpoint can give.",
    nl: "Results.Ok en TypedResults.Ok doen tijdens het draaien hetzelfde. Het verschil is het type dat terugkomt. Results.Ok geeft IResult terug en zegt een lezer niets. TypedResults.Ok geeft een getypeerd resultaat terug, en zodra een handler een union daarvan aangeeft, somt de signatuur elk antwoord op dat het endpoint kan geven.",
  },
  typed2: {
    en: "This is the register handler, with the outcome from the domain mapped onto that union and the conflict built as a problem the client can act on.",
    nl: "Dit is de inschrijfhandler, met de uitkomst uit het domein afgebeeld op die union en het conflict opgebouwd als een probleem waar de client iets mee kan.",
  },
  typed3: {
    en: "Three things follow from that signature. The compiler rejects a fourth answer nobody wrote down. The OpenAPI document gets the status codes and the response types without a single ProducesResponseType attribute. And whoever opens the file knows in one line that this endpoint answers 201, 404 or 409. The other three handlers take the same treatment.",
    nl: "Uit die signatuur volgen drie dingen. De compiler weigert een vierde antwoord dat niemand heeft opgeschreven. Het OpenAPI-document krijgt de statuscodes en de responstypes zonder één ProducesResponseType-attribuut. En wie het bestand opent, weet in één regel dat dit endpoint 201, 404 of 409 antwoordt. De andere drie handlers krijgen dezelfde behandeling.",
  },
  typed4: {
    en: "The 400 is missing from that union on purpose. Validation runs as a filter before the handler, so the handler never returns one. A handler that validates by hand and calls TypedResults.ValidationProblem itself adds that case to its union.",
    nl: "De 400 ontbreekt met opzet in die union. Validatie draait als filter voor de handler, dus de handler geeft er nooit een terug. Een handler die zelf valideert en TypedResults.ValidationProblem aanroept, zet dat geval er wel bij.",
  },
  problemTitle: {
    en: "Errors as problem details",
    nl: "Fouten als problem details",
  },
  problem1: {
    en: "RFC 9457 describes one shape for an error body. A type that identifies the problem, a title, the status, a detail about this occurrence, an instance that says which request it was, and any extension member you want to add. A client can read that shape without knowing your API, which is why it earns its place on every failure.",
    nl: "RFC 9457 beschrijft één vorm voor een foutbody. Een type dat het probleem aanduidt, een titel, de status, een detail over dit voorval, een instance die zegt om welk request het ging, en elk extra veld dat je wilt toevoegen. Een client kan die vorm lezen zonder jouw API te kennen, en daarom verdient hij zijn plek bij elke fout.",
  },
  problem2: {
    en: "The conflict above carries the workshopId as an extension member, so a client can act on it without reading the sentence in the detail field. The rest is one registration and two pieces of middleware.",
    nl: "Het conflict hierboven draagt de workshopId als extra veld, zodat een client ermee kan werken zonder de zin in het detailveld te lezen. De rest is één registratie en twee stukken middleware.",
  },
  problem3: {
    en: "AddProblemDetails supplies the body for every failure the framework produces on its own. CustomizeProblemDetails adds what every problem in your API should carry, here the request path and the trace identifier. UseExceptionHandler turns an unhandled exception into a 500 in the same shape. UseStatusCodePages gives a body to the bare responses, so a not found comes back as problem details and not as an empty 404.",
    nl: "AddProblemDetails levert de body voor elke fout die het framework zelf maakt. CustomizeProblemDetails voegt toe wat elk probleem in jouw API zou moeten dragen, hier het pad van het request en de trace-identificatie. UseExceptionHandler maakt van een niet-afgevangen exceptie een 500 in dezelfde vorm. UseStatusCodePages geeft de kale antwoorden een body, zodat een niet gevonden terugkomt als problem details en niet als een lege 404.",
  },
  problem4: {
    en: "At Opinity the interface and the API both validated the entries drivers made, so a mistake surfaced at the moment someone made it. The error shape is what lets that pair work. An interface can only show what went wrong when the API says it in a form the interface can read.",
    nl: "Bij Opinity valideerden de interface en de API allebei de invoer van de chauffeurs, zodat een fout opviel op het moment dat iemand hem maakte. De foutvorm is wat dat duo laat werken. Een interface kan alleen tonen wat er misging als de API het zegt in een vorm die de interface kan lezen.",
  },
  openApiTitle: {
    en: "OpenAPI without a UI, and adding one if you want it",
    nl: "OpenAPI zonder UI, en er een toevoegen als je wilt",
  },
  openApi1: {
    en: "AddOpenApi and MapOpenApi produce the document, and on .NET 10 it is an OpenAPI 3.1 document served from the openapi path. That is everything the web API template gives you today. There is no UI in it, because the template stopped shipping one in .NET 9.",
    nl: "AddOpenApi en MapOpenApi maken het document, en op .NET 10 is dat een OpenAPI 3.1-document dat op het openapi-pad staat. Dat is alles wat het web-API-sjabloon je vandaag geeft. Er zit geen UI bij, want het sjabloon levert die sinds .NET 9 niet meer mee.",
  },
  openApi2: {
    en: "Swashbuckle was removed from that template. It was not deprecated and it still works if you want it. A UI is an opt-in decision now, and it is one line.",
    nl: "Swashbuckle is uit dat sjabloon gehaald. Het is niet afgeschaft en het werkt nog steeds als je het wilt. Een UI is nu een bewuste keuze, en het is één regel.",
  },
  openApiPackage: {
    en: "The UI on that last line lives in a package, added with dotnet add package Scalar.AspNetCore. It follows its own release schedule, so let the command write the version it picks. The document itself asks for nothing beyond the package the project already carries.",
    nl: "De UI op die laatste regel zit in een pakket, dat je toevoegt met dotnet add package Scalar.AspNetCore. Het volgt zijn eigen releaseschema, dus laat het commando de versie schrijven die het kiest. Het document zelf vraagt niets meer dan het pakket dat het project al heeft.",
  },
  openApi3: {
    en: "Scalar and Swagger UI both read the document from that address, so the choice between them is a matter of taste. Keeping the page behind a development check is worth doing, because a rendered console is a larger piece of surface than a JSON document.",
    nl: "Scalar en Swagger UI lezen allebei het document op dat adres, dus de keuze daartussen is een kwestie van smaak. De pagina achter een controle op de ontwikkelomgeving houden is verstandig, want een uitgetekende console is een groter stuk oppervlak dan een JSON-document.",
  },
  openApi4: {
    en: "At Ortec I settled the REST contracts with the backend teams on OpenAPI 3.0, and that is the part of this section that matters most. The document is not documentation you generate at the end. It is what two teams agree on while both sides are still changing, and a generated document keeps that agreement honest, because it cannot drift away from the code that produced it.",
    nl: "Bij Ortec legde ik de REST-contracten met de backendteams vast op OpenAPI 3.0, en dat is het deel van deze paragraaf dat er het meest toe doet. Het document is geen documentatie die je aan het eind genereert. Het is waar twee teams het over eens worden terwijl beide kanten nog veranderen, en een gegenereerd document houdt die afspraak zuiver, want het kan niet weglopen van de code die het heeft opgeleverd.",
  },
  programTitle: {
    en: "Program.cs from top to bottom",
    nl: "Program.cs van boven naar beneden",
  },
  program1: {
    en: "Every fragment above added its lines to one file. Here it is whole, with the service registrations first, the pipeline after Build and the routes last. The only line left out is the UI, because that one needs the package from the previous section.",
    nl: "Elk fragment hierboven voegde zijn regels toe aan één bestand. Hier staat het compleet, met eerst de serviceregistraties, dan de pijplijn na Build en als laatste de routes. De enige regel die ontbreekt, is de UI, want die heeft het pakket uit de vorige paragraaf nodig.",
  },
  program2: {
    en: "The two records that closed the first version of this file are gone from it. RegisterRequest moved out in the validation section, and RegistrationResponse makes the same move, so both sit in the Workshops.Api namespace beside the handlers that use them.",
    nl: "De twee records die de eerste versie van dit bestand afsloten, staan er niet meer in. RegisterRequest verhuisde al in de paragraaf over validatie, en RegistrationResponse doet hetzelfde, zodat ze allebei in de namespace Workshops.Api staan bij de handlers die ze gebruiken.",
  },
  program3: {
    en: "The controller from the second section is not part of this project. Mapping it beside the group gives POST /registrations two endpoints, and the router cannot pick one of them, so the choice between the two styles is one you make once.",
    nl: "De controller uit de tweede paragraaf hoort niet bij dit project. Wie hem naast de groep op de route zet, geeft POST /registrations twee endpoints, en de router kan er dan geen kiezen. De keuze tussen de twee stijlen maak je dus één keer.",
  },
  runTitle: {
    en: "Running it, and what a client gets back",
    nl: "Draaien, en wat een client terugkrijgt",
  },
  run1: {
    en: "One command starts it. The port comes from Properties/launchSettings.json, written by the web template, so the number below is not the number on your machine.",
    nl: "Eén commando start hem. De poort komt uit Properties/launchSettings.json, geschreven door het web-sjabloon, dus het nummer hieronder is niet het nummer op jouw machine.",
  },
  run2: {
    en: "Six calls cover the whole API. Each block holds the call and the answer that came back, with the headers that carry meaning and a body laid out over several lines, because the server sends it as one. On Windows PowerShell, write curl.exe, because plain curl there is a name for Invoke-WebRequest, which takes different arguments.",
    nl: "Zes aanroepen dekken de hele API. Elk blok bevat de aanroep en het antwoord dat terugkwam, met de headers die iets betekenen en een body over meer regels, want de server stuurt hem als één regel. Gebruik op Windows PowerShell curl.exe, want kaal curl is daar een naam voor Invoke-WebRequest, die andere argumenten aanneemt.",
  },
  run3: {
    en: "The catalogue holds two workshops. This call registers an attendee for the one with twelve places. The identifier in the Location header is a version 7 GUID the service made, so yours reads differently.",
    nl: "De catalogus bevat twee workshops. Deze aanroep schrijft een deelnemer in voor die met twaalf plaatsen. De identificatie in de Location-header is een version 7-GUID die de service maakte, dus die van jou ziet er anders uit.",
  },
  run4: {
    en: "That address is a route of its own, and it answers with the same body.",
    nl: "Dat adres is zelf een route, en het antwoordt met dezelfde body.",
  },
  run5: {
    en: "The list route reads its workshop from the query string. Register a second attendee for the same workshop and the list answers with both, in the order the registrations came in.",
    nl: "De lijstroute leest haar workshop uit de querystring. Schrijf een tweede deelnemer in voor dezelfde workshop en de lijst antwoordt met allebei, in de volgorde waarin de inschrijvingen binnenkwamen.",
  },
  run6: {
    en: "A cancel answers with no body at all. The same call a second time answers 404, because Cancel reports whether it removed anything.",
    nl: "Een annulering antwoordt zonder body. Dezelfde aanroep een tweede keer antwoordt 404, want Cancel meldt of er iets is verwijderd.",
  },
  run7: {
    en: "Then the two failures a client has to handle. A body with an empty name and an address without an at sign never reaches the handler.",
    nl: "Dan de twee fouten waar een client mee om moet gaan. Een body met een lege naam en een adres zonder apenstaartje bereikt de handler nooit.",
  },
  run8: {
    en: "The second one is the domain rule. The other workshop has two places. Fill them with two calls like the first, and the third comes back as a conflict that names the workshop.",
    nl: "De tweede is de domeinregel. De andere workshop heeft twee plaatsen. Vul ze met twee aanroepen als de eerste, en de derde komt terug als een conflict dat de workshop benoemt.",
  },
  testingTitle: {
    en: "Testing an endpoint with WebApplicationFactory",
    nl: "Een endpoint testen met WebApplicationFactory",
  },
  testing1: {
    en: "WebApplicationFactory starts the real application in memory and hands you an HttpClient that talks to it. No socket, no port, no deployment. Routing, binding, validation, the filters and the problem details writer all run, and that is exactly the part a unit test on a handler skips.",
    nl: "WebApplicationFactory start de echte applicatie in het geheugen en geeft je een HttpClient die ermee praat. Geen socket, geen poort, geen deployment. Routering, binding, validatie, de filters en de problem details-schrijver draaien allemaal, en dat is precies het deel dat een unittest op een handler overslaat.",
  },
  testing2: {
    en: "Two things make that work. The test project references Microsoft.AspNetCore.Mvc.Testing and the API project. And Program.cs ends with a partial class declaration, because top-level statements generate a class that is internal and the factory needs a type it can name.",
    nl: "Twee dingen maken dat mogelijk. Het testproject verwijst naar Microsoft.AspNetCore.Mvc.Testing en naar het API-project. En Program.cs eindigt met een partial class-declaratie, want top-level statements maken een klasse die internal is en de factory heeft een type nodig dat het kan benoemen.",
  },
  testing3: {
    en: "The store lives as long as the application does, so a shared factory would let one test write what the next test reads. xUnit builds a new instance of a test class for every test, so a factory in a field gives each test its own application and its own store. The workshop with two places in the catalogue is there for the third test.",
    nl: "De opslag leeft zo lang als de applicatie, dus een gedeelde factory zou de ene test laten schrijven wat de volgende test leest. xUnit maakt voor elke test een nieuw exemplaar van de testklasse, dus een factory in een veld geeft elke test een eigen applicatie en een eigen opslag. De workshop met twee plaatsen in de catalogus staat er voor de derde test.",
  },
  testing4: {
    en: "The first test walks the path a client walks, the Location header included, because a 201 with an address nobody can follow is a 201 that lied. The second reads the errors dictionary by property name, which is the contract a form in the browser depends on. The third proves the domain rule through the endpoint, in the shape the client sees.",
    nl: "De eerste test loopt het pad dat een client loopt, inclusief de Location-header, want een 201 met een adres dat niemand kan volgen is een 201 die loog. De tweede leest de foutenlijst op propertynaam, en dat is het contract waar een formulier in de browser op leunt. De derde bewijst de domeinregel via het endpoint, in de vorm die de client ziet.",
  },
  testing5: {
    en: "One command builds the solution and runs every test project in it.",
    nl: "Eén commando bouwt de solution en draait elk testproject erin.",
  },
  testing6: {
    en: "A run that fails prints the name of the test above that line, with the assertion that did not hold. That is the reason the three names read as sentences.",
    nl: "Een run die faalt, drukt boven die regel de naam van de test af, met de assertie die niet klopte. Daarom lezen de drie namen als zinnen.",
  },
  boundaryTitle: {
    en: "Where the endpoint stops and the domain starts",
    nl: "Waar het endpoint ophoudt en het domein begint",
  },
  boundary1: {
    en: "Everything above is translation. The endpoint reads a request, hands the domain three values, and turns one of three outcomes into a status code. Here is the other side of that line.",
    nl: "Alles hierboven is vertaalwerk. Het endpoint leest een request, geeft het domein drie waarden en maakt van een van de drie uitkomsten een statuscode. Hier is de andere kant van die lijn.",
  },
  boundary2: {
    en: "There is no IResult in that file, no HttpContext, no attribute and no status code. The rule about a full workshop is a sentence in a method. The lock is there because two requests reach a singleton at the same time, and counting the places before adding a registration has to be one step. The dictionary stands in for a database, and swapping it for a real one changes this file and nothing above it.",
    nl: "In dat bestand staat geen IResult, geen HttpContext, geen attribuut en geen statuscode. De regel over een volle workshop is een zin in een methode. Het slot staat er omdat twee requests tegelijk bij een singleton komen, en het tellen van de plaatsen en het toevoegen van een inschrijving moeten één stap zijn. De dictionary staat model voor een database, en die vervangen verandert dit bestand en niets erboven.",
  },
  projectAria: {
    en: "Diagram: the ASP.NET Core packages are referenced by the Workshops.Api project, and Workshops.Api references Workshops.Domain, with both arrows running in one direction",
    nl: "Diagram: de ASP.NET Core-pakketten worden gebruikt door het project Workshops.Api, en Workshops.Api verwijst naar Workshops.Domain, waarbij beide pijlen één kant op lopen",
  },
  projectCaption: {
    en: "The endpoint knows the domain. The domain never knows it is being served over HTTP.",
    nl: "Het endpoint kent het domein. Het domein weet nooit dat het over HTTP wordt bediend.",
  },
  boundary3: {
    en: "The project files turn that boundary into a rule the compiler enforces for you.",
    nl: "De projectbestanden maken van die grens een regel die de compiler voor je afdwingt.",
  },
  boundary4: {
    en: "The domain project is a plain library on net10.0 with no package reference and no project reference. The API project is a web project that references it. The arrow points one way, so a using of an ASP.NET Core namespace inside the domain does not compile. Neither file carries a LangVersion element, because the SDK selects the language version that ships with it.",
    nl: "Het domeinproject is een gewone bibliotheek op net10.0 zonder pakketverwijzing en zonder projectverwijzing. Het API-project is een webproject dat ernaar verwijst. De pijl wijst één kant op, dus een using van een ASP.NET Core-namespace in het domein compileert niet. In geen van beide bestanden staat een LangVersion, want de SDK kiest de taalversie die erbij hoort.",
  },
  boundary5: {
    en: "At Transdev I designed and built a generic API layer in .NET Core over a Delphi backend, with authentication and authorisation at application level, so new web and mobile front ends could reach data that was locked inside the old system. That layer did what the endpoints here do. It translated, and it kept the logic behind it away from the protocol in front of it.",
    nl: "Bij Transdev ontwierp en bouwde ik een generieke API-laag in .NET Core boven een Delphi-backend, met authenticatie en autorisatie op applicatieniveau, zodat nieuwe web- en mobiele frontends bij data konden die in het oude systeem vastzat. Die laag deed wat de endpoints hier doen. Hij vertaalde, en hij hield de logica erachter weg van het protocol ervoor.",
  },
  closeTitle: {
    en: "What to take away",
    nl: "Wat je meeneemt",
  },
  close1: {
    en: "The style you map an endpoint with is the smallest decision in this article. What a client feels is all the rest. A Location header that resolves. A 400 with the field names in it. A 409 that says which workshop is full. A document that matches the code.",
    nl: "De stijl waarmee je een endpoint op een route zet, is de kleinste beslissing in dit artikel. Wat een client merkt, is al het andere. Een Location-header die ergens uitkomt. Een 400 met de veldnamen erin. Een 409 die zegt welke workshop vol is. Een document dat klopt met de code.",
  },
  close2: {
    en: "Pick minimal endpoints for a new API with a handful of routes. Keep controllers where the conventions and the filters are already carrying weight. Then spend the time you saved on the boundary in the previous section, because that is the one that is expensive to move later.",
    nl: "Kies minimal endpoints voor een nieuwe API met een handvol routes. Houd controllers waar de conventies en de filters al dragend zijn. Steek de tijd die je overhoudt in de grens uit de vorige paragraaf, want die is later duur om te verplaatsen.",
  },
  close3: {
    en: "I build frontends most weeks and I write the endpoints behind them when a build needs it. At the Belastingdienst the forms platform had to ship, so I extended the Java backend endpoints the editor called. The two articles that answer these same four routes in another language are ",
    nl: "Ik bouw de meeste weken frontends en ik schrijf de endpoints erachter als de bouw daarom vraagt. Bij de Belastingdienst moest het formulierenplatform live, dus breidde ik de endpoints van de Java-backend uit die de editor aanriep. De twee artikelen die diezelfde vier routes in een andere taal beantwoorden, zijn ",
  },
  javaArticleLink: {
    en: "Spring Boot on Java",
    nl: "Spring Boot op Java",
  },
  close3Between: {
    en: " and ",
    nl: " en ",
  },
  kotlinArticleLink: {
    en: "Kotlin on Spring Boot and Ktor",
    nl: "Kotlin op Spring Boot en Ktor",
  },
  close3After: {
    en: ". Set one of them next to this one and the routes line up, so what is left to look at is the language and the framework.",
    nl: ". Zet er een naast dit artikel en de routes vallen samen, zodat alleen de taal en het framework overblijven om naar te kijken.",
  },
  nodeRequest: { en: "HTTP request", nl: "HTTP-request" },
  nodeBinding: { en: "Binding", nl: "Binding" },
  nodeBindingSub: { en: "route, query, body", nl: "route, query, body" },
  nodeValidation: { en: "Validation", nl: "Validatie" },
  nodeHandler: { en: "Handler", nl: "Handler" },
  nodeResult: { en: "Result", nl: "Resultaat" },
  nodeResultSub: { en: "201 and a Location", nl: "201 en een Location" },
  nodeProblems: { en: "Problem details", nl: "Problem details" },
  edgeMalformed: { en: "malformed", nl: "onleesbaar" },
  edgeInvalidField: { en: "invalid field", nl: "ongeldig veld" },
  edgeUnknownOrFull: { en: "unknown or full", nl: "onbekend of vol" },
  nodePackages: { en: "ASP.NET Core packages", nl: "ASP.NET Core-pakketten" },
  nodePackagesSub: { en: "used only here", nl: "alleen hier gebruikt" },
  nodeApiSub: { en: "endpoints, results, OpenAPI", nl: "endpoints, resultaten, OpenAPI" },
  nodeDomainSub: { en: "Workshop, Registration, the rule", nl: "Workshop, Registration, de regel" },
} as const;
