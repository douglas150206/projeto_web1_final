const productForm = document.querySelector("#product-form");
const nameInput = document.querySelector("#product-name");
const categoryInput = document.querySelector("#product-category");
const priceInput = document.querySelector("#product-price");
const quantityInput = document.querySelector("#product-quantity");
const productList = document.querySelector("#product-list");
const totalDisplay = document.querySelector("#total");
const searchInput = document.querySelector("#search-input");
const eraseBtn = document.querySelector("#erase-button");
const filterStatus = document.querySelector("#filter-select");
const filterCategory = document.querySelector("#category-filter");

const editModal = document.querySelector("#edit-modal");
const editForm = document.querySelector("#edit-form");
const editName = document.querySelector("#edit-name");
const editCategory = document.querySelector("#edit-category");
const editPrice = document.querySelector("#edit-price");
const editQuantity = document.querySelector("#edit-quantity");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");

let currentEditProduct = null;

let products = JSON.parse(localStorage.getItem("products")) || [];

const renderProducts = () => {
  productList.innerHTML = "";
  const search = searchInput.value.toLowerCase();
  const statusFilter = filterStatus.value;
  const categoryFilter = filterCategory.value;

  let total = 0;  
  let categories = new Set();

  products.forEach((product, index) => {
    const matchesSearch = product.name.toLowerCase().includes(search);
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "done" && product.done) || 
      (statusFilter === "todo" && !product.done);
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;

    categories.add(product.category);

    if (matchesSearch && matchesStatus && matchesCategory) {
      const item = document.createElement("div");
      item.className = `product${product.done ? " done" : ""}`;

      const info = document.createElement("div");
      info.className = "product-info";
      info.innerHTML = ` 
        <strong>${product.name}</strong> - ${product.category} |
        R$ ${product.price.toFixed(2)} x ${product.quantity}
      `;
      item.appendChild(info);

      const doneBtn = document.createElement("button");
      doneBtn.innerHTML = `<i class="fa-solid fa-check"></i>`;
      doneBtn.addEventListener("click", () => {
        product.done = !product.done;
        saveAndRender();
      });

      const editBtn = document.createElement("button");
      editBtn.innerHTML = `<i class="fa-solid fa-pen"></i>`;
      editBtn.addEventListener("click", () => {
        currentEditProduct = index;
        editName.value = product.name;
        editCategory.value = product.category;
        editPrice.value = product.price;
        editQuantity.value = product.quantity;
        editModal.classList.remove("hide");
      });

      const deleteBtn = document.createElement("button");
      deleteBtn.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
      deleteBtn.addEventListener("click", () => {
        products.splice(index, 1);
        saveAndRender();
      });

      item.append(doneBtn, editBtn, deleteBtn);
      productList.appendChild(item);

      total += product.price * product.quantity;
    }
  });
  
  filterCategory.innerHTML = '<option value="all">Todas as Categorias</option>';
  [...categories].sort().forEach((cat) => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.innerText = cat;
    filterCategory.appendChild(opt);
  });

  totalDisplay.textContent = total.toFixed(2);  
};

const saveAndRender = () => {
  localStorage.setItem("products", JSON.stringify(products));
  renderProducts();
};

productForm.addEventListener("submit", (e) => {
  e.preventDefault();
  products.push({
    name: nameInput.value,
    category: categoryInput.value,
    price: parseFloat(priceInput.value),
    quantity: parseInt(quantityInput.value),
    done: false,
  });
  nameInput.value = categoryInput.value = priceInput.value = quantityInput.value = "";
  saveAndRender();
});

editForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (currentEditProduct !== null) {
    products[currentEditProduct] = {
      ...products[currentEditProduct],
      name: editName.value,
      category: editCategory.value,
      price: parseFloat(editPrice.value),
      quantity: parseInt(editQuantity.value),
    };
    currentEditProduct = null;
    editModal.classList.add("hide");
    saveAndRender();
  }
});

cancelEditBtn.addEventListener("click", () => {
  editModal.classList.add("hide");
  currentEditProduct = null;
});

searchInput.addEventListener("input", renderProducts);
eraseBtn.addEventListener("click", (e) => {
  e.preventDefault();
  searchInput.value = "";
  renderProducts();
});
filterStatus.addEventListener("change", renderProducts);
filterCategory.addEventListener("change", renderProducts);

renderProducts();
