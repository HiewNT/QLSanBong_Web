using Microsoft.AspNetCore.Mvc;
using System.Web.Http;

namespace QLSanBong_Web.Areas.Admin.Controllers
{
    public class HomeController : Controller
    {
        [Area("Admin")]
        public IActionResult Index()
        {
            return View();
        }
    }
}
