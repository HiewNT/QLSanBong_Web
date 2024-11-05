document.addEventListener('DOMContentLoaded', () => {
    loadCart(); // Tải giỏ hàng khi trang được tải

    // Thêm sự kiện cho nút xóa tất cả
    const clearCartButton = document.getElementById('clearCartButton');
    if (clearCartButton) {
        clearCartButton.addEventListener('click', clearCart);
    }

});

// Hàm để tải giỏ hàng và hiển thị trên giao diện
function loadCart() {
    const cartContainer = document.getElementById('cartItems');
    if (!cartContainer) {
        console.error('Cart items container not found');
        return;
    }

    // Lấy giỏ hàng từ localStorage
    let cartItems = JSON.parse(localStorage.getItem('gioHang')) || [];

    // Hiển thị giỏ hàng từ localStorage
    cartContainer.innerHTML = ''; // Xóa nội dung cũ

    cartItems.forEach(item => {
        // Tạo HTML cho từng sản phẩm trong giỏ hàng
        const cartItemHtml = `
            <tr>
                <td>${item.MaSb}</td>
                <td>${item.Ngaysudung}</td>
                <td>${item.Magio}</td>
                <td>
                    <button class="btn remove-cart" 
                            data-ma-sb="${item.MaSb}" 
                            data-ma-gio="${item.Magio}" 
                            data-ngay-dat="${item.Ngaysudung}" 
                            onclick="removeFromCart('${item.MaSb}','${item.Magio}', '${item.Ngaysudung}')">
                        Xóa
                    </button>
                </td>
            </tr>
        `;
        cartContainer.innerHTML += cartItemHtml; // Thêm sản phẩm vào giỏ hàng
    });
}

// Hàm để xóa sản phẩm khỏi giỏ hàng
function removeFromCart(maSb, maGio, ngayDat) {
    const gioHang = {
        MaSb: maSb,
        Ngaysudung: ngayDat,
        Magio: maGio
    };

    fetch('https://localhost:7182/api/GioHang/delete', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(gioHang)
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to remove from cart');
            }
        })
        .then(data => {
            alert(data); // Hiển thị thông báo thành công
            // Cập nhật giỏ hàng trong localStorage
            updateLocalStorage();
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
            alert(data); // Hiển thị thông báo thành công
            localStorage.removeItem('gioHang'); // Xóa giỏ hàng trong localStorage
            loadCart(); // Tải lại giỏ hàng
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Có lỗi xảy ra: ' + error.message);
        });
}

// Hàm để cập nhật giỏ hàng trong localStorage
function updateLocalStorage() {
    const cartContainer = document.getElementById('cartItems');
    const rows = cartContainer.querySelectorAll('tr');

    const cartItems = Array.from(rows).map(row => {
        const cells = row.querySelectorAll('td');
        return {
            MaSb: cells[0].innerText,
            Ngaysudung: cells[1].innerText,
            Magio: cells[2].innerText
        };
    });

    // Lưu giỏ hàng vào localStorage
    localStorage.setItem('gioHang', JSON.stringify(cartItems));
}
