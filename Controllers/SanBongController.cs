using Microsoft.AspNetCore.Mvc;

namespace QLSanBong_Web.Controllers
{
    public class SanBongController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
