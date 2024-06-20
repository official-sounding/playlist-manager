using System.Text.Json;
using System.Text.Json.Serialization;
using FluentMigrator.Runner;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;
using PlaylistManager.Data;
using PlaylistManager.Migrations.Scripts;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<YTConfig>(builder.Configuration.GetSection("ytdl"));

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers().AddJsonOptions((opts) =>
{
    opts.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    opts.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
});


builder.Services.AddFluentMigratorCore()
                .ConfigureRunner(rb => rb
                    // Add SQLite support to FluentMigrator
                    .AddSQLite()
                    // Set the connection string
                    .WithGlobalConnectionString(builder.Configuration.GetConnectionString("main"))
                    // Define the assembly containing the migrations
                    .ScanIn(typeof(CreateVideoTable).Assembly).For.Migrations());

builder.Services.AddLogging(lb =>
{
    lb.AddFluentMigratorConsole();
    lb.AddSimpleConsole((sc) =>
    {
        sc.SingleLine = true;
        sc.UseUtcTimestamp = true;
    });
});

builder.Services.AddSingleton<IDbContext, SqliteDbContext>();
builder.Services.AddSingleton(TimeProvider.System);
builder.Services.AddSingleton<IVideoJobQueue, VideoJobQueue>();

builder.Services.AddTransient<IVideoRepository, VideoRepository>();
builder.Services.AddTransient<PlaylistRepository>();
builder.Services.AddTransient<YoutubeDLWrapper>();
builder.Services.AddTransient<VideoService>();


builder.Services.AddHostedService<VideoJobProcessingService>();



var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseMiddleware<OperationCanceledMiddleware>();

app.MapControllers();
app.MapGet("/api/video/job/stream", async (
  [FromServices] IVideoJobQueue queue,
  [FromServices] IHttpContextAccessor accessor,
  CancellationToken ct
) =>
{
    var response = accessor.HttpContext!.Response;
    var LINE_END = $"{Environment.NewLine}{Environment.NewLine}";
    response.Headers[HeaderNames.ContentType] = "text/event-stream";

    await queue.ConsumeLogAsync(ct, async (item) => {
        await response.WriteAsync($"{JsonSerializer.Serialize(item)}{LINE_END}", ct);
        await response.Body.FlushAsync(ct);
    });

    await response.WriteAsync($@"{{ ""type"":""end"" }} {LINE_END}", ct);
    await response.Body.FlushAsync(ct);
});


UpdateDatabase(app.Services);

app.Run();


static void UpdateDatabase(IServiceProvider serviceProvider)
{
    using var scope = serviceProvider.CreateScope();
    // Instantiate the runner
    var runner = scope.ServiceProvider.GetRequiredService<IMigrationRunner>();

    // Execute the migrations
    runner.MigrateUp();
}
