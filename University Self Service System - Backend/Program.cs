using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using University_Self_Service_System___Backend.Data;
using University_Self_Service_System___Backend.Mappings;
using University_Self_Service_System___Backend.Services.AuthServices;
using University_Self_Service_System___Backend.Services.CourseFactory;
using University_Self_Service_System___Backend.Services.ProfManagement;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// CORS – DEV ONLY: allow any origin, any header, any method
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// EF Core DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));


// Register AutoMapper
builder.Services.AddAutoMapper(typeof(CourseMappingProfile).Assembly); // for create course Mappings

// -----------------------------


builder.Services.AddScoped<ICourseService, courseServices>();

builder.Services.AddScoped<IAuthService, AuthService>();

builder.Services.AddScoped<IProfManagementService, profManagementService>();

// JWT Authentication
var jwtSettings = builder.Configuration.GetSection("Jwt");
var key = Encoding.UTF8.GetBytes(jwtSettings["Key"]);

builder.Services.AddAuthentication(options =>
{options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
 options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;})
    .AddJwtBearer(options =>{options.TokenValidationParameters = new TokenValidationParameters{
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(key)
    };
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// MUST be before auth and MapControllers
app.UseCors();

// IMPORTANT: auth before authorization
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
