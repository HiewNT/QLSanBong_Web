
        // Khi nút "Sign up" được nhấn
    $("#modalLogin").on("click", function () {
        // Mở addKHModal
        $("#modalLogin").modal("show");
        });

    $('#modalLogin').on('hidden.bs.modal', function () {
        // Xóa thông báo lỗi khi modal được ẩn
        document.getElementById("username").value = '';
    document.getElementById("password").value = '';
    $('#errorMessage').text('');
        });


    // Khi nút "Sign up" được nhấn
    $("#themKH2").on("click", function () {
        // Đóng modalLogin
        $("#modalLogin").modal("hide");
    // Mở addKHModal
    $("#addKHModal").modal("show");
        });


    document.addEventListener("DOMContentLoaded", function () {
            const loginForm = document.getElementById("loginForm");

    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

    const formData = new FormData(loginForm);
    const username = formData.get("username");
    const password = formData.get("password");
    const errorMessage = document.getElementById("errorMessage");

    // Kiểm tra nếu thiếu tên đăng nhập hoặc mật khẩu
    if (!username || !password) {
        errorMessage.textContent = "Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.";
    errorMessage.style.display = "block";
    return; // Ngăn chặn việc tiếp tục gọi API
                }

    try {
                    const response = await fetch("https://localhost:7182/api/Account/login", {
        method: "POST",
    headers: {
        "Content-Type": "application/json"
                        },
    body: JSON.stringify({
        username: username,
    password: password
                        })
                    });

    const result = await response.json();

    if (response.ok) {
                        const token = result.token;
    sessionStorage.setItem("Token", token);
    const role = getRoleFromToken(token);
    redirectToRoleBasedPage(role);
                    } else {
        errorMessage.textContent = result.message || "Tên đăng nhập hoặc mật khẩu không đúng";
    errorMessage.style.display = "block";
                    }
                } catch (error) {
        console.error("Error:", error);
    errorMessage.textContent = "Không thể kết nối đến máy chủ. Vui lòng thử lại.";
    errorMessage.style.display = "block";
                }
            });

    function getRoleFromToken(token) {
                const payload = JSON.parse(atob(token.split('.')[1]));
    // Đảm bảo rằng bạn sử dụng đúng key cho role
    return payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || "KhachHang"; // Trả về vai trò hoặc mặc định
            }



    function redirectToRoleBasedPage(role) {
                switch (role) {
                    case "Admin":
    window.location.href = "/Admin"; // Redirect to Admin page
    break;
    case "NhanVien":
    window.location.href = "/Employee"; // Redirect to Employee page
    break;
    case "KhachHang":
    window.location.href = "/Customer"; // Redirect to Customer page
    break;
    default:
    window.location.href = "/Home/Index"; // Redirect to default page
                }
            }
        });


    document.addEventListener("DOMContentLoaded", function () {
            const addKHButton = document.getElementById("addKH");
    const addKHModal = document.getElementById("addKHModal");

    // Xóa thông tin trong các trường khi modal đóng
    addKHModal.addEventListener("hidden.bs.modal", function () {
        document.getElementById("tenkh").value = '';
    document.getElementById("sdtkh").value = '';
    document.getElementById("gtkh").value = 'Nam'; // Reset về giá trị mặc định
    document.getElementById("dckh").value = '';
    document.getElementById("userkh").value = '';
    document.getElementById("passkh").value = '';
    document.getElementById("errorMessagesignup").style.display = 'none'; // Ẩn thông báo lỗi
            });

    addKHButton.addEventListener("click", async function () {
                const tenKh = document.getElementById("tenkh").value;
    const sdtKh = document.getElementById("sdtkh").value;
    const gtKh = document.getElementById("gtkh").value;
    const dcKh = document.getElementById("dckh").value;
    const userKh = document.getElementById("userkh").value;
    const passKh = document.getElementById("passkh").value;

    // Kiểm tra các trường không được để trống
    if (!tenKh || !sdtKh || !gtKh || !dcKh || !userKh || !passKh) {
        document.getElementById("errorMessagesignup").textContent = "Vui lòng điền đầy đủ thông tin.";
    document.getElementById("errorMessagesignup").style.display = 'block';
    return;
                }

    const khachHangData = {
        tenKh: tenKh,
    sdt: sdtKh,
    gioitinh: gtKh,
    diachi: dcKh,
    tendangnhap: userKh,
    taiKhoan: {
        password: passKh,
    role: "KhachHang"  // Đặt role mặc định là KhachHang
                    }
                };

    try {
                    const response = await fetch("https://localhost:7182/api/Account/signup", {
        method: "POST",
    headers: {
        "Content-Type": "application/json"
                        },
    body: JSON.stringify(khachHangData)
                    });

    if (response.ok) {
        // Hiển thị thông báo thành công
        alert("Đăng ký thành công!");
    // Đóng modal
    $('#addKHModal').modal('hide');
                    } else {
        // Hiển thị thông báo lỗi từ API
        let errorMessage = "Có lỗi xảy ra trong quá trình đăng ký."; // Thông điệp mặc định

    const result = await response.text(); // Đọc phản hồi dưới dạng văn bản
    if (result) {
                            if (result.includes("Tài khoản đã tồn tại.")) {
        errorMessage = "Tên đăng nhập đã tồn tại.";
                            } else if (result.includes("Số điện thoại đã tồn tại.")) {
        errorMessage = "Số điện thoại đã tồn tại.";
                            } else {
        errorMessage = result; // Lấy thông điệp lỗi từ phản hồi
                            }
                        }

    // Hiển thị thông báo lỗi
    document.getElementById("errorMessagesignup").textContent = errorMessage;
    document.getElementById("errorMessagesignup").style.display = 'block';
                    }
                } catch (error) {
        console.error("Lỗi:", error);
    document.getElementById("errorMessagesignup").textContent = "Không thể kết nối đến máy chủ. Vui lòng thử lại.";
    document.getElementById("errorMessagesignup").style.display = 'block';
                }
            });
        });