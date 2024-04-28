using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;
using Dapper;
using FluentMigrator.Runner;
using PlaylistManager.Data;
using PlaylistManager.Data.Models;
using PlaylistManager.Migrations.Scripts;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers().AddJsonOptions((opts) => {
    opts.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
});

builder.Services.AddFluentMigratorCore()
                .ConfigureRunner(rb => rb
                    // Add SQLite support to FluentMigrator
                    .AddSQLite()
                    // Set the connection string
                    .WithGlobalConnectionString(builder.Configuration.GetConnectionString("main"))
                    // Define the assembly containing the migrations
                    .ScanIn(typeof(CreateVideoTable).Assembly).For.Migrations())
                // Enable logging to console in the FluentMigrator way
                .AddLogging(lb => lb.AddFluentMigratorConsole());

builder.Services.AddSingleton<IDbContext, SqliteDbContext>();
builder.Services.AddTransient<IVideoRepository, VideoRepository>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.MapControllers();


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
