﻿
    let yeuCaus = [];
    let dataTable;

    document.addEventListener("DOMContentLoaded", async function () {
        await loadYeuCaus();
    });

    async function loadYeuCaus() {
        let url = `https://localhost:7182/api/YeuCauDatSan/getall`;
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
                throw new Error("Không thể tải danh sách yêu cầu đặt sân.");
            }

    yeuCaus = await response.json();
    populateTable(yeuCaus);


    dataTable = $('#yeuCauTable').DataTable({
        "paging": true,
    "ordering": true,
    "info": true,
    "searching": true,
    "language": {
        "paginate": {
        "next": "Trang sau",
    "previous": "Trang trước"
                    },
    "info": "Hiển thị từ _START_ đến _END_ của _TOTAL_ yêu cầu đặt sân",
    "search": "Tìm kiếm:"
                }
            });
        } catch (error) {
        console.error("Lỗi:", error);
    document.getElementById('yeuCauContainer').innerHTML = `<p class="text-danger text-center">${error.message}</p>`;
        }
    }

    function populateTable(yeuCaus) {
        const yeuCauList = document.getElementById('yeuCauList');
    yeuCauList.innerHTML = '';

        yeuCaus.forEach(yc => {
        yc.chiTietYcds.forEach(detail => {
            yeuCauList.innerHTML += `
                    <tr>
                        <td>${yc.khachHangDS ? yc.khachHangDS.tenKh : 'N/A'}</td>
                        <td>${yc.khachHangDS ? yc.khachHangDS.sdt : 'N/A'}</td>
                        <td>${yc.thoigiandat}</td>
                        <td>${detail.ngaysudung}</td>
                        <td>${detail.giaGioThueVM1 ? detail.giaGioThueVM1.giobatdau : 'N/A'}</td>
                        <td>${detail.giaGioThueVM1 ? detail.giaGioThueVM1.gioketthuc : 'N/A'}</td>
                        <td>${detail.maSb}</td>
                        <td>${detail.trangThai}</td>
                        <td>
                            <button class="btn btn-info btn-sm"
                                    onclick="infoyeuCau('${yc.stt}', '${detail.maSb}', '${detail.magio}', '${detail.ngaysudung}')">
                                Chi tiết
                            </button>
                        </td>
                    </tr>
                `;
        });
        });
    }

    function filterTable(status, btn) {
        dataTable.columns(7).search(status).draw();
    const buttons = document.querySelectorAll('.btn-group .btn');
        buttons.forEach(button => button.classList.remove('active'));
    btn.classList.add('active');
    }

    function infoyeuCau(stt, maSb, magio, ngaysudung) {
        const request = {Id: stt, MaSb: maSb, Magio: magio, Ngaysudung: ngaysudung };
    loadYeuCauDetail(request);
    }

    async function loadYeuCauDetail(request) {
        let url = `https://localhost:7182/api/YeuCauDatSan/getby`;
    try {
            const token = sessionStorage.getItem("Token");
    const response = await fetch(url, {
        method: "POST",
    headers: {
        "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
                },
    body: JSON.stringify(request)
            });

    if (!response.ok) {
                throw new Error("Không thể tải thông tin chi tiết yêu cầu đặt sân.");
            }

    const detailYeuCau = await response.json();
    populateDetailModal(detailYeuCau);
        } catch (error) {
        console.error("Lỗi:", error);
        }
    }

    function populateDetailModal(detailYeuCau) {
        let content = `
    <p><strong>Mã khách hàng:</strong> ${detailYeuCau.maKh}</p>
    <p><strong>Tên khách hàng:</strong> ${detailYeuCau.khachHangDS ? detailYeuCau.khachHangDS.tenKh : 'N/A'}</p>
    <p><strong>Số điện thoại:</strong> ${detailYeuCau.khachHangDS ? detailYeuCau.khachHangDS.sdt : 'N/A'}</p>
    <p><strong>Thời Gian Đặt:</strong> ${detailYeuCau.thoigiandat}</p>
    <p><strong>Ghi Chú:</strong> ${detailYeuCau.ghiChu || 'Không có'}</p>
    <table class="table table-bordered">
        <thead>
            <tr>
                <th>Mã SB</th>
                <th>Ngày sử dụng</th>
                <th>Mã giờ</th>
                <th>Giờ bắt đầu</th>
                <th>Giờ kết thúc</th>
                <th>Đơn giá</th>
                <th>Trạng Thái</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            `;

        detailYeuCau.chiTietYcds.forEach(detail => {
                content += `
                <tr>
                    <td>${detail.maSb}</td>
                    <td>${detail.ngaysudung}</td>
                    <td>${detail.magio}</td>
                    <td>${detail.giaGioThueVM1 ? detail.giaGioThueVM1.giobatdau : 'N/A'}</td>
                    <td>${detail.giaGioThueVM1 ? detail.giaGioThueVM1.gioketthuc : 'N/A'}</td>
                    <td>${detail.giaGioThueVM1 ? detail.giaGioThueVM1.dongia : 'N/A'}</td>
                    <td>${detail.trangThai}</td>
                    <td>
                        ${detail.trangThai === 'Chờ xác nhận' ?
                    `<button class="btn btn-success btn-sm"
                        onclick="confirmRequest('${detail.stt}', '${detail.maSb}', '${detail.magio}', '${detail.ngaysudung}','Đã xác nhận')">
                    Xác nhận
                </button>
                <button class="btn btn-danger btn-sm"
                        onclick="confirmRequest('${detail.stt}', '${detail.maSb}', '${detail.magio}', '${detail.ngaysudung}','Đã từ chối')">
                    Từ chối
                </button>`
                    : ''
                }
                    </td>
                </tr>
            `;
        });

            content += `</tbody></table>`;
    document.getElementById('modalContent').innerHTML = content;
    $('#yeuCauModal').modal('show');
    }

    async function confirmRequest(stt, maSb, magio, ngaysudung, status) {
        const requestData = {Id: stt, MaSb: maSb, Magio: magio, Ngaysudung: ngaysudung, TrangThai: status };
    await updateYeuCau(requestData);
    }

    async function updateYeuCau(requestData) {
        const url = 'https://localhost:7182/api/YeuCauDatSan/update';

    try {
            const token = sessionStorage.getItem("Token");
    const response = await fetch(url, {
        method: "PUT",
    headers: {
        "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
                },
    body: JSON.stringify(requestData)
            });

    if (!response.ok) {
                throw new Error("Không thể cập nhật yêu cầu đặt sân.");
            }

    // Hủy DataTable nếu đã khởi tạo trước đó, sau đó khởi tạo lại
    if ($.fn.DataTable.isDataTable('#yeuCauTable')) {
        $('#yeuCauTable').DataTable().destroy();
        }
    await loadYeuCaus();
    $('#yeuCauModal').modal('hide');
        } catch (error) {
        console.error("Lỗi:", error);
    alert(error.message);
        }
    }

    $('.modalclose').on('click', function () {
        $('#yeuCauModal').modal('hide');
    });