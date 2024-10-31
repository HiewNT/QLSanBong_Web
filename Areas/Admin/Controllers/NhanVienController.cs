using Microsoft.AspNetCore.Mvc;
using QLSanBong_API.Services; // Đảm bảo rằng bạn đã import service của mình
using System.Threading.Tasks;

namespace QLSanBong_Web.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class NhanVienController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        // Phương thức trả về Partial View
        public IActionResult NhanVienList()
        {
            return PartialView("_NhanVienList"); // Tên của Partial View
        }
    }
}
