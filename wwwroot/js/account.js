// Khi nút "Sign up" được nhấn
$("#modalLogin").on("click", function () {
    // Mở modalLogin
    $("#modalLogin").modal("show");
});
$('#modalLogin').on('hidden.bs.modal', function () {
    // Lấy phần tử DOM
    var usernameInput = document.getElementById("username");
    var passwordInput = document.getElementById("password");

    // Kiểm tra và xóa thông tin nếu phần tử tồn tại và không null
    if (usernameInput) {
        usernameInput.value = '';
    }
    if (passwordInput) {
        passwordInput.value = '';
    }

    // Xóa thông báo lỗi
    $('#errorMessage').text('');
});

// Khi nút "Sign up" trong modal đăng nhập được nhấn
$("#themKH2").on("click", function () {
    // Đóng modalLogin và mở addKHModal
    $("#modalLogin").modal("hide");
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
            return;
        }

        try {
            const response = await fetch("https://localhost:7182/api/Account/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, password })
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
            errorMessage.textContent = "Không thể kết nối đến máy chủ. Vui lòng thử lại.";
            errorMessage.style.display = "block";
        }
    });

    function getRoleFromToken(token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || "KhachHang";
    }

    function redirectToRoleBasedPage(role) {
        switch (role) {
            case "Admin":
                window.location.href = "/Admin";
                break;
            case "NhanVien":
                window.location.href = "/Employee";
                break;
            case "KhachHang":
                window.location.href = "/Customer";
                break;
            default:
                window.location.href = "/Home/Index";
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
        document.getElementById("gtkh").value = 'Nam';
        document.getElementById("dckh").value = '';
        document.getElementById("userkh").value = '';
        document.getElementById("passkh").value = '';
        document.getElementById("errorMessagesignup").style.display = 'none';
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
            tenKh,
            sdt: sdtKh,
            gioitinh: gtKh,
            diachi: dcKh,
            tendangnhap: userKh,
            taiKhoan: {
                password: passKh,
                role: "KhachHang"
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
                alert("Đăng ký thành công!");
                $('#addKHModal').modal('hide');
            } else {
                let errorMessage = "Có lỗi xảy ra trong quá trình đăng ký.";
                const result = await response.text();

                if (result) {
                    if (result.includes("Tài khoản đã tồn tại.")) {
                        errorMessage = "Tên đăng nhập đã tồn tại.";
                    } else if (result.includes("Số điện thoại đã tồn tại.")) {
                        errorMessage = "Số điện thoại đã tồn tại.";
                    } else {
                        errorMessage = result;
                    }
                }

                document.getElementById("errorMessagesignup").textContent = errorMessage;
                document.getElementById("errorMessagesignup").style.display = 'block';
            }
        } catch (error) {
            document.getElementById("errorMessagesignup").textContent = "Không thể kết nối đến máy chủ. Vui lòng thử lại.";
            document.getElementById("errorMessagesignup").style.display = 'block';
        }
    });
});
