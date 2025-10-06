using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using MessageApi.Data;
using MessageApi.Models;
using MessageApi.Repositories;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<MessageContext>(opt =>
    opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=messages.db"));
builder.Services.AddScoped<MessageRepository>();
builder.Services.AddHttpClient();
builder.Services.AddControllers();
var app = builder.Build();

// Ensure DB created
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<MessageContext>();
    db.Database.EnsureCreated();
}

app.MapPost("/messages", async (MessageDto dto, MessageRepository repo, IHttpClientFactory http, IConfiguration config) =>
{
    var m = new Message { Nickname = dto.Nickname, Content = dto.Content, SentAt = DateTime.UtcNow };
    await repo.AddAsync(m);

    var aiUrl = config["AI_URL"] ?? Environment.GetEnvironmentVariable("AI_URL");
    if (!string.IsNullOrEmpty(aiUrl))
    {
        try
        {
            var client = http.CreateClient();
            // Gradio/Spaces expects { "data": [ <inputs...> ] }
            var payload = new { data = new[] { m.Content } };
            var resp = await client.PostAsJsonAsync($"{aiUrl.TrimEnd('/')}/api/predict", payload);
            if (resp.IsSuccessStatusCode)
            {
                using var stream = await resp.Content.ReadAsStreamAsync();
                using var doc = await JsonDocument.ParseAsync(stream);
                if (doc.RootElement.TryGetProperty("data", out var dataElem) && dataElem.ValueKind == JsonValueKind.Array)
                {
                    string? label = null;
                    double? score = null;
                    // Gradio often returns a simple array like ["LABEL", 0.95]
                    if (dataElem.GetArrayLength() > 0)
                    {
                        var first = dataElem[0];
                        if (first.ValueKind == JsonValueKind.String)
                            label = first.GetString();
                        else if (first.ValueKind == JsonValueKind.Object)
                        {
                            // sometimes HF returns an object with label/score
                            if (first.TryGetProperty("label", out var lab) && lab.ValueKind == JsonValueKind.String)
                                label = lab.GetString();
                            if (first.TryGetProperty("score", out var sc) && sc.ValueKind == JsonValueKind.Number)
                                score = sc.GetDouble();
                        }
                    }
                    if (dataElem.GetArrayLength() > 1 && dataElem[1].ValueKind == JsonValueKind.Number)
                        score = dataElem[1].GetDouble();

                    if (!string.IsNullOrEmpty(label))
                    {
                        m.SentimentLabel = label;
                        m.SentimentScore = score;
                        await repo.UpdateAsync(m);
                    }
                }
            }
        }
        catch (Exception ex)
        {
            // MVP: log errors to console for debugging; in prod use proper logging
            Console.WriteLine($"AI call failed: {ex.Message}");
        }
    }
    return Results.Created($"/messages/{m.Id}", m);
});

app.MapGet("/messages", async (MessageRepository repo) =>
    Results.Ok(await repo.GetAllAsync()));

app.Run();

record MessageDto(string Nickname, string Content);