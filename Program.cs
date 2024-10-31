using Microsoft.AspNetCore.Session;
using Microsoft.EntityFrameworkCore;
using QLSanBong_API.Data;
using QLSanBong_API.Services;

var builder = WebApplication.CreateBuilder(args);

// Thêm các dịch vụ vào container.
builder.Services.AddControllersWithViews();

// Thêm HttpClient để gọi API
builder.Services.AddHttpClient();

// Đăng ký DbContext với connection string từ cấu hình
builder.Services.AddDbContext<QlsanBongContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("QlsanBongContext"))); // Sử dụng connection string của bạn


// Đăng ký session
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

// Cấu hình CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("MyCors", builder =>
    {
        builder.WithOrigins("https://localhost:7198","https://localhost:7182") // URL của ứng dụng client
               .AllowAnyHeader()
               .AllowAnyMethod();
    });
});

var app = builder.Build();

// Cấu hình pipeline HTTP request.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

// Áp dụng chính sách CORS
app.UseCors("MyCors");

// Sử dụng session
app.UseSession();

// Sử dụng Authentication và Authorization (nếu có)
app.UseAuthentication();
app.UseAuthorization();

// Định nghĩa các route cho ứng dụng
app.MapControllerRoute(
    name: "admin",
    pattern: "Admin/{controller=Home}/{action=Index}/{id?}",
    defaults: new { area = "Admin" });

// Định nghĩa các route cho ứng dụng
app.MapControllerRoute(
    name: "customer",
    pattern: "Customer/{controller=Home}/{action=Index}/{id?}",
    defaults: new { area = "Customer" });

// Định nghĩa các route cho ứng dụng
app.MapControllerRoute(
    name: "employee",
    pattern: "Employee/{controller=Home}/{action=Index}/{id?}",
    defaults: new { area = "Employee" });

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
