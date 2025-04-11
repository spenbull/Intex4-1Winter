using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using MovieINTEX.API.Data;
using MovieINTEX.Data;
using RootkitAuth.API.Data;
using RootkitAuth.API.Services;

var builder = WebApplication.CreateBuilder(args);

// Add core services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Configure Swagger for API documentation
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "MovieINTEX API",
        Version = "v1",
        Description = "API for MovieINTEX app"
    });
});

// Configure database connections

// Get base connection string from appsettings.json
var rawConnectionString = builder.Configuration.GetConnectionString("MovieConnection");

// Get the secure DB password from environment variables
var dbPassword = Environment.GetEnvironmentVariable("DB_PASSWORD");

// Replace placeholder with actual password in connection string
var finalConnectionString = rawConnectionString.Replace("{DB_PASSWORD}", dbPassword);

// Register MovieDbContext using secure SQL Server connection
builder.Services.AddDbContext<MovieDbContext>(options =>
    options.UseSqlServer(finalConnectionString));

// Register Identity context using SQLite for user auth
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("IdentityConnection")));

// Set up Identity with default token providers
builder.Services.AddIdentity<IdentityUser, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

// Customize claims identity options
builder.Services.Configure<IdentityOptions>(options =>
{
    options.ClaimsIdentity.UserIdClaimType = ClaimTypes.NameIdentifier;
    options.ClaimsIdentity.UserNameClaimType = ClaimTypes.Email;
});

// Use custom claims principal factory
builder.Services.AddScoped<IUserClaimsPrincipalFactory<IdentityUser>, CustomUserClaimsPrincipalFactory>();

// Configure Identity cookie settings
builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.HttpOnly = true;
    options.Cookie.SameSite = SameSiteMode.None;
    options.Cookie.Name = ".AspNetCore.Identity.Application";
    options.LoginPath = "/login";
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
});

// Enable authorization service
builder.Services.AddAuthorization();

// Set up CORS to allow frontend origins
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
                "https://green-mushroom-0dae9dc1e.6.azurestaticapps.net",
                "http://localhost:3000"
            )
            .AllowCredentials()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

// Dummy email sender for dev/stub purposes
builder.Services.AddSingleton<IEmailSender<IdentityUser>, NoOpEmailSender<IdentityUser>>();

var app = builder.Build();

// Add HSTS header in production only
if (app.Environment.IsProduction())
{
    app.Use(async (context, next) =>
    {
        context.Response.Headers.Add("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
        await next.Invoke();
    });
}

// Redirect HTTP to HTTPS
app.UseHttpsRedirection();

// Enable Swagger in development only
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "MovieINTEX API V1");
    });
}

// Apply middleware
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();

// Map all controller routes
app.MapControllers();

// Add Identity-specific routes
app.MapIdentityApi<IdentityUser>();

// Add logout endpoint to clear auth cookie
app.MapPost("/logout", async (HttpContext context, SignInManager<IdentityUser> signInManager) =>
{
    await signInManager.SignOutAsync();
    context.Response.Cookies.Delete(".AspNetCore.Identity.Application");
    return Results.Ok(new { message = "Logout successful" });
}).RequireAuthorization();

// Ping endpoint to validate session and return user info
app.MapGet("/pingauth", (ClaimsPrincipal user) =>
{
    if (!user.Identity?.IsAuthenticated ?? false)
    {
        return Results.Unauthorized();
    }

    var email = user.FindFirstValue(ClaimTypes.Email) ?? "unknown@example.com";
    return Results.Json(new { email = email });
}).RequireAuthorization();

// Start the app
app.Run();
