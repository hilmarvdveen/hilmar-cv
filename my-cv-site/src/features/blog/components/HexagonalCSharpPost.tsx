import type { Locale } from "@/lib/seo";
import type { BlogPostMeta } from "../types";
import { H2, P, Lead, UL, OL, LI, Strong, Quote, Divider } from "./prose";
import { Callout } from "./Callout";
import { CodeBlock } from "./CodeBlock";
import { FlowDiagram } from "./FlowDiagram";
import { Contents } from "./Contents";
import { flowNode, flowEdge } from "../flow";

export const meta: BlogPostMeta = {
  slug: "hexagonal-architecture-csharp-dotnet",
  category: "architecture",
  publishedDate: "2026-09-01",
  updatedDate: "2026-09-06",
  readingTimeMin: 20,
  title: {
    en: "Hexagonal architecture in C#: ports and adapters",
    nl: "Hexagonale architectuur in C#: ports en adapters",
  },
  description: {
    en: "Ports and adapters in C# 14 and .NET 10: a domain with no framework references, EF Core and minimal API adapters, fakes for tests, and a migration path.",
    nl: "Ports en adapters in C# 14 en .NET 10: een domein zonder frameworkverwijzingen, adapters voor EF Core en minimal API, fakes en een migratiepad.",
  },
  excerpt: {
    en: "Two years in, the service that started clean also reads an HttpContext, opens a transaction and shapes a response. This is where the business rule lives in C# 14 and .NET 10, and when the extra layer is not worth it.",
    nl: "Twee jaar later leest diezelfde nette service ook een HttpContext, opent een transactie en vormt een response. Dit is de plek waar de bedrijfsregel dan woont, in C# 14 en .NET 10, en zo weet je wanneer die extra laag het niet waard is.",
  },
  keywords: [
    "hexagonal architecture c#",
    "ports and adapters .net",
    "clean architecture asp.net core",
    "ef core repository port",
    "minimal api adapter",
    "domain driven design dotnet",
    "unit of work port",
  ],
};

function buildHexagon(locale: Locale) {
  const copy = COPY;
  const nodes = [
    flowNode("minimalApi", copy.nodeMinimalApi[locale], { x: 0, y: 0 }, { tone: "blue", subtitle: "POST /renewals", direction: "TB", width: 200 }),
    flowNode("grpc", copy.nodeGrpc[locale], { x: 230, y: 0 }, { tone: "blue", subtitle: "MembershipService", direction: "TB", width: 200 }),
    flowNode("consumer", copy.nodeConsumer[locale], { x: 460, y: 0 }, { tone: "blue", subtitle: "RenewalRequested", direction: "TB", width: 210 }),
    flowNode("useCase", "RenewMembership", { x: 230, y: 140 }, { tone: "violet", subtitle: copy.nodeUseCaseSub[locale], direction: "TB", width: 210 }),
    flowNode("domain", copy.nodeDomain[locale], { x: 0, y: 290 }, { tone: "emerald", subtitle: "Member · Membership", direction: "TB", width: 220 }),
    flowNode("drivenPorts", copy.nodeDrivenPorts[locale], { x: 260, y: 290 }, { tone: "slate", subtitle: "IMembershipRepository · IPaymentGateway", direction: "TB", width: 340 }),
    flowNode("repository", copy.nodeRepository[locale], { x: 200, y: 440 }, { tone: "amber", subtitle: "MSSQL", direction: "TB", width: 190 }),
    flowNode("payment", copy.nodePayment[locale], { x: 410, y: 440 }, { tone: "amber", subtitle: copy.nodePaymentSub[locale], direction: "TB", width: 190 }),
    flowNode("mail", copy.nodeMail[locale], { x: 620, y: 440 }, { tone: "amber", subtitle: copy.nodeMailSub[locale], direction: "TB", width: 190 }),
  ];
  const edges = [
    flowEdge("minimalApi", "useCase", { label: "HTTP" }),
    flowEdge("grpc", "useCase", { label: "gRPC" }),
    flowEdge("consumer", "useCase", { label: copy.edgeMessage[locale] }),
    flowEdge("useCase", "domain", { label: copy.edgeApplies[locale] }),
    flowEdge("useCase", "drivenPorts", { label: copy.edgeCalls[locale] }),
    flowEdge("drivenPorts", "repository", { dashed: true }),
    flowEdge("drivenPorts", "payment", { dashed: true, label: copy.edgeImplements[locale] }),
    flowEdge("drivenPorts", "mail", { dashed: true }),
  ];
  return { nodes, edges };
}

export function Body({ locale }: { locale: Locale }) {
  const copy = COPY;
  const hexagon = buildHexagon(locale);
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
          copy.whyTitle[locale],
          copy.overkillTitle[locale],
          copy.shapeTitle[locale],
          copy.domainTitle[locale],
          copy.portsTitle[locale],
          copy.adaptersTitle[locale],
          copy.compositionTitle[locale],
          copy.fakesTitle[locale],
          copy.databaseTestTitle[locale],
          copy.boundariesTitle[locale],
          copy.mazeTitle[locale],
          copy.migrationTitle[locale],
          copy.closingTitle[locale],
        ]}
      />

      <H2>{copy.whyTitle[locale]}</H2>
      <P>{copy.why1[locale]}</P>
      <P>{copy.why2[locale]}</P>

      <H2>{copy.overkillTitle[locale]}</H2>
      <P>{copy.overkill1[locale]}</P>
      <P>{copy.overkill2[locale]}</P>

      <H2>{copy.shapeTitle[locale]}</H2>
      <P>{copy.shape1[locale]}</P>
      <FlowDiagram
        nodes={hexagon.nodes}
        edges={hexagon.edges}
        height={520}
        ariaLabel={copy.hexagonAria[locale]}
        caption={copy.hexagonCaption[locale]}
      />
      <P>{copy.shape2[locale]}</P>
      <UL>
        <LI><Strong>{copy.drivingLabel[locale]}</Strong> {copy.drivingBody[locale]}</LI>
        <LI><Strong>{copy.drivenLabel[locale]}</Strong> {copy.drivenBody[locale]}</LI>
        <LI><Strong>{copy.portsLabel[locale]}</Strong> {copy.portsBody[locale]}</LI>
      </UL>
      <P>{copy.shape3[locale]}</P>

      <H2>{copy.domainTitle[locale]}</H2>
      <P>{copy.domain1[locale]}</P>
      <CodeBlock lang="xml" filename="Memberships.Domain.csproj" code={DOMAIN_PROJECT} />
      <P>{copy.domain2[locale]}</P>
      <CodeBlock lang="csharp" filename="Memberships.Domain/Membership.cs" code={DOMAIN_CODE} />
      <P>{copy.domain3[locale]}</P>

      <H2>{copy.portsTitle[locale]}</H2>
      <P>{copy.ports1[locale]}</P>
      <CodeBlock lang="csharp" filename="Memberships.Application/Ports.cs" code={PORTS_CODE} />
      <P>{copy.ports2[locale]}</P>
      <CodeBlock lang="csharp" filename="Memberships.Application/RenewMembership.cs" code={USE_CASE_CODE} />
      <P>{copy.ports3[locale]}</P>

      <H2>{copy.adaptersTitle[locale]}</H2>
      <P>{copy.adapters1[locale]}</P>
      <CodeBlock lang="csharp" filename="Memberships.Infrastructure/MembershipDbContext.cs" code={DATABASE_ADAPTER_CODE} />
      <P>{copy.adapters2[locale]}</P>
      <CodeBlock lang="csharp" filename="Memberships.Infrastructure/HttpPaymentGateway.cs" code={PAYMENT_ADAPTER_CODE} />
      <P>{copy.adapters3[locale]}</P>
      <CodeBlock lang="csharp" filename="Memberships.Api/MembershipEndpoints.cs" code={ENDPOINT_CODE} />
      <P>{copy.adapters4[locale]}</P>

      <H2>{copy.compositionTitle[locale]}</H2>
      <P>{copy.composition1[locale]}</P>
      <CodeBlock lang="csharp" filename="Memberships.Api/Program.cs" code={COMPOSITION_ROOT_CODE} />
      <P>{copy.composition2[locale]}</P>
      <Callout variant="tip" title={copy.ruleTitle[locale]}>
        {copy.ruleBody[locale]}
      </Callout>

      <Divider />

      <H2>{copy.fakesTitle[locale]}</H2>
      <P>{copy.fakes1[locale]}</P>
      <CodeBlock lang="csharp" filename="Memberships.Tests/Fakes.cs" code={FAKES_CODE} />
      <P>{copy.fakes2[locale]}</P>
      <CodeBlock lang="csharp" filename="Memberships.Tests/RenewMembershipTests.cs" code={USE_CASE_TEST_CODE} />
      <P>{copy.fakes3[locale]}</P>

      <H2>{copy.databaseTestTitle[locale]}</H2>
      <P>{copy.databaseTest1[locale]}</P>
      <P>{copy.databaseTest2[locale]}</P>
      <CodeBlock lang="csharp" filename="Memberships.Tests/MembershipRepositoryTests.cs" code={REPOSITORY_TEST_CODE} />
      <P>{copy.databaseTest3[locale]}</P>
      <P>{copy.databaseTest4[locale]}</P>
      <P>{copy.databaseTest5[locale]}</P>

      <H2>{copy.boundariesTitle[locale]}</H2>
      <P>{copy.boundaries1[locale]}</P>
      <UL>
        <LI><Strong>{copy.transferLabel[locale]}</Strong> {copy.transferBody[locale]}</LI>
        <LI><Strong>{copy.mappingLabel[locale]}</Strong> {copy.mappingBody[locale]}</LI>
        <LI><Strong>{copy.transactionLabel[locale]}</Strong> {copy.transactionBody[locale]}</LI>
        <LI><Strong>{copy.eventsLabel[locale]}</Strong> {copy.eventsBody[locale]}</LI>
      </UL>
      <P>{copy.boundaries2[locale]}</P>
      <P>{copy.moneyPath[locale]}</P>

      <H2>{copy.mazeTitle[locale]}</H2>
      <P>{copy.maze1[locale]}</P>
      <UL>
        <LI>{copy.maze2[locale]}</LI>
        <LI>{copy.maze3[locale]}</LI>
        <LI>{copy.maze4[locale]}</LI>
      </UL>
      <P>{copy.maze5[locale]}</P>

      <H2>{copy.migrationTitle[locale]}</H2>
      <P>{copy.migration1[locale]}</P>
      <OL>
        <LI>{copy.step1[locale]}</LI>
        <LI>{copy.step2[locale]}</LI>
        <LI>{copy.step3[locale]}</LI>
        <LI>{copy.step4[locale]}</LI>
        <LI>{copy.step5[locale]}</LI>
      </OL>
      <P>{copy.migration2[locale]}</P>

      <H2>{copy.closingTitle[locale]}</H2>
      <P>{copy.closing1[locale]}</P>
      <P>{copy.closing2[locale]}</P>
    </>
  );
}

const DOMAIN_PROJECT = `<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <TargetFramework>net10.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
  </PropertyGroup>

</Project>`;

const DOMAIN_CODE = `namespace Memberships.Domain;

public enum MembershipStatus
{
    Active,
    Expired,
    Suspended
}

public sealed class Member(Guid id, string emailAddress)
{
    public Guid Id { get; } = id;
    public string EmailAddress { get; } = emailAddress;
}

public sealed class Membership
{
    public Membership(Guid id, Guid memberId, DateOnly endsOn, MembershipStatus status)
    {
        Id = id;
        MemberId = memberId;
        EndsOn = endsOn;
        Status = status;
    }

    public Guid Id { get; }
    public Guid MemberId { get; }
    public DateOnly EndsOn { get; private set; }
    public MembershipStatus Status { get; private set; }

    public bool CanRenewOn(DateOnly today) =>
        Status != MembershipStatus.Suspended && EndsOn >= today.AddDays(-30);

    public void Renew(DateOnly today, int months)
    {
        if (!CanRenewOn(today))
        {
            throw new MembershipCannotRenewException(Id);
        }

        DateOnly startOfNewTerm = EndsOn > today ? EndsOn : today;
        EndsOn = startOfNewTerm.AddMonths(months);
        Status = MembershipStatus.Active;
    }
}

public sealed class MembershipCannotRenewException(Guid membershipId)
    : Exception($"Membership {membershipId} cannot be renewed.");`;

const PORTS_CODE = `using Memberships.Domain;

namespace Memberships.Application;

public interface IMembershipRepository
{
    Task<Membership?> FindAsync(Guid membershipId, CancellationToken cancellationToken);

    Task AddAsync(Membership membership, CancellationToken cancellationToken);
}

public interface IPaymentGateway
{
    Task<PaymentResult> ChargeAsync(Guid memberId, decimal amount, CancellationToken cancellationToken);
}

public sealed record PaymentResult(bool Succeeded, string Reference);

public interface IUnitOfWork
{
    Task CommitAsync(CancellationToken cancellationToken);
}

public interface IClock
{
    DateOnly Today { get; }
}`;

const USE_CASE_CODE = `using Memberships.Domain;

namespace Memberships.Application;

public sealed record RenewMembershipCommand(Guid MembershipId, int Months, decimal Amount);

public sealed record RenewMembershipResult(DateOnly EndsOn, string PaymentReference);

public sealed class MembershipNotFoundException(Guid membershipId)
    : Exception($"Membership {membershipId} was not found.");

public sealed class PaymentRefusedException(string reference)
    : Exception($"Payment {reference} was refused.");

public sealed class RenewMembership(
    IMembershipRepository memberships,
    IPaymentGateway payments,
    IUnitOfWork unitOfWork,
    IClock clock)
{
    public async Task<RenewMembershipResult> HandleAsync(
        RenewMembershipCommand command,
        CancellationToken cancellationToken)
    {
        Membership membership =
            await memberships.FindAsync(command.MembershipId, cancellationToken)
            ?? throw new MembershipNotFoundException(command.MembershipId);

        if (!membership.CanRenewOn(clock.Today))
        {
            throw new MembershipCannotRenewException(membership.Id);
        }

        PaymentResult payment =
            await payments.ChargeAsync(membership.MemberId, command.Amount, cancellationToken);

        if (!payment.Succeeded)
        {
            throw new PaymentRefusedException(payment.Reference);
        }

        membership.Renew(clock.Today, command.Months);
        await unitOfWork.CommitAsync(cancellationToken);

        return new RenewMembershipResult(membership.EndsOn, payment.Reference);
    }
}`;

const DATABASE_ADAPTER_CODE = `using Memberships.Application;
using Memberships.Domain;
using Microsoft.EntityFrameworkCore;

namespace Memberships.Infrastructure;

public sealed class MembershipDbContext(DbContextOptions<MembershipDbContext> options)
    : DbContext(options)
{
    public DbSet<Membership> Memberships => Set<Membership>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        var membership = modelBuilder.Entity<Membership>();
        membership.HasKey(entity => entity.Id);
        membership.Property(entity => entity.MemberId).IsRequired();
        membership.Property(entity => entity.EndsOn).IsRequired();
        membership.Property(entity => entity.Status).HasConversion<string>().IsRequired();
    }
}

public sealed class EntityFrameworkMembershipRepository(MembershipDbContext database)
    : IMembershipRepository
{
    public Task<Membership?> FindAsync(Guid membershipId, CancellationToken cancellationToken) =>
        database.Memberships.SingleOrDefaultAsync(entity => entity.Id == membershipId, cancellationToken);

    public async Task AddAsync(Membership membership, CancellationToken cancellationToken)
    {
        await database.Memberships.AddAsync(membership, cancellationToken);
    }
}

public sealed class EntityFrameworkUnitOfWork(MembershipDbContext database) : IUnitOfWork
{
    public Task CommitAsync(CancellationToken cancellationToken) =>
        database.SaveChangesAsync(cancellationToken);
}

public sealed class SystemClock : IClock
{
    public DateOnly Today => DateOnly.FromDateTime(DateTime.UtcNow);
}`;

const PAYMENT_ADAPTER_CODE = `using System.Net.Http.Json;
using Memberships.Application;

namespace Memberships.Infrastructure;

public sealed class HttpPaymentGateway(HttpClient client) : IPaymentGateway
{
    private sealed record ChargeRequest(string CustomerReference, decimal Amount);

    private sealed record ChargeResponse(string Status, string Reference);

    public async Task<PaymentResult> ChargeAsync(
        Guid memberId,
        decimal amount,
        CancellationToken cancellationToken)
    {
        HttpResponseMessage response = await client.PostAsJsonAsync(
            "/charges",
            new ChargeRequest(memberId.ToString(), amount),
            cancellationToken);

        response.EnsureSuccessStatusCode();

        ChargeResponse charge =
            await response.Content.ReadFromJsonAsync<ChargeResponse>(cancellationToken)
            ?? throw new InvalidOperationException("The payment service returned an empty body.");

        return new PaymentResult(charge.Status == "settled", charge.Reference);
    }
}`;

const ENDPOINT_CODE = `using Memberships.Application;

namespace Memberships.Api;

public sealed record RenewMembershipRequest(int Months, decimal Amount);

public sealed record RenewMembershipResponse(string EndsOn, string PaymentReference);

public static class MembershipEndpoints
{
    public static void MapMembershipEndpoints(this IEndpointRouteBuilder routes)
    {
        routes.MapPost("/memberships/{membershipId:guid}/renewals", RenewAsync);
    }

    private static async Task<IResult> RenewAsync(
        Guid membershipId,
        RenewMembershipRequest request,
        RenewMembership renewMembership,
        CancellationToken cancellationToken)
    {
        var command = new RenewMembershipCommand(membershipId, request.Months, request.Amount);

        try
        {
            RenewMembershipResult result =
                await renewMembership.HandleAsync(command, cancellationToken);

            return Results.Ok(
                new RenewMembershipResponse(result.EndsOn.ToString("O"), result.PaymentReference));
        }
        catch (MembershipNotFoundException)
        {
            return Results.NotFound();
        }
        catch (MembershipCannotRenewException exception)
        {
            return Results.Problem(
                exception.Message,
                statusCode: StatusCodes.Status409Conflict);
        }
        catch (PaymentRefusedException exception)
        {
            return Results.Problem(
                exception.Message,
                statusCode: StatusCodes.Status402PaymentRequired);
        }
    }
}`;

const COMPOSITION_ROOT_CODE = `using Memberships.Api;
using Memberships.Application;
using Memberships.Infrastructure;
using Microsoft.EntityFrameworkCore;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<MembershipDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("Memberships")));

builder.Services.AddScoped<IMembershipRepository, EntityFrameworkMembershipRepository>();
builder.Services.AddScoped<IUnitOfWork, EntityFrameworkUnitOfWork>();
builder.Services.AddSingleton<IClock, SystemClock>();
builder.Services.AddScoped<RenewMembership>();

builder.Services.AddHttpClient<IPaymentGateway, HttpPaymentGateway>(client =>
    client.BaseAddress = new Uri(builder.Configuration["Payments:BaseAddress"]!));

WebApplication app = builder.Build();

app.MapMembershipEndpoints();
app.Run();`;

const FAKES_CODE = `using Memberships.Application;
using Memberships.Domain;

namespace Memberships.Tests;

public sealed class InMemoryMembershipRepository : IMembershipRepository
{
    private readonly Dictionary<Guid, Membership> stored = [];

    public Task<Membership?> FindAsync(Guid membershipId, CancellationToken cancellationToken) =>
        Task.FromResult(stored.GetValueOrDefault(membershipId));

    public Task AddAsync(Membership membership, CancellationToken cancellationToken)
    {
        stored[membership.Id] = membership;
        return Task.CompletedTask;
    }
}

public sealed class RecordingPaymentGateway(bool succeeds) : IPaymentGateway
{
    public List<decimal> Charges { get; } = [];

    public Task<PaymentResult> ChargeAsync(
        Guid memberId,
        decimal amount,
        CancellationToken cancellationToken)
    {
        Charges.Add(amount);
        return Task.FromResult(new PaymentResult(succeeds, "reference-in-test"));
    }
}

public sealed class CountingUnitOfWork : IUnitOfWork
{
    public int Commits { get; private set; }

    public Task CommitAsync(CancellationToken cancellationToken)
    {
        Commits++;
        return Task.CompletedTask;
    }
}

public sealed class FixedClock(DateOnly today) : IClock
{
    public DateOnly Today => today;
}`;

const USE_CASE_TEST_CODE = `using Memberships.Application;
using Memberships.Domain;
using Xunit;

namespace Memberships.Tests;

public sealed class RenewMembershipTests
{
    private static readonly DateOnly Today = new(2026, 9, 1);

    private static Membership ActiveMembership() =>
        new(Guid.NewGuid(), Guid.NewGuid(), Today, MembershipStatus.Active);

    [Fact]
    public async Task Extends_the_end_date_and_commits_once()
    {
        Membership membership = ActiveMembership();
        var memberships = new InMemoryMembershipRepository();
        await memberships.AddAsync(membership, CancellationToken.None);

        var payments = new RecordingPaymentGateway(succeeds: true);
        var unitOfWork = new CountingUnitOfWork();
        var useCase = new RenewMembership(memberships, payments, unitOfWork, new FixedClock(Today));

        RenewMembershipResult result = await useCase.HandleAsync(
            new RenewMembershipCommand(membership.Id, Months: 12, Amount: 79.00m),
            CancellationToken.None);

        Assert.Equal(new DateOnly(2027, 9, 1), result.EndsOn);
        Assert.Equal(1, unitOfWork.Commits);
        Assert.Equal(79.00m, Assert.Single(payments.Charges));
    }

    [Fact]
    public async Task Leaves_the_end_date_alone_when_the_payment_is_refused()
    {
        Membership membership = ActiveMembership();
        var memberships = new InMemoryMembershipRepository();
        await memberships.AddAsync(membership, CancellationToken.None);

        var unitOfWork = new CountingUnitOfWork();
        var useCase = new RenewMembership(
            memberships,
            new RecordingPaymentGateway(succeeds: false),
            unitOfWork,
            new FixedClock(Today));

        await Assert.ThrowsAsync<PaymentRefusedException>(() => useCase.HandleAsync(
            new RenewMembershipCommand(membership.Id, Months: 12, Amount: 79.00m),
            CancellationToken.None));

        Assert.Equal(Today, membership.EndsOn);
        Assert.Equal(0, unitOfWork.Commits);
    }
}`;

const REPOSITORY_TEST_CODE = `using Memberships.Domain;
using Memberships.Infrastructure;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace Memberships.Tests;

public sealed class MembershipRepositoryTests : IAsyncLifetime
{
    private readonly SqliteConnection connection = new("Filename=:memory:");
    private MembershipDbContext database = null!;

    public async Task InitializeAsync()
    {
        await connection.OpenAsync();

        DbContextOptions<MembershipDbContext> options =
            new DbContextOptionsBuilder<MembershipDbContext>().UseSqlite(connection).Options;

        database = new MembershipDbContext(options);
        await database.Database.EnsureCreatedAsync();
    }

    public async Task DisposeAsync()
    {
        await database.DisposeAsync();
        await connection.DisposeAsync();
    }

    [Fact]
    public async Task Stores_and_reads_back_a_membership()
    {
        var repository = new EntityFrameworkMembershipRepository(database);
        var membership = new Membership(
            Guid.NewGuid(),
            Guid.NewGuid(),
            new DateOnly(2026, 12, 31),
            MembershipStatus.Suspended);

        await repository.AddAsync(membership, CancellationToken.None);
        await new EntityFrameworkUnitOfWork(database).CommitAsync(CancellationToken.None);
        database.ChangeTracker.Clear();

        Membership? found = await repository.FindAsync(membership.Id, CancellationToken.None);

        Assert.NotNull(found);
        Assert.Equal(new DateOnly(2026, 12, 31), found.EndsOn);
        Assert.Equal(MembershipStatus.Suspended, found.Status);
    }
}`;

const COPY = {
  contentsLabel: { en: "In this article", nl: "In dit artikel" },
  lead: {
    en: "Hexagonal architecture has one job. It keeps the rules that make you money independent of the framework, the database and the channel that happens to call them.",
    nl: "Hexagonale architectuur heeft één taak. Die houdt de regels waarmee je geld verdient los van het framework, de database en het kanaal dat ze toevallig aanroept.",
  },
  intro1: {
    en: "Most .NET applications start clean. A controller calls a service, the service calls a DbContext, and on day one everything reads well. Two years later the same service also reads an HttpContext, writes a log line, opens a transaction and shapes a response. The business rule is in there somewhere. Nobody can find it without starting the framework.",
    nl: "De meeste .NET-applicaties beginnen netjes. Een controller roept een service aan, de service roept een DbContext aan, en op dag één leest alles prettig. Twee jaar later leest diezelfde service ook een HttpContext, schrijft een logregel, opent een transactie en vormt een response. De bedrijfsregel zit er ergens tussen. Niemand vindt hem terug zonder het framework te starten.",
  },
  versions: {
    en: "The samples in this article target .NET 10 and C# 14, the versions current on 6 September 2026. That release carries long-term support until November 2028, so code you start on it today has a long runway. The syntax stays plain on purpose, because primary constructors and collection expressions carry these examples and a newer language feature would add nothing to them.",
    nl: "De voorbeelden in dit artikel zijn geschreven voor .NET 10 en C# 14, de versies die op 6 september 2026 actueel zijn. Die release heeft langetermijnondersteuning tot november 2028, dus code die je er vandaag op begint, gaat lang mee. De syntaxis blijft bewust eenvoudig, want primary constructors en collection expressions dragen deze voorbeelden en een nieuwere taalfunctie voegt er niets aan toe.",
  },
  intro2: {
    en: "I am a frontend engineer who reads and writes the back end when the work asks for it. At Omniplan I migrated a legacy AngularJS and .NET application to Angular 9 over a .NET Core back end with REST and gRPC, including a modular authorisation and membership service. Two delivery channels over one set of rules is exactly the situation ports and adapters were invented for.",
    nl: "Ik ben een frontend engineer die de backend leest en schrijft als het werk daarom vraagt. Bij Omniplan migreerde ik een legacy AngularJS- en .NET-applicatie naar Angular 9 op een .NET Core-backend met REST en gRPC, inclusief een modulaire autorisatie- en membershipservice. Twee afleverkanalen op één set regels is precies de situatie waarvoor ports en adapters zijn bedacht.",
  },
  quote: {
    en: "If your domain project references Microsoft.EntityFrameworkCore, the database has already made a decision that belonged to the business.",
    nl: "Als je domeinproject naar Microsoft.EntityFrameworkCore verwijst, heeft de database al een besluit genomen dat bij de business hoorde.",
  },
  whyTitle: {
    en: "Business rules should outlive the framework you picked",
    nl: "Bedrijfsregels horen langer mee te gaan dan het framework dat je koos",
  },
  why1: {
    en: "A framework is a bet on a decade. Web Forms, MVC, WCF, ASP.NET Core, minimal APIs. Each was the obvious answer in its own year. The rules underneath barely moved. A membership still expires, a renewal still needs a payment, a suspended member still cannot renew. Those sentences deserve a home that no upgrade can reach.",
    nl: "Een framework is een weddenschap op een decennium. Web Forms, MVC, WCF, ASP.NET Core, minimal API's. Elk was in zijn eigen jaar het vanzelfsprekende antwoord. De regels eronder bewogen nauwelijks. Een lidmaatschap verloopt nog steeds, een verlenging vraagt nog steeds om een betaling, een geschorst lid kan nog steeds niet verlengen. Die zinnen verdienen een plek waar geen upgrade bij kan.",
  },
  why2: {
    en: "Hexagonal architecture, also called ports and adapters, gives them that home. The rules live in one project with no framework packages at all. Everything the rules need from the outside world is written down as an interface. Everything that reaches the rules from outside passes through a thin translator. The pay-off arrives on the day you swap SQL Server for PostgreSQL, add a gRPC endpoint beside the REST one, or move a nightly job into a queue consumer.",
    nl: "Hexagonale architectuur, ook wel ports en adapters, geeft ze die plek. De regels wonen in één project zonder ook maar één frameworkpakket. Alles wat de regels van buiten nodig hebben, staat opgeschreven als een interface. Alles wat van buiten bij de regels komt, gaat door een dunne vertaler. Het rendement komt op de dag dat je SQL Server inruilt voor PostgreSQL, een gRPC-endpoint naast het REST-endpoint zet, of een nachtelijke taak verhuist naar een queue consumer.",
  },
  overkillTitle: {
    en: "Skip the hexagon when the application is a form over a table",
    nl: "Sla de hexagon over als de applicatie een formulier boven een tabel is",
  },
  overkill1: {
    en: "Not every application earns this. When the requirements are show the rows, edit a row and delete a row, the rules are the database schema. A port for the repository then buys you two extra files and one extra hop per screen. A small internal tool, a report generator or an administration panel is happier with a DbContext injected straight into an endpoint.",
    nl: "Niet elke applicatie verdient dit. Zijn de eisen toon de rijen, wijzig een rij en verwijder een rij, dan zijn de regels het databaseschema. Een port voor de repository levert je dan per scherm twee extra bestanden en één extra tussenstap op. Een klein intern gereedschap, een rapportgenerator of een beheerscherm is beter af met een DbContext die rechtstreeks in een endpoint gaat.",
  },
  overkill2: {
    en: "The hexagon pays for itself when three things are true. The rules contain real decisions, not only a check on required fields. More than one channel or more than one storage technology is plausible within the lifetime of the code. And the team wants to test those decisions in milliseconds without a database. Two out of three is usually enough. Zero out of three means you are building scaffolding around a shed.",
    nl: "De hexagon verdient zichzelf terug als drie dingen kloppen. De regels bevatten echte beslissingen, niet alleen een controle op verplichte velden. Meer dan één kanaal of meer dan één opslagtechnologie is aannemelijk binnen de levensduur van de code. En het team wil die beslissingen in milliseconden testen zonder database. Twee van de drie is meestal genoeg. Nul van de drie betekent dat je een steiger om een schuurtje bouwt.",
  },
  shapeTitle: {
    en: "The domain sits in the middle and owns its ports",
    nl: "Het domein staat in het midden en bezit zijn eigen ports",
  },
  shape1: {
    en: "The picture is a hexagon because the shape has many sides and no top. There is no layer above another layer. There is an inside and an outside, and every arrow points inward. The inside holds entities and use cases. The outside holds everything that talks to a network, a disk or a clock.",
    nl: "De tekening is een zeshoek omdat die vorm veel zijden heeft en geen bovenkant. Er ligt geen laag boven een andere laag. Er is een binnenkant en een buitenkant, en elke pijl wijst naar binnen. Binnen wonen entiteiten en use cases. Buiten woont alles wat met een netwerk, een schijf of een klok praat.",
  },
  hexagonAria: {
    en: "Diagram: three driving adapters call the RenewMembership use case, which applies the domain rules and calls driven ports implemented by an EF Core repository, an HTTP payment client and a mail sender",
    nl: "Diagram: drie driving adapters roepen de use case RenewMembership aan, die de domeinregels toepast en driven ports aanroept die worden geïmplementeerd door een EF Core-repository, een HTTP-betaalclient en een mailverzender",
  },
  hexagonCaption: {
    en: "Every arrow points inward. The adapters know the domain, and the domain knows none of them.",
    nl: "Elke pijl wijst naar binnen. De adapters kennen het domein, en het domein kent geen van hen.",
  },
  shape2: {
    en: "Two kinds of adapter meet the hexagon from opposite directions.",
    nl: "Twee soorten adapters raken de hexagon vanuit tegenovergestelde richtingen.",
  },
  drivingLabel: { en: "Driving adapters.", nl: "Driving adapters." },
  drivingBody: {
    en: "They start the work. A minimal API endpoint, an MVC controller, a gRPC service, a message consumer, a hosted background job. Each one turns a request into a command and calls a use case.",
    nl: "Zij starten het werk. Een minimal API-endpoint, een MVC-controller, een gRPC-service, een message consumer, een achtergrondtaak. Elk daarvan maakt van een verzoek een commando en roept een use case aan.",
  },
  drivenLabel: { en: "Driven adapters.", nl: "Driven adapters." },
  drivenBody: {
    en: "They are called by the work. An EF Core repository, an HttpClient to a payment service, a mail sender, a clock. Each one implements an interface that the inside defined.",
    nl: "Zij worden door het werk aangeroepen. Een EF Core-repository, een HttpClient naar een betaaldienst, een mailverzender, een klok. Elk daarvan implementeert een interface die de binnenkant heeft bepaald.",
  },
  portsLabel: { en: "Ports.", nl: "Ports." },
  portsBody: {
    en: "The interfaces themselves. A driving port is the use case class or its interface. A driven port is what the use case needs from the world around it.",
    nl: "De interfaces zelf. Een driving port is de use-caseklasse of haar interface. Een driven port is wat de use case nodig heeft van de wereld eromheen.",
  },
  shape3: {
    en: "The direction of the dependency is the whole trick. The adapter project references the domain project. The domain project references nothing. That single rule is something a compiler can enforce for you, which is why the hexagon survives contact with a real team.",
    nl: "De richting van de afhankelijkheid is de hele truc. Het adapterproject verwijst naar het domeinproject. Het domeinproject verwijst nergens naar. Precies die ene regel kan een compiler voor je afdwingen, en daarom overleeft de hexagon het contact met een echt team.",
  },
  domainTitle: {
    en: "The domain project compiles without a single framework package",
    nl: "Het domeinproject compileert zonder één frameworkpakket",
  },
  domain1: {
    en: "Start with the project file, because it is the agreement you will defend in every code review. No PackageReference, no ProjectReference, nothing. There is no LangVersion element either, because the SDK already selects the language version that ships with it.",
    nl: "Begin bij het projectbestand, want dat is de afspraak die je in elke code review verdedigt. Geen PackageReference, geen ProjectReference, niets. Er staat ook geen LangVersion in, want de SDK kiest zelf de taalversie die erbij hoort.",
  },
  domain2: {
    en: "Now the rules. A membership knows when it may be renewed and what a renewal does to its end date. That knowledge belongs in the entity, not in a service class that a controller happens to call.",
    nl: "Dan de regels. Een lidmaatschap weet wanneer het verlengd mag worden en wat een verlenging met de einddatum doet. Die kennis hoort in de entiteit, niet in een serviceklasse die een controller toevallig aanroept.",
  },
  domain3: {
    en: "Renew throws when the rule is broken, so no caller can reach an invalid state by forgetting a check. The new end date grows from whichever comes later, today or the current end date, so an early renewal never loses the remaining time. Both sentences are business decisions, and both now sit in one readable place.",
    nl: "Renew gooit een exceptie zodra de regel wordt geschonden, zodat geen enkele aanroeper via een vergeten controle in een ongeldige toestand belandt. De nieuwe einddatum groeit vanaf wat later valt, vandaag of de huidige einddatum, zodat een vroege verlenging de resterende tijd nooit weggooit. Beide zinnen zijn zakelijke beslissingen, en beide staan nu op één leesbare plek.",
  },
  portsTitle: {
    en: "A port is an interface written from the inside out",
    nl: "Een port is een interface die van binnenuit is geschreven",
  },
  ports1: {
    en: "The application layer holds use cases and the ports they need. The names come from the vocabulary of the domain, never from the technology behind them. A port called IMembershipRepository is fine. A port called ISqlServerMembershipRepository has already leaked. IClock is a deliberate choice here. TimeProvider has been part of the base library since .NET 8, and injecting that abstraction is a fine alternative. The sample runs on .NET 10, where both options are available. A port with a name of its own keeps the intent visible in the constructor signature.",
    nl: "De applicatielaag bevat use cases en de ports die zij nodig hebben. De namen komen uit het vocabulaire van het domein, nooit uit de techniek erachter. Een port die IMembershipRepository heet is prima. Een port die ISqlServerMembershipRepository heet, lekt al. IClock is hier een bewuste keuze. TimeProvider zit sinds .NET 8 in de standaardbibliotheek en die injecteren is een prima alternatief. Het voorbeeld draait op .NET 10, waar beide opties beschikbaar zijn. Een port met een eigen naam houdt de bedoeling zichtbaar in de constructorsignatuur.",
  },
  ports2: {
    en: "The use case does the conducting. It loads, it lets the domain decide, it calls outward, it commits. It carries no rule of its own beyond the order of the steps.",
    nl: "De use case doet het dirigeren. Hij laadt, hij laat het domein beslissen, hij roept naar buiten, hij commit. Zelf draagt hij geen enkele regel behalve de volgorde van de stappen.",
  },
  ports3: {
    en: "Read that method and you can tell a product owner what the system does, in order, without opening a second file. That readability is the second pay-off, and teams tend to notice it before they notice the swappable database.",
    nl: "Lees die methode en je kunt een product owner in volgorde vertellen wat het systeem doet, zonder een tweede bestand te openen. Die leesbaarheid is de tweede opbrengst, en teams merken die meestal eerder op dan de verwisselbare database.",
  },
  adaptersTitle: {
    en: "Adapters translate at the edge in both directions",
    nl: "Adapters vertalen aan de rand, in beide richtingen",
  },
  adapters1: {
    en: "An adapter has one job. It turns the shape of the outside world into the shape of the inside world, and back again. The EF Core adapter maps rows to entities. The HTTP adapter maps JSON to a result type. The endpoint maps a request body to a command.",
    nl: "Een adapter heeft één taak. Hij zet de vorm van de buitenwereld om naar de vorm van de binnenwereld, en weer terug. De EF Core-adapter mapt rijen naar entiteiten. De HTTP-adapter mapt JSON naar een resulttype. Het endpoint mapt een request body naar een commando.",
  },
  adapters2: {
    en: "The DbContext lives here and so does the mapping configuration. The entity keeps its private setters, and EF Core binds through the constructor by matching parameter names. The unit of work is a port as well, so the use case decides when work becomes permanent and the adapter decides how.",
    nl: "De DbContext woont hier en de mappingconfiguratie ook. De entiteit houdt zijn private setters, en EF Core bindt via de constructor op overeenkomende parameternamen. De unit of work is ook een port, dus de use case bepaalt wanneer werk definitief wordt en de adapter bepaalt hoe.",
  },
  adapters3: {
    en: "Notice where the request and response records sit. They are private nested types inside the adapter, because the JSON of the payment service is that service's own business. When it renames a field next quarter, one file changes.",
    nl: "Let op waar de request- en responserecords staan. Het zijn private geneste types binnen de adapter, want de JSON van de betaaldienst is de zaak van die dienst zelf. Hernoemt hij volgend kwartaal een veld, dan verandert er één bestand.",
  },
  adapters4: {
    en: "The endpoint does the same thing on the way in. It owns its own request and response records, catches the domain exceptions it knows how to answer, and turns them into status codes. A gRPC service next to it repeats those few lines against the same use case, and nothing in the middle changes.",
    nl: "Het endpoint doet aan de ingaande kant hetzelfde. Het heeft eigen request- en responserecords, vangt de domeinexcepties op die het kan beantwoorden, en zet ze om in statuscodes. Een gRPC-service ernaast herhaalt die paar regels tegen dezelfde use case, en in het midden verandert er niets.",
  },
  compositionTitle: {
    en: "The composition root is the only file that knows everything",
    nl: "De composition root is het enige bestand dat alles weet",
  },
  composition1: {
    en: "Every interface needs one place where it is bound to a class. In ASP.NET Core that place is Program.cs. It is allowed to know about SQL Server, about the address of the payment service and about the clock, because nothing else depends on it.",
    nl: "Elke interface heeft één plek nodig waar hij aan een klasse wordt gekoppeld. In ASP.NET Core is dat Program.cs. Dat bestand mag SQL Server kennen, het adres van de betaaldienst en de klok, want niets anders is ervan afhankelijk.",
  },
  composition2: {
    en: "Swap UseSqlServer for UseNpgsql and the domain does not notice. Point AddHttpClient at a sandbox address in the test environment and the use case does not notice either. That is the whole promise, and it is worth exactly as much as the discipline behind the project references.",
    nl: "Vervang UseSqlServer door UseNpgsql en het domein merkt er niets van. Wijs AddHttpClient in de testomgeving naar een sandboxadres en de use case merkt er ook niets van. Dat is de hele belofte, en die is precies zo veel waard als de discipline achter de projectverwijzingen.",
  },
  ruleTitle: {
    en: "A rule of thumb before you add an interface",
    nl: "Een vuistregel voordat je een interface toevoegt",
  },
  ruleBody: {
    en: "Add a port when what sits behind it can change without the business changing. A database, a payment provider, a mail service and the clock all qualify. A helper that formats a string does not. One implementation and no external dependency means you are looking at a class, not at a port.",
    nl: "Voeg een port toe als wat erachter zit kan veranderen zonder dat de business verandert. Een database, een betaalprovider, een maildienst en de klok voldoen daaraan. Een hulpje dat een string opmaakt niet. Eén implementatie en geen externe afhankelijkheid betekent dat je naar een klasse kijkt, niet naar een port.",
  },
  fakesTitle: {
    en: "Hand-written fakes are enough to test a use case",
    nl: "Handgeschreven fakes zijn genoeg om een use case te testen",
  },
  fakes1: {
    en: "A use case with four ports and no framework is the cheapest thing in the codebase to test. You need no mocking library. Four small classes give you a dictionary, a recorder, a counter and a fixed date, and in a failure message they read better than a configured mock.",
    nl: "Een use case met vier ports en zonder framework is het goedkoopste in de codebase om te testen. Je hebt geen mocking-library nodig. Vier kleine klassen geven je een dictionary, een recorder, een teller en een vaste datum, en in een foutmelding lezen ze prettiger dan een geconfigureerde mock.",
  },
  fakes2: {
    en: "The fakes are reusable across the whole suite and they carry their own assertions. Charges tells you what was really asked of the payment service. Commits tells you the transaction was closed exactly once, which is the kind of bug that hides for months.",
    nl: "De fakes zijn herbruikbaar in de hele suite en ze dragen hun eigen assertions. Charges vertelt je wat er werkelijk aan de betaaldienst is gevraagd. Commits vertelt je dat de transactie precies één keer is afgesloten, en dat soort fout blijft maanden verborgen.",
  },
  fakes3: {
    en: "Both tests run without a database, without a web server and without a network. That is why a suite of them stays usable as the application grows, and it is why a developer runs them before every push, not once a day.",
    nl: "Beide tests draaien zonder database, zonder webserver en zonder netwerk. Daardoor blijft een suite ervan bruikbaar naarmate de applicatie groeit, en daarom draait een developer ze voor elke push, niet één keer per dag.",
  },
  databaseTestTitle: {
    en: "Test the EF Core adapter against a real database engine",
    nl: "Test de EF Core-adapter tegen een echte database-engine",
  },
  databaseTest1: {
    en: "The use case tests prove the rules. They prove nothing about the mapping. A wrong column type, a missing key or a value converter that drops the enum passes every fake and fails in production. So the adapter gets a test of its own against a real provider.",
    nl: "De use-casetests bewijzen de regels. Over de mapping bewijzen ze niets. Een verkeerd kolomtype, een ontbrekende sleutel of een value converter die de enum laat vallen komt langs elke fake en sneuvelt in productie. Daarom krijgt de adapter een eigen test tegen een echte provider.",
  },
  databaseTest2: {
    en: "SQLite in memory is the practical middle ground. It runs real SQL through the real EF Core pipeline, it starts per test and it needs no container. The connection has to stay open, because the database disappears together with it.",
    nl: "SQLite in memory is het praktische midden. Het draait echte SQL door de echte EF Core-pijplijn, het start per test op en het heeft geen container nodig. De connectie moet openblijven, want de database verdwijnt samen met de connectie.",
  },
  databaseTest3: {
    en: "ChangeTracker.Clear is the line people forget. Without it the repository hands back the instance that is still in memory, and the test proves nothing at all about reading.",
    nl: "ChangeTracker.Clear is de regel die mensen vergeten. Zonder die regel geeft de repository de instantie terug die nog in het geheugen zit, en bewijst de test helemaal niets over lezen.",
  },
  databaseTest4: {
    en: "SQLite is not SQL Server. It is relaxed about column types and it has no real support for some SQL Server features. Keep it for mapping and for the shape of your queries. When a query relies on provider-specific SQL, run that one against SQL Server in a container.",
    nl: "SQLite is geen SQL Server. Het is soepel over kolomtypes en het ondersteunt sommige SQL Server-functies niet echt. Houd het bij mapping en bij de vorm van je queries. Leunt een query op providerspecifieke SQL, draai die dan tegen SQL Server in een container.",
  },
  databaseTest5: {
    en: "Three things are not worth a test. Do not test that a property setter sets a property. Do not test that Program.cs registered a service, because the application refuses to start when it did not. Do not test EF Core itself, only your own mapping of your own entities.",
    nl: "Drie dingen zijn geen test waard. Test niet dat een property setter een property zet. Test niet dat Program.cs een service heeft geregistreerd, want de applicatie start niet als dat niet is gebeurd. Test EF Core niet zelf, alleen je eigen mapping van je eigen entiteiten.",
  },
  boundariesTitle: {
    en: "Four boundaries decide whether the design holds",
    nl: "Vier grenzen bepalen of het ontwerp standhoudt",
  },
  boundaries1: {
    en: "The hexagon is easy to draw and easy to get wrong in four familiar places.",
    nl: "De hexagon is makkelijk te tekenen en op vier bekende plekken makkelijk verkeerd te doen.",
  },
  moneyPath: {
    en: "One sequence deserves its own sentence, because it costs money. The use case charges the payment provider first and commits the renewal afterwards. The test covers the safe direction, a refused payment that saves nothing. The other direction is the charge that succeeds while the commit fails, and the customer has paid for a renewal that does not exist. Two things answer it. The charge carries an idempotency key derived from the membership and the term, so a retry after the failed commit charges nobody twice, and a compensating refund runs when the commit cannot be retried. When a team sees that path more than once a month, it is time to grow the sequence into an outbox: the use case records the intent in the same transaction as the renewal, and a relay performs the charge after the commit.",
    nl: "Eén volgorde verdient een eigen zin, omdat ze geld kost. De use case belast eerst de betaalprovider en legt de verlenging daarna vast. De test dekt de veilige richting, een geweigerde betaling waarbij niets wordt opgeslagen. De andere richting is de betaling die slaagt terwijl de commit mislukt, en dan heeft de klant betaald voor een verlenging die niet bestaat. Twee dingen beantwoorden dat. De betaling draagt een idempotentiesleutel die is afgeleid van het lidmaatschap en de termijn, zodat een herhaling na de mislukte commit niemand twee keer belast, en een compenserende terugbetaling loopt wanneer de commit niet opnieuw kan. Ziet een team dat pad vaker dan één keer per maand, dan is het tijd om de volgorde uit te bouwen tot een outbox: de use case legt de intentie vast in dezelfde transactie als de verlenging, en een relay voert de betaling na de commit uit.",
  },
  transferLabel: { en: "Data transfer objects.", nl: "Data transfer objects." },
  transferBody: {
    en: "They belong to the adapter that speaks that protocol and they never travel inward. A use case takes a command built from primitives and domain types. The moment a JSON contract reaches the domain, that contract owns the domain.",
    nl: "Ze horen bij de adapter die dat protocol spreekt en ze reizen nooit naar binnen. Een use case krijgt een commando dat is opgebouwd uit primitieven en domeintypes. Zodra een JSON-contract het domein bereikt, bezit dat contract het domein.",
  },
  mappingLabel: { en: "Mapping.", nl: "Mapping." },
  mappingBody: {
    en: "Do it at the edge, by hand, inside the adapter. A mapping library saves typing and hides the one field that quietly stopped being copied. Manual mapping is the cheapest documentation of a boundary you will ever write.",
    nl: "Doe het aan de rand, met de hand, binnen de adapter. Een mappingbibliotheek bespaart typewerk en verbergt dat ene veld dat stilletjes niet meer wordt overgenomen. Handmatig mappen is de goedkoopste documentatie van een grens die je ooit schrijft.",
  },
  transactionLabel: { en: "Transactions.", nl: "Transacties." },
  transactionBody: {
    en: "A transaction is a decision of the use case, so the unit of work is a port. The application says commit. The adapter decides whether that means SaveChangesAsync, a TransactionScope or a message that gets published.",
    nl: "Een transactie is een beslissing van de use case, dus de unit of work is een port. De applicatie zegt commit. De adapter bepaalt of dat SaveChangesAsync betekent, een TransactionScope of een bericht dat wordt gepubliceerd.",
  },
  eventsLabel: { en: "Domain events.", nl: "Domain events." },
  eventsBody: {
    en: "Let the entity record what happened, in a plain list on the aggregate. The use case reads that list after the commit and hands it to a publisher port. Raising an event straight onto a message bus from inside an entity puts a broker in the middle of your rules.",
    nl: "Laat de entiteit vastleggen wat er is gebeurd, in een gewone lijst op het aggregate. De use case leest die lijst na de commit en geeft hem aan een publisher-port. Een event vanuit een entiteit rechtstreeks op een message bus zetten, plaatst een broker midden in je regels.",
  },
  boundaries2: {
    en: "The four boundaries above assume the local commit is the last thing that can fail. The direction that actually costs money runs the other way. The payment gateway accepts the charge, and the local commit fails afterwards, so the customer has paid for a renewal the system never recorded. A charge that carries its own idempotency key turns a retry into a safe no-op, so the endpoint can ask the gateway to charge again after a failed commit without charging the customer twice. A refusal that still slips through needs an answer of its own, a compensating refund issued against the same reference. Once that reconciliation stops being an exception and starts being a routine step, the team has outgrown this shape, and the charge belongs in an outbox row, written in the same transaction as the domain event above and relayed once the commit is durable.",
    nl: "De vier grenzen hierboven gaan ervan uit dat de lokale commit het laatste is dat kan mislukken. De richting die echt geld kost loopt de andere kant op. De betaalprovider accepteert de incasso, en de lokale commit mislukt daarna, waardoor de klant heeft betaald voor een verlenging die het systeem nooit heeft vastgelegd. Een incasso met een eigen idempotentiesleutel maakt van een nieuwe poging een veilige no-op, zodat het endpoint de provider na een mislukte commit opnieuw om een incasso kan vragen zonder de klant twee keer te laten betalen. Een weigering die daar toch doorheen glipt, vraagt om een eigen antwoord, een compenserende terugbetaling tegen dezelfde referentie. Zodra die afstemming geen uitzondering meer is maar een routinestap, is het team deze vorm ontgroeid, en hoort de incasso in een outboxrij, geschreven in dezelfde transactie als het domain event hierboven en doorgezet zodra de commit duurzaam is.",
  },
  mazeTitle: {
    en: "A hexagon turns into a maze when every class gets an interface",
    nl: "Een hexagon wordt een doolhof als elke klasse een interface krijgt",
  },
  maze1: {
    en: "The failure mode is not too little structure. It is structure spread evenly over things that do not need any. Three symptoms show up together.",
    nl: "De faalmodus is niet te weinig structuur. Het is structuur die gelijkmatig wordt uitgesmeerd over dingen die er geen nodig hebben. Drie symptomen komen samen op.",
  },
  maze2: {
    en: "An interface with exactly one implementation and no test double is a rename waiting to happen. Delete it and inject the class.",
    nl: "Een interface met precies één implementatie en zonder testdubbel is een hernoeming die staat te wachten. Verwijder hem en injecteer de klasse.",
  },
  maze3: {
    en: "An anaemic domain, where every entity is properties only and every rule sits in a service, gives you all the folders of a hexagon and none of the benefit. When Renew is a method on a MembershipService that takes a Membership, move it onto Membership.",
    nl: "Een bloedarm domein, waarin elke entiteit alleen properties heeft en elke regel in een service zit, geeft je alle mappen van een hexagon en geen van de voordelen. Staat Renew als methode op een MembershipService die een Membership meekrijgt, verplaats hem dan naar Membership.",
  },
  maze4: {
    en: "A layer that only forwards, where a handler calls a service that calls a repository with the same arguments, is a file you can delete without changing any behaviour.",
    nl: "Een laag die alleen doorgeeft, waarin een handler een service aanroept die met dezelfde argumenten een repository aanroept, is een bestand dat je kunt verwijderen zonder enig gedrag te veranderen.",
  },
  maze5: {
    en: "The useful test is a question about change. For every interface, name the second implementation you can imagine shipping, or name the test that needs a stand-in. When neither exists, you added a step to every stack trace and bought nothing with it.",
    nl: "De bruikbare toets is een vraag over verandering. Noem per interface de tweede implementatie die je je kunt voorstellen, of noem de test die een vervanger nodig heeft. Bestaat geen van beide, dan heb je aan elke stack trace een stap toegevoegd en er niets voor teruggekregen.",
  },
  migrationTitle: {
    en: "Introduce ports one use case at a time",
    nl: "Voer ports in, use case voor use case",
  },
  migration1: {
    en: "You do not need permission for a rewrite, and you should not ask for one either. The same reversible steps that move a legacy page onto a new frontend stack work on a .NET service. Pick the use case that hurts most and take five steps. Keep the framework upgrade out of this sequence. A solution that still targets .NET 8 needs one anyway, because that release leaves support on 10 November 2026, and it lands far more calmly in a commit of its own.",
    nl: "Je hebt geen toestemming voor een herbouw nodig, en je moet er ook niet om vragen. Dezelfde omkeerbare stappen waarmee je een legacy pagina naar een nieuwe frontendstack verhuist, werken op een .NET-service. Kies de use case die het meest pijn doet en zet vijf stappen. Houd de frameworkupgrade buiten deze reeks. Een solution die nog op .NET 8 draait heeft er sowieso een nodig, want die versie valt op 10 november 2026 uit de ondersteuning, en los in een eigen commit verloopt dat een stuk rustiger.",
  },
  step1: {
    en: "Add a domain project to the existing solution with no package references. Move one entity into it and let the compiler tell you what came along.",
    nl: "Voeg een domeinproject zonder pakketverwijzingen toe aan de bestaande solution. Verplaats één entiteit ernaartoe en laat de compiler vertellen wat er meekwam.",
  },
  step2: {
    en: "Write the port you wish the old code had. Give it the one method the use case needs, not the fourteen methods the existing repository exposes.",
    nl: "Schrijf de port die je de oude code had gegund. Geef hem de ene methode die de use case nodig heeft, niet de veertien methodes die de bestaande repository aanbiedt.",
  },
  step3: {
    en: "Implement that port with the old code inside it. The first adapter is often a wrapper around the service you already have. It is allowed to be ugly, because it is temporary and it is one file.",
    nl: "Implementeer die port met de oude code erin. De eerste adapter is vaak een omhulsel om de service die je al hebt. Die mag lelijk zijn, want hij is tijdelijk en het is één bestand.",
  },
  step4: {
    en: "Move the rules out of the old service and into the entity, with the use case tests as your safety net. This is the step that carries real behaviour risk, so it goes behind a feature flag when the endpoint is busy.",
    nl: "Haal de regels uit de oude service en zet ze in de entiteit, met de use-casetests als vangnet. Dit is de stap met echt gedragsrisico, dus die gaat achter een feature flag als het endpoint druk is.",
  },
  step5: {
    en: "Point the controller or the endpoint at the use case, and delete the old path once the flag has been at a hundred percent for a while.",
    nl: "Wijs de controller of het endpoint naar de use case, en verwijder het oude pad zodra de vlag een tijd op honderd procent staat.",
  },
  migration2: {
    en: "Every step compiles, every step ships and every step can be reverted with one commit. After three or four use cases the shape becomes visible and the team stops needing the diagram.",
    nl: "Elke stap compileert, elke stap gaat live en elke stap is met één commit terug te draaien. Na drie of vier use cases wordt de vorm zichtbaar en heeft het team de tekening niet meer nodig.",
  },
  closingTitle: {
    en: "The same discipline keeps a React page data-driven",
    nl: "Dezelfde discipline houdt een React-pagina datagedreven",
  },
  closing1: {
    en: "I spend most of my week in React and Angular, and the rule I apply there is the one above. A component receives what it needs and reaches the outside world through a boundary it does not own itself. A .NET domain keeps its rules together in exactly the same way. Frontend or backend, the question stays the same. Which part of this file would still be true if we replaced the framework tomorrow?",
    nl: "Ik zit het grootste deel van mijn week in React en Angular, en de regel die ik daar toepas is dezelfde. Een component krijgt wat hij nodig heeft en bereikt de buitenwereld via een grens die hij niet zelf bezit. Een .NET-domein houdt zijn regels op precies dezelfde manier bij elkaar. Frontend of backend, de vraag blijft gelijk. Welk deel van dit bestand zou morgen nog kloppen als we het framework vervingen?",
  },
  closing2: {
    en: "That answer is the part you protect. Everything else is an adapter.",
    nl: "Dat antwoord is het deel dat je beschermt. Al het andere is een adapter.",
  },
  nodeMinimalApi: { en: "Minimal API", nl: "Minimal API" },
  nodeGrpc: { en: "gRPC service", nl: "gRPC-service" },
  nodeConsumer: { en: "Message consumer", nl: "Message consumer" },
  nodeUseCaseSub: { en: "use case, owns the ports", nl: "use case, bezit de ports" },
  nodeDomain: { en: "Domain", nl: "Domein" },
  nodeDrivenPorts: { en: "Driven ports", nl: "Driven ports" },
  nodeRepository: { en: "EF Core repository", nl: "EF Core-repository" },
  nodePayment: { en: "Payment client", nl: "Betaalclient" },
  nodePaymentSub: { en: "another service", nl: "andere service" },
  nodeMail: { en: "Mail sender", nl: "Mailverzender" },
  nodeMailSub: { en: "renewal confirmation", nl: "bevestiging van verlenging" },
  edgeMessage: { en: "message", nl: "bericht" },
  edgeApplies: { en: "applies rules", nl: "past regels toe" },
  edgeCalls: { en: "calls", nl: "roept aan" },
  edgeImplements: { en: "implemented by", nl: "geïmplementeerd door" },
} as const;
