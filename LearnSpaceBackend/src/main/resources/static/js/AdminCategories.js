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
        }

        toastMessage.textContent = message;
        const toast = new bootstrap.Toast(toastEl, {delay: 3000});
        toast.show();
    }

    const categoryModalEl = document.getElementById('categoryModal');
    if (categoryModalEl) {
        const categoryModal = new bootstrap.Modal(categoryModalEl);
        const categoryForm = document.getElementById('categoryForm');
        const modalTitle = document.getElementById('categoryModalTitle');

        const btnAdd = document.getElementById('btnAddCategory');
        if (btnAdd) {
            btnAdd.addEventListener('click', function () {
                modalTitle.innerHTML = '<i class="fa-solid fa-folder-plus me-2"></i> Thêm Danh Mục';
                categoryForm.reset();
                document.getElementById('categoryId').value = '';
                categoryModal.show();
            });
        }

        document.querySelectorAll('.btn-edit-category').forEach(btn => {
            btn.addEventListener('click', function () {
                modalTitle.innerHTML = '<i class="fa-solid fa-pen-to-square me-2"></i> Chỉnh Sửa Danh Mục';
                document.getElementById('categoryId').value = this.getAttribute('data-id');
                document.getElementById('categoryName').value = this.getAttribute('data-name');
                categoryModal.show();
            });
        });

        const btnSave = document.getElementById('btnSaveCategory');
        if (btnSave) {
            btnSave.addEventListener('click', function () {
                const catName = document.getElementById('categoryName').value.trim();
                if (!catName) {
                    alert('Vui lòng nhập tên danh mục!');
                    return;
                }

                categoryModal.hide();
                setTimeout(() => {
                    showToast('Đã lưu danh mục thành công!', 'success');
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
                deleteMessage.innerHTML = `Bạn có chắc chắn muốn xóa danh mục <strong>${itemName}</strong>? Nếu xóa, các khóa học thuộc danh mục này có thể bị ảnh hưởng.`;
                deleteForm.action = actionUrl;
                deleteModal.show();
            });
        });
    }
});