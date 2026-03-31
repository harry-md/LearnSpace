document.addEventListener("DOMContentLoaded", function () {
    function showToast(message, type = 'success') {
        const toastEl = document.getElementById('liveToast');
        if (!toastEl) return;

        const toastHeader = document.getElementById('toastHeader');
        const toastIcon = document.getElementById('toastIcon');
        const toastTitle = document.getElementById('toastTitle');
        const toastMessage = document.getElementById('toastMessage');
        const btnClose = toastHeader.querySelector('.btn-close');

        toastHeader.className = 'toast-header text-white';
        toastIcon.className = 'fa-solid me-2';
        btnClose.classList.add('btn-close-white');

        if (type === 'success') {
            toastHeader.classList.add('bg-success');
            toastIcon.classList.add('fa-check-circle');
            toastTitle.textContent = 'Thành công';
        } else if (type === 'error') {
            toastHeader.classList.add('bg-danger');
            toastIcon.classList.add('fa-circle-exclamation');
            toastTitle.textContent = 'Thất bại';
        } else if (type === 'warning') {
            toastHeader.classList.add('bg-warning', 'text-dark');
            toastHeader.classList.remove('text-white');
            btnClose.classList.remove('btn-close-white');
            toastIcon.classList.add('fa-triangle-exclamation');
            toastTitle.textContent = 'Cảnh báo';
        }

        toastMessage.textContent = message;
        const toast = new bootstrap.Toast(toastEl, {delay: 3000});
        toast.show();
    }


    const userModalEl = document.getElementById('userModal');
    if (userModalEl) {
        const userModal = new bootstrap.Modal(userModalEl);
        const userForm = document.getElementById('userForm');
        const modalTitle = document.getElementById('userModalTitle');
        const pwdInput = document.getElementById('password');
        const pwdLabel = document.getElementById('pwdLabel');

        const btnAdd = document.getElementById('btnAddUser');
        if (btnAdd) {
            btnAdd.addEventListener('click', function () {
                modalTitle.innerHTML = '<i class="fa-solid fa-user-plus me-2"></i> Thêm Người Dùng';
                userForm.reset();
                document.getElementById('userId').value = '';
                pwdInput.required = true;
                pwdLabel.innerHTML = 'Mật khẩu <span class="text-danger">*</span>';
                userModal.show();
            });
        }

        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', function () {
                modalTitle.innerHTML = '<i class="fa-solid fa-user-pen me-2"></i> Chỉnh Sửa Người Dùng';
                document.getElementById('userId').value = this.getAttribute('data-id');
                document.getElementById('username').value = this.getAttribute('data-username');
                document.getElementById('email').value = this.getAttribute('data-email');
                document.getElementById('firstName').value = this.getAttribute('data-firstname');
                document.getElementById('lastName').value = this.getAttribute('data-lastname');
                document.getElementById('role').value = this.getAttribute('data-role');
                pwdInput.required = false;
                pwdLabel.innerHTML = 'Mật khẩu mới (Bỏ trống nếu không đổi)';
                userModal.show();
            });
        });

        const btnSaveUser = document.getElementById('btnSaveUser');
        if (btnSaveUser) {
            btnSaveUser.addEventListener('click', function () {
                userModal.hide();
                setTimeout(() => {
                    let isSuccess = true;

                    if (isSuccess) {
                        showToast('Đã lưu thông tin người dùng thành công!', 'success');
                    } else {
                        showToast('Có lỗi xảy ra khi lưu dữ liệu. Vui lòng thử lại!', 'error');
                    }
                }, 500);

            });
        }
    }

    const deleteModalEl = document.getElementById('deleteConfirmModal');
    if (deleteModalEl) {
        const deleteModal = new bootstrap.Modal(deleteModalEl);
        const deleteForm = document.getElementById('deleteForm');
        const deleteMessage = document.getElementById('deleteConfirmMessage');

        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                const itemName = this.getAttribute('data-name');
                const actionUrl = this.getAttribute('data-url');
                deleteMessage.innerHTML = `Bạn có chắc chắn muốn xóa vĩnh viễn <strong>${itemName}</strong>?`;
                deleteForm.action = actionUrl;
                deleteModal.show();
            });
        });
    }

});