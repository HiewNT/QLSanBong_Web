document.addEventListener('DOMContentLoaded', () => {
    loadCart(); // Tải giỏ hàng khi trang được tải

    // Thêm sự kiện cho nút xóa tất cả
    const clearCartButton = document.getElementById('clearCartButton');
    if (clearCartButton) {
        clearCartButton.addEventListener('click', clearCart);
    }
});

// Hàm để xóa sản phẩm khỏi giỏ hàng
function removeFromCart(maSb, maGio, ngayDat) {
    const gioHang = {
        MaSb: maSb,
        Ngaysudung: ngayDat,
        Magio: maGio
    };

    fetch('https://localhost:7182/api/GioHang/delete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(gioHang)
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                return response.text().then(text => {
                    throw new Error(text || 'Failed to remove from cart');
                });
            }
        })
        .then(data => {
            alert("Xóa sản phẩm thành công!"); // Thông báo thành công
            removeItemFromSessionStorage(gioHang); // Xóa sản phẩm khỏi sessionStorage
            loadCart(); // Tải lại giỏ hàng
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Có lỗi xảy ra: ' + error.message);
        });
}

// Hàm để xóa tất cả sản phẩm trong giỏ hàng
function clearCart() {
    fetch('https://localhost:7182/api/GioHang/deleteall', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify([]) // Gửi một mảng rỗng
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to clear cart');
            }
        })
        .then(data => {
            alert("Giỏ hàng đã được xóa thành công!");
            sessionStorage.removeItem('gioHang'); // Xóa giỏ hàng trong sessionStorage
            loadCart(); // Tải lại giỏ hàng
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Có lỗi xảy ra: ' + error.message);
        });
}

// Hàm để xóa sản phẩm khỏi sessionStorage dựa trên khóa chính
function removeItemFromSessionStorage(itemToRemove) {
    let cart = JSON.parse(sessionStorage.getItem('gioHang')) || [];
    cart = cart.filter(item =>
        item.MaSb !== itemToRemove.MaSb ||
        item.Magio !== itemToRemove.Magio ||
        item.Ngaysudung !== itemToRemove.Ngaysudung
    );
    sessionStorage.setItem('gioHang', JSON.stringify(cart));
}

// Hàm lưu giỏ hàng vào sessionStorage
function saveToSessionStorage(gioHang) {
    let cart = JSON.parse(sessionStorage.getItem('gioHang')) || [];
    cart.push(gioHang);
    sessionStorage.setItem('gioHang', JSON.stringify(cart));
}

// Hàm để thêm sản phẩm vào giỏ hàng// Hàm để thêm sản phẩm vào giỏ hàng
function addToCart(maSan, ngayDatSan, maGio, tenSb, diaChi, gioBatDau, gioKetThuc, donGia) {
    const gioHang = {
        MaSb: maSan,
        Ngaysudung: ngayDatSan,
        Magio: maGio,
        TenSb: tenSb,
        DiaChi: diaChi,
        Giobatdau: gioBatDau,
        Gioketthuc: gioKetThuc,
        Dongia: donGia
    };

    fetch('https://localhost:7182/api/GioHang/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(gioHang)
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(errorData.message || 'Error adding to cart');
                });
            }
            return response.json(); // Chuyển đổi phản hồi thành JSON
        })
        .then(data => {
            if (data.result) {
                alert('Sản phẩm đã được thêm vào giỏ hàng!');
                saveToSessionStorage(gioHang); // Lưu vào sessionStorage
                loadCart(); // Tải lại giỏ hàng
            } else {
                throw new Error('Không thể thêm sản phẩm vào giỏ hàng');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Có lỗi xảy ra: ' + error.message);
        });
}



// Hàm để tải giỏ hàng từ sessionStorage
function loadCart() {
    const cart = JSON.parse(sessionStorage.getItem('gioHang')) || [];
    const cartItems = document.getElementById('cartItems');

    if (cartItems) {  // Kiểm tra xem phần tử 'cartItems' có tồn tại không
        if (cart.length > 0) {
            cartItems.innerHTML = cart.map(item => `
                <tr>
                    <td>${item.MaSb}</td>
                    <td>${item.TenSb}</td>
                    <td>${item.DiaChi}</td>
                    <td>${item.Ngaysudung}</td>
                    <td>${item.Giobatdau}</td>
                    <td>${item.Gioketthuc}</td>
                    <td><button onclick="removeFromCart('${item.MaSb}', '${item.Magio}', '${item.Ngaysudung}')">Xóa</button></td>
                </tr>
            `).join('');
        } else {
            cartItems.innerHTML = '<tr><td colspan="7">Giỏ hàng hiện tại đang trống.</td></tr>';
        }
    } else {
        console.error('Không tìm thấy phần tử #cartItems.');
    }
}
