﻿async function searchButton() {
    const maSb = document.getElementById('idSan').value;
    const ngayDat = document.getElementById('dayOrder').value;
    const gioBatDau = document.getElementById('timeStart').value;
    const gioKetThuc = document.getElementById('timeEnd').value;

    const result = {
        MaSb: maSb || "",
        Ngaysudung: ngayDat || new Date().toISOString().split('T')[0], // Nếu không có ngày thì lấy ngày hiện tại
        Giobatdau: gioBatDau,
        Gioketthuc: gioKetThuc
    };

    if (gioBatDau != null && gioKetThuc != null && gioBatDau >= gioKetThuc) {
        alert("Giờ bắt đầu phải nhỏ hơn giờ kết thúc.");
        return; // Ngừng thực hiện nếu điều kiện không thỏa mãn
    }

    try {
        const response = await fetch('https://localhost:7182/api/SanBong/santrong', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(result),
        });

        if (!response.ok) {
            const errorText = await response.text(); // Lấy phản hồi dạng text
            alert("Lỗi: " + errorText); // Hiển thị thông báo lỗi
            return;
        }

        const data = await response.json();
        displaySanTrong(data);
    } catch (error) {
    }
}


function displaySanTrong(sanTrongs) {
    const modalTableBody = document.getElementById('modalTableBody');
    modalTableBody.innerHTML = ''; // Xóa dữ liệu cũ

    if (sanTrongs.length === 0) {
        modalTableBody.innerHTML = '<tr><td colspan="7" class="text-center">Không có sân nào trống trong thời gian này.</td></tr>';
    } else {
        sanTrongs.forEach(san => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${san.maSb}</td>
                <td>${san.sanBongVM1.tenSb}</td>
                <td>${san.sanBongVM1.diaChi}</td>
                <td>${san.ngaysudung}</td>
                <td>${san.giaGioThueVM1.giobatdau}</td>
                <td>${san.giaGioThueVM1.gioketthuc}</td>
                <td>${san.giaGioThueVM1.dongia.toLocaleString()} VND</td>
                <td>
                    <button class="btn btn-success open-modal"
                            data-bs-toggle="modal"
                            data-bs-target="#modalOrder"
                            data-ma-san="${san.maSb}"
                            data-ma-gio="${san.giaGioThueVM1.magio}"
                            data-ngay-dat-san="${san.ngaysudung}"
                            data-gio-bat-dau="${san.giaGioThueVM1.giobatdau}"
                            data-gio-ket-thuc="${san.giaGioThueVM1.gioketthuc}" 
                            id="order" name="order">
                        <i class="fas fa-calendar-alt"></i> Đặt sân
                    </button>
                    <button onclick="addToCart('${san.maSb}', '${san.ngaysudung}', '${san.magio}')">
                        <i class="fas fa-calendar-alt"></i> Thêm vào chờ
                    </button>

                </td>
            `;
            modalTableBody.appendChild(row);
        });
    }

    // Hiển thị modal sau khi đã điền dữ liệu
    const sanTrongModal = new bootstrap.Modal(document.getElementById('sanTrongModal'));
    sanTrongModal.show();
}


$(document).ready(function () {
    loadSanBongs(); // Gọi hàm tải danh sách sân bóng

    async function loadSanBongs() {
        let url = `https://localhost:7182/api/SanBong/getall`;

        try {
            const token = sessionStorage.getItem("Token");
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error("Không thể tải danh sách sân bóng.");
            }

            const sanBongs = await response.json();

            // Thêm dữ liệu vào div chứa các ô sân bóng
            const sanBongGrid = $('#sanBongGrid');
            sanBongGrid.empty();

            sanBongs.forEach(sb => {
                const sanBongCard = `
                            <div class="col-md-4 mb-4">
                                <div class="card h-100">
                                    <img src="data:image/png;base64,${sb.hinhanh}" class="card-img-top" alt="${sb.tenSb}" style="height: 200px; object-fit: cover;">
                                    <div class="card-body">
                                        <h5 class="card-title text-center">Sân bóng ${sb.tenSb}</h5>
                                        <p class="card-text">Diện tích: ${sb.dientich} m²</p>
                                        <p class="card-text">Địa chỉ: ${sb.diaChi}</p>
                                        <p class="card-text">${sb.ghichu}</p>
                                    </div>
                                </div>
                            </div>
                        `;
                sanBongGrid.append(sanBongCard);
            });
        } catch (error) {
            console.error("Lỗi:", error);
            $('#sanBongGrid').html(`<div class="text-danger text-center">${error.message}</div>`);
        }
    }
});

// Hàm để thêm sản phẩm vào giỏ hàng
function addToCart(maSan, ngayDatSan, maGio) {
    const gioHang = {
        MaSb: maSan,
        Ngaysudung: ngayDatSan,
        Magio: maGio
    };

    fetch('https://localhost:7182/api/GioHang/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(gioHang)
    })
        .then(response => {
            if (response.ok) {
                // Nếu phản hồi thành công, kiểm tra xem có phải JSON không
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    return response.json(); // Trả về dữ liệu nếu thành công
                } else {
                    return response.text(); // Nếu không phải JSON, lấy như văn bản
                }
            } else {
                // Nếu không thành công, trả về thông báo lỗi
                return response.text().then(text => {
                    throw new Error(text || 'Failed to add to cart');
                });
            }
        })
        .then(data => {
            alert(data); // Hiển thị thông báo thành công

            // Lưu giỏ hàng vào localStorage
            saveToLocalStorage(gioHang);

        })
        .catch(error => {
            console.error('Error:', error);
            alert('Có lỗi xảy ra: ' + error.message); // Hiển thị thông báo lỗi
        });
}

// Hàm lưu giỏ hàng vào localStorage
function saveToLocalStorage(gioHang) {
    // Lấy giỏ hàng hiện có từ localStorage
    let cart = JSON.parse(localStorage.getItem('gioHang')) || [];

    // Thêm sản phẩm mới vào giỏ hàng
    cart.push(gioHang);

    // Lưu lại giỏ hàng vào localStorage
    localStorage.setItem('gioHang', JSON.stringify(cart));
}



